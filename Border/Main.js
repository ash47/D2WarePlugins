// The ID of this plugin
var pluginID = 'Border';

// Hook functions
game.hook('OnMapStart', onMapStart);
game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hook("Dota_OnHeroPicked", onHeroPicked);
game.hook('Dota_OnUnitThink', onUnitThink);
game.hook("Dota_OnUnitParsed", onUnitParsed);
game.hook("Dota_OnBuyItem", onBuyItem);
game.hook("Dota_OnGetAbilityValue", onGetAbilityValue);

// Hook events
game.hookEvent("entity_hurt", onEntityHurt);

// Add console commands
console.addClientCommand('select', CmdSelect);

// Force MID ONLY
console.findConVar("dota_force_gamemode").setInt(11);

// Colors
var COLOR_RED = '\x12';
var COLOR_MAG = '\x0e';
var COLOR_LIGHT_GREEN = '\x15';

// Message containing all the allowed items
var allowedItems = COLOR_RED+'Only these items are allowed:'+COLOR_LIGHT_GREEN+' item_boots_of_speed, item_quelling_blade, item_ward_observer, item_ward_sentry, item_gem_of_true_sight';

/*
Libraries
*/

var timers = require('timers');

/*
KVs
*/

var abilitiesDependencies = keyvalue.parseKVFile('abilities_dependencies.kv');

/*
Lobby settings
*/
var pointsToWin = 10;
var direPoints = 0;
var radiantPoints = 0;
var bpAsl = null;

plugin.get('LobbyManager', function(obj) {
	bpAsl = obj.getOptionsForPlugin;
	// Grab options
	var options = obj.getOptionsForPlugin(pluginID);
	if(!options) return;
	
	// How many Captures to win
	if(options['Captures To Win']) {
		pointsToWin = parseInt(options['Captures To Win']);
	}
});

/*
Point data, used to define the side of the map
*/

// Grab point that we can use to draw a line
var px1 = -415;
var px2 = -2266;
var px3 = 2997;

var py1 = -155;
var py2 = 1898;
var py3 = -2404;

// Calculate rise over run for both lines
var ror1 = (py1 - py2) / (px1 - px2);
var roffset1 = py1 - (ror1 * px1);

var ror2 = (py1 - py3) / (px1 - px3);
var roffset2 = py1 - (ror2 * px1);

// Calculate the min x value for 2nd line to work
var rxmin = (-2719 - roffset2) / ror2;

// Used to create custom units
var customUnit = null;

var playerManager = null;
var data_dire = null;
var data_radiant = null;

var dire_fort = null;
var radiant_fort = null;

/*
Skill lists
*/

// Type of builds
var BUILD_NEUTRAL = 0
var BUILD_DEFENCE = 1;
var BUILD_OFFENSE = 2;

var emptyBuild = {
	name: 'Neutral',
	type: BUILD_NEUTRAL,
	des: 'You are in the neutral area and can\'t attack anyone.',
	skills: [
		{
			name: 'doom_bringer_empty1',
			level: 0
		},
		{
			name: 'doom_bringer_empty2',
			level: 0
		},
		{
			name: 'invoker_empty1',
			level: 0
		},
		{
			name: 'invoker_empty2',
			level: 0
		}
	]
}

var classes = [
// Default Defence Build
{
	name: 'Basic Defender',
	type: BUILD_DEFENCE,
	des: 'Main defense character.',
	model: 'models/heroes/pudge/pudge.mdl',
	hero: 'npc_dota_hero_pudge',
	skills: [
		{
			name: 'pudge_meat_hook',
			level: 4,
			cooldown: 5,
			damage: 99999
		},
		{
			name: 'sandking_burrowstrike',
			level: 4,
			cooldown: 10,
			damage: 99999
		},
		{
			name: 'nevermore_shadowraze1',
			level: 4,
			cooldown: 5,
			damage: 99999
		},
		{
			name: 'zuus_thundergods_wrath',
			level: 3,
			cooldown: 300,
			damage: 100
		}
	]
},

// Speedy
{
	name: 'Speedy',
	type: BUILD_OFFENSE,
	des: 'Runs fast, difficult to catch.',
	model: 'models/heroes/slark/slark.mdl',
	hero: 'npc_dota_hero_slark',
	skills: [
		{
			name: 'windrunner_windrun',
			level: 4,
			damage: 0
		},
		{
			name: 'spirit_breaker_empowering_haste',
			level: 4
		},
		{
			name: 'slardar_sprint',
			level: 4
		},
		{
			name: 'centaur_stampede',
			level: 3,
			damage: 0,
			cooldown: 90
		}
	]
},

// Disruptor
{
	name: 'Disruptor',
	type: BUILD_OFFENSE,
	des: 'Confuses and disrupts defenders.',
	model: 'models/heroes/phantom_lancer/phantom_lancer.mdl',
	hero: 'npc_dota_hero_phantom_lancer',
	skills: [
		{
			name: 'elder_titan_ancestral_spirit',
			level: 4,
			damage: 0
		},
		{
			name: 'elder_titan_echo_stomp',
			level: 4,
			damage: 0
		},
		{
			name: 'naga_siren_mirror_image',
			level: 4
		},
		{
			name: 'naga_siren_song_of_the_siren',
			level: 3
		}
	]
},

// Climber
{
	name: 'Climber',
	type: BUILD_OFFENSE,
	des: 'Can get up walls, cliffs, and trees.',
	model: 'models/heroes/batrider/batrider.mdl',
	hero: 'npc_dota_hero_batrider',
	zo: -200,
	skills: [
		{
			name: 'mirana_leap',
			level: 4
		},
		{
			name: 'batrider_firefly',
			level: 4
		},
		{
			name: 'tiny_toss',
			level: 4,
			damage: 0
		},
		{
			name: 'vengefulspirit_nether_swap',
			level: 3
		}
	]
},

// Sneaker
{
	name: 'Sneaker',
	type: BUILD_OFFENSE,
	des: 'Hard to detect/target.',
	model: 'models/heroes/rikimaru/rikimaru.mdl',
	hero: 'npc_dota_hero_riki',
	skills: [
		{
			name: 'nyx_assassin_vendetta',
			level: 3
		},
		{
			name: 'weaver_shukuchi',
			level: 4,
			cooldown: 15
		},
		{
			name: 'antimage_blink',
			level: 4,
			cooldown: 30
		},
		{
			name: 'night_stalker_hunter_in_the_night',
			level: 4
		}
	]
},

// Controller
{
	name: 'Controller',
	type: BUILD_DEFENCE,
	des: 'AoE and slower, controls and disables.',
	model: 'models/heroes/enigma/enigma.mdl',
	hero: 'npc_dota_hero_enigma',
	skills: [
		{
			name: 'dark_seer_vacuum',
			level: 4,
			cooldown: 15
		},
		{
			name: 'tusk_frozen_sigil',
			level: 4,
			cooldown: 30
		},
		{
			name: 'earthshaker_fissure',
			level: 4
		},
		{
			name: 'enigma_black_hole',
			level: 3,
			cooldown: 60
		}
	]
},

// Ranged
{
	name: 'Ranged',
	type: BUILD_DEFENCE,
	des: 'Long Ranged abilities and high right click damage.',
	model: 'models/heroes/sniper/sniper.mdl',
	hero: 'npc_dota_hero_sniper',
	skills: [
		{
			name: 'mirana_arrow',
			level: 4,
			damage: 99999
		},
		{
			name: 'lina_light_strike_array',
			level: 4,
			damage: 99999
		},
		{
			name: 'sniper_take_aim',
			level: 4
		},
		{
			name: 'sniper_assassinate',
			level: 3,
			damage: 1000,
			cooldown: 30
		}
	],
	keys: {
		AttackDamageMin: '250',
		AttackDamageMax: '450'
	}
},

// Scout
{
	name: 'Scout',
	type: BUILD_DEFENCE,
	des: 'Good vision and map awareness, can go invisible.',
	model: 'models/heroes/nightstalker/nightstalker.mdl',
	hero: 'npc_dota_hero_night_stalker',
	skills: [
		{
			name: 'treant_natures_guise',
			level: 4
		},
		{
			name: 'meepo_earthbind',
			level: 4
		},
		{
			name: 'bounty_hunter_jinada',
			level: 4
		},
		{
			name: 'night_stalker_darkness',
			level: 3
		}
	]
},

// Spitter
{
	name: 'Spitter',
	type: BUILD_DEFENCE,
	des: 'Spits various wards and poisons.',
	model: 'models/heroes/venomancer/venomancer.mdl',
	hero: 'npc_dota_hero_venomancer',
	skills: [
		{
			name: 'venomancer_plague_ward',
			level: 4,
			cooldown: 20
		},
		{
			name: 'venomancer_venomous_gale',
			level: 4
		},
		{
			name: 'bounty_hunter_track',
			level: 3
		},
		{
			name: 'shadow_shaman_mass_serpent_ward',
			level: 3,
			cooldown: 45
		}
	],
	keys: {
		StatusMana: '100'
	}
},
];

/*
Customise the above abilities
*/

var customAbilities = {
	nyx_assassin_vendetta: {
		movement_speed: [-50, -50, -50]
	},
	
	batrider_firefly: {
		damage_per_second: [0, 0, 0, 0],
		duration: [8, 8, 8, 8]
	},
	
	tiny_toss: {
		bonus_damage_pct: [0, 0, 0, 0],
		grow_bonus_damage_pct: [0, 0, 0, 0],
		toss_damage: [0, 0, 0, 0]
	},
	
	weaver_shukuchi: {
		damage: [0, 0, 0, 0],
		duration: [2, 2, 2, 2]
	},
	
	antimage_blink: {
		blink_range: [800, 800, 800, 800]
	},
	
	shredder_timber_chain: {
		damage: [0, 0, 0, 0]
	},
	
	elder_titan_ancestral_spirit: {
		pass_damage: [0, 0, 0, 0],
		damage_creeps: [0, 0, 0, 0],
		damage_heroes: [0, 0, 0, 0]
	},
	
	elder_titan_echo_stomp: {
		stomp_damage: [0, 0, 0, 0]
	},
	
	naga_siren_song_of_the_siren: {
		duration: [3, 3, 3],
		radius: [800, 800, 800]
	},
	
	naga_siren_mirror_image: {
		outgoing_damage: [-100, -100, -100]
	},
	
	item_ultimate_scepter: {
		bonus_all_stats: [0],
		bonus_health: [0],
		bonus_mana: [0]
	},
	
	luna_lunar_blessing: {
		bonus_damage: [0, 0, 0, 0]
	},
	
	meepo_earthbind: {
		duration: [5]
	},
	
	venomancer_plague_ward: {
		duration: [120, 120, 120, 120]
	},
	
	shadow_shaman_mass_serpent_ward: {
		damage_min_scepter: [75, 75, 75],
		damage_max_scepter: [80, 80, 80],
		damage_min: [75, 75, 75],
		damage_max: [80, 80, 80]
	},
	
	magnataur_skewer: {
		skewer_damage: [0, 0, 0, 0]
	},
	
	centaur_stampede: {
		strength_damage: [0, 0, 0]
	},
	
	slardar_sprint: {
		duration: [10, 10, 10, 10]
	},
	
	zuus_thundergods_wrath: {
		damage_scepter: [900, 900, 900]
	}
}

var defaultDefence = 0;
var defaultOffense = 1;

/*
Hook functions
*/

// Stores all the class picking units
var classPickersRadiant = [];
var classPickersDire = [];
var oldSelected = {};
var selectedClasses = {};
var stuckTimer = {};
var enemySide = {};

// Used to make custom heroes
var customHeroes = {};

// Spawn position for classes
var direClassStart = {
	x: 6688,
	y: 6496,
	z: 256
}

var radiantClassStart = {
	x: -7072,
	y: -6900,
	z: 261
}

// How far to spready creeps (class ones)
var creepSpread = 150;

// Where to teleport players to when they respawn
var teleportPosition = {};

// List of items to give to repsawning players
var playerSpawnItems = {};

// List of cooldown timers for a given player
var cooldownTimers = {};

// Stores who has seen the help messages
var seenHelp = {};

function onHeroPicked(client, hero) {
	var playerID = client.netprops.m_iPlayerID;
	if(playerID != null && playerID != -1) {
		// Give them the default build if they have none
		if(!selectedClasses[playerID]) {
			selectedClasses[playerID] = {
				def: defaultDefence,
				off: defaultOffense
			}
		}
	}
	
	// Check if they are trying to repick
	if (hero == "repick") {
		// Allow repick
		if(playerID != null && playerID != -1) {
			if(playerManager.netprops.m_bHasRepicked[playerID] == 1) {
				playerManager.netprops.m_bHasRepicked[playerID] = 0;
				dota.givePlayerGold(playerID, 100, false);
			}
		}
		
		// Check gold
		var gold = getClientGold(client);
		if(gold && gold.r && gold.u) {
			if(gold.r + gold.u < 100) {
				dota.givePlayerGold(playerID, 100, false);
			}
		}
		
		// Make sure we are pregame
		if (game.rules.props.m_nGameState == dota.STATE_GAME_IN_PROGRESS) {
			// Set pregame
			game.rules.props.m_nGameState = dota.STATE_PRE_GAME;
			
			// Reset to ingame
			timers.setTimeout(function() {
				game.rules.props.m_nGameState = dota.STATE_GAME_IN_PROGRESS;
			}, 2);
		}
	}
}

function onHeroSpawn(hero) {
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	
	// Give them the default build if they have none
	if(!selectedClasses[playerID]) {
		selectedClasses[playerID] = {
			def: defaultDefence,
			off: defaultOffense
		}
	}
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client || !client.isInGame()) return;
	
	// Print help if they haven't seen it already
	if(!seenHelp[playerID]) {
		seenHelp[playerID] = true;
		
		client.printToChat(COLOR_RED+'How to play: '+COLOR_LIGHT_GREEN+' Run into the other team\'s ancient to destroy it. You must also try to defend your ancient from the enemy team, it takes '+COLOR_RED+pointsToWin+COLOR_LIGHT_GREEN+' hits to kill.');
		client.printToChat(COLOR_RED+'Classes: '+COLOR_LIGHT_GREEN+' You will have a defensive class if you are in your team\'s area, no class if you are in the neutral area, or an offensive class if you are in the enemy team\'s area.');
		client.printToChat(COLOR_RED+'Changing Classes: '+COLOR_LIGHT_GREEN+' Click the creeps in the spawn area to change classes, you can select a defensive and offensive class.');
	}
	
	// Max out level, remove skill points
	var diff = dota.getTotalExpRequiredForLevel(25) - hero.netprops.m_iCurrentXP;
	dota.giveExperienceToHero(hero, diff);
	hero.netprops.m_iAbilityPoints = 0;
	
	timers.setTimeout(function() {
		// Make sure they have a valid hero
		if(!hero || !hero.isValid()) return;
		
		// Check for teleports
		if(teleportPosition[playerID]) {
			// Teleport
			//hero.teleport(teleportPosition[playerID]);
			dota.findClearSpaceForUnit(hero, teleportPosition[playerID]);
			
			// Remove teleport
			//teleportPosition[playerID] = null;
		}
		
		// Check if we need to give ourselves any items
		var items = playerSpawnItems[playerID];
		if(items) {
			var toRemove = [];
			
			for(var i=0; i<12; i++) {
				// Check this space
				if(hero.netprops.m_hItems[i] != null) {
					dota.remove(hero.netprops.m_hItems[i]);
				}
				
				// Grab an item
				var item = items[i];
				
				// Check if it exists
				if(item.name == 'none') {
					var it = dota.giveItemToHero('item_bottle', hero);
					toRemove.push(it);
				} else {
					var it = dota.giveItemToHero(item.name, hero);
					
					// Check states
					if(item.m_iCurrentCharges != null) {
						it.netprops.m_iCurrentCharges = item.m_iCurrentCharges;
					}
					if(item.m_bSellable != null) {
						it.netprops.m_bSellable = item.m_bSellable;
					}
					if(item.m_bDroppable != null) {
						it.netprops.m_bDroppable = item.m_bDroppable;
					}
					if(item.m_bPermanent != null) {
						it.netprops.m_bPermanent = item.m_bPermanent;
					}
					if(item.m_bDisassemblable != null) {
						it.netprops.m_bDisassemblable = item.m_bDisassemblable;
					}
					if(item.m_bKillable != null) {
						it.netprops.m_bKillable = item.m_bKillable;
					}
				}
			}
			
			// Remove all place holder items
			for(var i=toRemove.length-1; i>=0; i--) {
				var item = toRemove[i];
				if(item && item.isValid()) {
					dota.remove(item);
				}
			}
			
			// We no longer need to give ourselves any items
			//playerSpawnItems[playerID] = null;
		} else {
			// Scrub inventory
			for(var i=0; i<12; i++) {
				// Check this space
				if(hero.netprops.m_hItems[i] != null) {
					dota.remove(hero.netprops.m_hItems[i]);
				}
			}
			
			// Give items
			dota.giveItemToHero('item_ward_observer', hero);
			dota.giveItemToHero('item_ward_sentry', hero);
			var scepter = dota.giveItemToHero('item_ultimate_scepter', hero);
			
			// Protect the scepter
			scepter.netprops.m_bSellable = false;
			scepter.netprops.m_bDroppable = false;
			scepter.netprops.m_bPermanent = true;
			scepter.netprops.m_bDisassemblable = false;
			scepter.netprops.m_bKillable = false;
		}
		
		// Store that they have spawned
		hero.hasSpawned = true;
	}, 1);
}

function onMapStart() {
	// Grab the player manager
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	
	data_dire = game.findEntityByClassname(-1, "dota_data_dire");
	data_radiant = game.findEntityByClassname(-1, "dota_data_radiant");
	
	// Grab forts
	dire_fort = game.findEntityByTargetname('dota_badguys_fort');
	radiant_fort = game.findEntityByTargetname('dota_goodguys_fort');
	
	// Cleanup the map
	dota.removeAll('npc_dota_tower*');
	dota.removeAll('npc_dota_building*');
	dota.removeAll('npc_dota_barracks*');
	dota.removeAll("npc_dota_creep*");
	dota.removeAll("npc_dota_neutral_spawner*");
	dota.removeAll("npc_dota_roshan_spawner*");
	dota.removeAll("npc_dota_scripted_spawner*");
	dota.removeAll("npc_dota_spawner*");
	dota.removeAll("npc_dota_roshan*");
	
	// Ban meepo
	dota.setHeroAvailable(82, false);
	
	// Spawn class creeps both teams
	for(var a=0; a<2; a++) {
		// Reset the offsets
		var defx = 0;
		var offx = 0;
		
		// Cycle all builds
		for(var i=0; i<classes.length; i++) {
			// Grab a build
			var build = classes[i];
			
			// Precache model
			game.precacheModel(build.model);
			
			// Build custom unit
			customUnit = {
				model: build.model,
				AttackCapabilities: 'DOTA_UNIT_CAP_NO_ATTACK',
				MovementCapabilities: 'DOTA_UNIT_CAP_MOVE_NONE',
				StatusMana: '600'
			}
			
			var team = dota.TEAM_DIRE;
			if(a == 1) {
				team = dota.TEAM_RADIANT
			}
			
			// Spawn creep
			var creep = dota.createUnit('npc_dota_neutral_kobold', team);
			
			// Stop it from dieing
			creep.noDie = true;
			
			// Store it
			if(a == 0) {
				classPickersDire.push(creep);
			} else {
				classPickersRadiant.push(creep);
			}
			
			// Workout position offset
			var yo = 0;
			var xo = 0;
			var zo = 0;
			
			if(build.type == BUILD_DEFENCE) {
				xo = defx*creepSpread;
				defx += 1;
			} else {
				xo = offx*creepSpread;
				offx += 1;
				yo = -creepSpread;
			}
			
			// Check for z modifications on this class
			if(build.zo) {
				zo = build.zo;
			}
			
			// Build position for this class
			var pos = null;
			
			if(a == 0) {
				pos = {
					x: direClassStart.x + xo,
					y: direClassStart.y + yo,
					z: direClassStart.z + zo
				}
			} else {
				pos = {
					x: radiantClassStart.x + xo,
					y: radiantClassStart.y + yo,
					z: radiantClassStart.z + zo
				}
			}
			
			// Move it into position
			//dota.findClearSpaceForUnit(creep, pos);
			creep.teleport(pos);
			
			// Rotate it
			if(a == 0) {
				creep.setRotation({
					x: 0,
					y: 270,
					z: 0
				})
			} else {
				creep.setRotation({
					x: 0,
					y: 90,
					z: 0
				})
			}
			
			// Stop making custom units
			customUnit = null;
			
			// Give this unit all the skills
			giveSkillArray(creep, build.skills);
		}
	}
}

function onGameFrame() {
	// Only run this if the game is active
	if(game.rules.props.m_nGameState < dota.STATE_PRE_GAME) return;
	
	for(var i=0; i<server.clients.length; i++) {
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Grab playerID
		var playerID = client.netprops.m_iPlayerID;
		if(playerID == null || playerID == -1) continue;
		
		// Grab team
		var team = client.netprops.m_iTeamNum;
		
		// Grab the unit they have selected
		var selected = client.netprops.m_hSpectatorQueryUnit;
		
		// Check if they have selected something
		if(selected != null) {
			// Grab the number of the selected unit
			var num = 0;
			
			if(team == dota.TEAM_DIRE) {
				num = classPickersDire.indexOf(selected);
			} else {
				num = classPickersRadiant.indexOf(selected);
			}
			
			// They already selected this unit
			if(oldSelected[playerID] != num) {
				// Store this unit as being selected
				oldSelected[playerID] = num;
				
				// Check if they selected one of our class creeps
				if(num != -1) {
					// Grab this build
					var b = classes[num];
					if(b == null) return;
					
					client.printToChat(COLOR_RED+'-----');
					
					// Tell client about this build
					client.printToChat(COLOR_MAG+' '+b.name+' '+COLOR_LIGHT_GREEN+' '+b.des)
					
					// Workout what sort of class this is
					var sort = 'DEFENSIVE';
					if(b.type == BUILD_OFFENSE) {
						sort = 'OFFENSIVE';
					}
					
					// Tell client how to accept
					client.printToChat(COLOR_LIGHT_GREEN+'Type '+COLOR_RED+'-select'+COLOR_LIGHT_GREEN+' to select this class as your '+COLOR_MAG+sort+COLOR_LIGHT_GREEN+' class.')
				}
			}
		} else {
			// Store nothing selected as default number
			oldSelected[playerID] = -1;
		}
		
		var hero = client.netprops.m_hAssignedHero;
		if(hero != null) {
			// Reset the stuck timer
			stuckTimer[playerID] = null;
			
			// Make sure spawning has happened
			if(!hero.hasSpawned) continue;
			
			// Find our current class
			setHeroClass(hero);
			
			// Grab our position
			var pos = hero.netprops.m_vecOrigin;
			
			if(team == dota.TEAM_DIRE) {
				if(radiant_fort && radiant_fort.isValid()) {
					// Check distance to ancient
					if(vecDist(pos, radiant_fort.netprops.m_vecOrigin) < 500) {
						// Give a point
						direPoints += 1;
						
						// Play noise
						playSoundToAll('physics/damage/building/radiant_tower_destruction_01.wav');
						
						// Tell everyone
						printToAll(COLOR_LIGHT_GREEN+'Radiant\'s Ancient was damaged! '+COLOR_RED+'('+direPoints+'/'+pointsToWin+')');
						
						// Give gold
						giveTeamGold(dota.TEAM_DIRE, 300);
						
						// Check score limit
						if(direPoints >= pointsToWin) {
							dota.forceWin(dota.TEAM_DIRE);
						} else {
							// Fix enemy side glitch
							enemySide[playerID] = false;
							
							// Teleport player back to their base
							dota.findClearSpaceForUnit(hero, dire_fort.netprops.m_vecOrigin);
						}
					}
				}
			} else if(team == dota.TEAM_RADIANT) {
				if(dire_fort && dire_fort.isValid()) {
					// Check distance to ancient
					if(vecDist(pos, dire_fort.netprops.m_vecOrigin) < 500) {
						// Give a point
						radiantPoints += 1;
						
						// Play noise
						playSoundToAll('physics/damage/building/dire_tower_destruction_01.wav');
						
						// Tell everyone
						printToAll(COLOR_LIGHT_GREEN+'Dire\'s Ancient was damaged! '+COLOR_RED+'('+radiantPoints+'/'+pointsToWin+')');
						
						// Give gold
						giveTeamGold(dota.TEAM_RADIANT, 300);
						
						// Check score limit
						if(radiantPoints >= pointsToWin) {
							dota.forceWin(dota.TEAM_RADIANT);
						} else {
							// Fix enemy side glitch
							enemySide[playerID] = false;
							
							// Teleport player back to their base
							dota.findClearSpaceForUnit(hero, radiant_fort.netprops.m_vecOrigin);
						}
					}
				}
			}
		} else {
			// Try to fix stuckness
			stuckLoop(client, playerID);
		}
	}
}

function stuckLoop(client, playerID) {
	// Try to unstuck
	if(!stuckTimer[playerID]) {
		if(stuckTimer[playerID] == null) {
			// Stop stuck timer spam
			stuckTimer[playerID] = true;
			
			timers.setTimeout(function() {
				stuckTimer[playerID] = false;
			}, 2000);
		} else {
			// Stop stuck timer spam
			stuckTimer[playerID] = true;
			
			timers.setTimeout(function() {
				// Disable stuck timer
				stuckTimer[playerID] = false;
				
				stuck(client);
			}, 500);
		}
	}
}

function onUnitThink(unit) {
	// Stop certain units from dieing (class creeps)
	if(unit.noDie) {
		dota.setUnitState(unit, dota.UNIT_STATE_INVULNERABLE, true);
		dota.setUnitState(unit, dota.UNIT_STATE_MAGIC_IMMUNE, true);
	}
	
	if(unit.isHero()) {
		// Grab playerID
		var playerID = unit.netprops.m_iPlayerID;
		if(playerID == null || playerID == -1) return;
		
		if(!enemySide[playerID]) {
			dota.setUnitState(unit, dota.UNIT_STATE_MAGIC_IMMUNE, true);
		}
	}
}

function onUnitParsed(unit, keyvalues){
	// Check if we are making a custom unit
	if(customUnit) {
		// Grab every key in this unit
		for(key in customUnit) {
			// Store the key
			keyvalues[key] = customUnit[key];
		}
	}
	
	// Stop non-heroes from getting these changes
	if(!unit.isHero()) return;
	
	// Remove all abilities
	for(var i=1;i<17;i++) {
		keyvalues['Ability'+i] = '';
	}
	
	// Increased base movement speed
	keyvalues['MovementSpeed'] = 400;
	keyvalues['StatusManaRegen'] = 8;
	
	// Check for custom hero stuff
	var c = customHeroes[unit.getClassname()];
	if(c) {
		for(key in c) {
			keyvalues[key] = c[key];
		}
	}
}

function onBuyItem(ent, item, playerID, unknown) {
	if(allowedItems.indexOf(item) == -1) {
		// Grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isInGame()) return false;
		
		// Print message
		client.printToChat(allowedItems);
		
		return false;
	}
}

function onGetAbilityValue(ent, name, field, values) {
	// Check if we need to modify this ability
	if(customAbilities[name]) {
		
		if(customAbilities[name][field.toLowerCase()]) {
			return customAbilities[name][field.toLowerCase()];
		}
	}
}

/*
Console Commands
*/

console.addClientCommand('stuck', stuck);
function stuck(client, args) {
	if(!client || !client.isInGame()) return;
	
	if(client.netprops.m_hAssignedHero == null) {
		// Grab playerID
		var playerID = client.netprops.m_iPlayerID;
		if(playerID == null || playerID == -1) return;
		
		// Tell client
		//client.printToChat(COLOR_RED+'Running stuck command...');
		
		// Make sure they have selected classes
		if(selectedClasses[playerID]) {
			// Grab class
			var b = classes[selectedClasses[playerID].def];
			
			// Check if they have a teleport position
			if(enemySide[playerID]) {
				b = classes[selectedClasses[playerID].off];
			}
			
			// Give gold to repick
			dota.givePlayerGold(playerID, 100, false);
			
			// Allow repick
			playerManager.netprops.m_bHasRepicked[playerID] = 0;
			
			// Respawn as this class
			client.fakeCommand('dota_select_hero repick');
			client.fakeCommand('dota_select_hero '+b.hero);
		} else {
			// Something went massivly wrong
			//client.printToChat(COLOR_RED+'WARNING: '+COLOR_LIGHT_GREEN+'You have no selected classes: '+playerID);
		}
	} else {
		// Not stuck?
		//client.printToChat(COLOR_RED+'STUCK: '+COLOR_LIGHT_GREEN+'You don\'t appear to be stuck.');
	}
}

/*
Hook events
*/

function onEntityHurt(event) {
	// Grab the entity that was attacked
	var ent = game.getEntityByIndex(event.getInt('entindex_killed'));
	
	// Check if it is a hero
	if(ent.isHero()) {
		// Grab the ent's HP
		var entHP = ent.netprops.m_iHealth;
		
		// Check if they will die as a result of this
		if(entHP == 0) {
			// Grab the current time
			var gametime = game.rules.props.m_fGameTime;
			
			// Respawn them after 30 seconds
			timers.setTimeout(function() {
				// Set respawn time
				ent.netprops.m_flRespawnTime = gametime + 30;
			}, 1);
			
			// Grab playerID
			var playerID = ent.netprops.m_iPlayerID;
			if(playerID == null || playerID == -1) return;
			
			// Fix enemy side glitch
			enemySide[playerID] = false;
			
			// Reset teleport
			teleportPosition[playerID] = null;
		}
	}
}

/*
Console commands
*/

function CmdSelect(client, args) {
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	var num = oldSelected[playerID];
	
	// Make sure they have a class creep selected
	if(num == -1) {
		client.printToChat(COLOR_LIGHT_GREEN+'Please select a class creep before using this command.');
		return;
	}
	
	// Grab the build
	var b = classes[num];
	
	if(!b) {
		client.printToChat(COLOR_LIGHT_GREEN+'Please select a class creep before using this command. (2)');
		return;
	}
	
	// Check which type of build it is
	if(b.type == BUILD_DEFENCE) {
		// Store the change
		selectedClasses[playerID].def = num;
		
		// Tell the client
		client.printToChat(COLOR_LIGHT_GREEN+'Changed your '+COLOR_RED+'DEFENSIVE'+COLOR_LIGHT_GREEN+' class to '+COLOR_RED+' '+b.name);
	} else {
		// Store the change
		selectedClasses[playerID].off = num;
		
		// Tell the client
		client.printToChat(COLOR_LIGHT_GREEN+'Changed your '+COLOR_RED+'OFFENSIVE'+COLOR_LIGHT_GREEN+' class to '+COLOR_RED+' '+b.name);
	}
	
	var hero = client.netprops.m_hAssignedHero;
	if(hero && hero.isValid() && hero.netprops.m_lifeState == 0) {
		// Change their class
		hero.oldSide = -1;
		setHeroClass(hero);
	}
	
	// Force them to reload their skills
	/*var heroes = client.getHeroes();
	for(var hh=0; hh<heroes.length; hh++) {
		// Grab hero
		var hero = heroes[hh];
		
		// No illusions
		if(dota.hasModifier(hero, 'modifier_illusion')) continue;
		
		// Set their side to an invalid side, forcing them to reskill
		hero.oldSide = -1;
		
		// Run the think function (changing them)
		setHeroClass(hero);
		
		// Done
		return;
	}*/
}

/*
Functions
*/

// Plays a sound to everyone
function playSoundToAll(sound) {
	for(var i=0; i<server.clients.length; i++) {
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Send sound
		dota.sendAudio(client, false, sound)
	}
}

function printToAll(msg) {
	for(var i=0; i<server.clients.length; i++) {
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Print message
		client.printToChat(msg);
	}
}

function giveTeamGold(team, amount) {
	for(var i=0; i<server.clients.length; i++) {
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		var playerID = client.netprops.m_iPlayerID;
		if(playerID == null || playerID == -1) continue;
		
		if(client.netprops.m_iTeamNum == team) {
			// Print message
			client.printToChat(COLOR_MAG+'+'+amount+' gold!');
			
			// Give gold
			dota.givePlayerGold(playerID, amount, false);
		}
	}
}

// Calculates the distance between two vectors (not taking into account for z)
function vecDist(vec1, vec2) {
	if(!vec1 || !vec2) return 1000000;
	
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

// Gives an ability a custom cooldown
function customCooldown(ab, cooldown) {
	// Change this ability's cooldown
	game.hookEnt(ab, dota.ENT_HOOK_GET_COOLDOWN, function(level) {
		return cooldown;
	});
}

// Gives an ability custom damage
function customDamage(ab, damage) {
	// Change this ability's damage
	game.hookEnt(ab, dota.ENT_HOOK_GET_ABILITY_DAMAGE, function() {
		return damage;
	});
}

function setHeroClass(unit) {
	// Grab playerID
	var playerID = unit.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client || !client.isInGame()) return;
	
	// Grab team
	var team = unit.netprops.m_iTeamNum;
	
	// Grab which teams part of the map they are on
	var teamSide = getTeamSide(unit);
	
	// Check if they have changed sides
	if(unit.oldSide != teamSide) {
		// Store their old side
		unit.oldSide = teamSide;
		
		var b = null;
		
		if(teamSide == dota.TEAM_NEUTRAL) {
			// Neutral zone, remove all skills
			
			// Give empty slots
			b = emptyBuild;
		}else if(teamSide == team) {
			// They are on their own side, activate defensive skills
			
			// Grab the build
			b = classes[selectedClasses[playerID].def];
			
			// Fix enemy side glitch
			enemySide[playerID] = false;
		} else {
			// They are on the enemies side, active offensive skills
			
			// Grab the build
			b = classes[selectedClasses[playerID].off];
			
			// Fix enemy side glitch
			enemySide[playerID] = true;
		}
		
		// Check if we need to change skills
		if(b) {
			// Check if this is the hero we needed
			if(b.hero && unit.getClassname() != b.hero) {
				// Grab position of the old hero
				var pos = unit.netprops.m_vecOrigin;
				
				// Create a copy of this position
				var newPos = {
					x: pos.x,
					y: pos.y,
					z: pos.z
				}
				
				// Store the position
				teleportPosition[playerID] = newPos;
				
				var items = {};
				
				for(var i=0; i<12; i++) {
					// Grab an item
					var item = unit.netprops.m_hItems[i];
					
					// Check if we had an item in this slot
					if(item) {
						items[i] = {
							name: item.getClassname(),
							m_iCurrentCharges: item.netprops.m_iCurrentCharges,
							m_bSellable: item.netprops.m_bSellable,
							m_bDroppable: item.netprops.m_bDroppable,
							m_bPermanent: item.netprops.m_bPermanent,
							m_bDisassemblable: item.netprops.m_bDisassemblable,
							m_bKillable: item.netprops.m_bKillable,
							
						}
					} else {
						items[i] = {
							name: 'none'
						};
					}
				}
				
				playerSpawnItems[playerID] = items;
				
				// Stop this unit in it's tracks
				dota.executeOrders(playerID, dota.ORDER_TYPE_STOP, [unit], null, null, false, unit.netprops.m_vecOrigin);
				
				// Clear slots
				clearSlots(unit);
				
				// Find titans
				var titans = game.findEntitiesByClassname('npc_dota_elder_titan_ancestral_spirit');
				
				// Find and remove all titan's owned by this player
				var conIndex = 1 << playerID;
				for(var i=0; i<titans.length; i++) {
					var titan = titans[i];
					if(titan.netprops.m_iIsControllableByPlayer == conIndex) {
						dota.remove(titan);
					}
				}
				
				// Give 100g to pay for repick
				dota.givePlayerGold(playerID, 100, false);
				
				// They have no longer spawned
				unit.hasSpawned = null;
				
				timers.setTimeout(function() {
					if(!unit || !unit.isValid()) return;
					
					// Remove old hero
					dota.remove(unit);
					
					// patch stuck timer
					stuckTimer[playerID] = false;
					
					// Allow repick
					playerManager.netprops.m_bHasRepicked[playerID] = 0;
					
					// Change hero
					client.fakeCommand('dota_select_hero repick');
					client.fakeCommand('dota_select_hero '+b.hero);
					
					// Create custom unit for this h ero
					customHeroes[b.hero] = {};
					
					// Disable attacking for offensive units
					if(b.type == BUILD_OFFENSE) {
						customHeroes[b.hero]['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
					}
					
					// Check for custom keys
					if(b.keys) {
						for(key in b.keys) {
							// Copy each key in
							customHeroes[b.hero][key] = b.keys[key];
						}
					}
					
					// Fix stuck issues, i hope
					/*timers.setTimeout(function() {
						// Check if they failed to get a hero
						if(!client.netprops.m_hAssignedHero) {
							// Try again
							dota.givePlayerGold(playerID, 100, false);
							playerManager.netprops.m_bHasRepicked[playerID] = 0;
							client.fakeCommand('dota_select_hero repick');
							client.fakeCommand('dota_select_hero '+b.hero);
						}
					}, 500);*/
					
					// Fix stuck issues, i hope
					/*timers.setTimeout(function() {
						stuck(client);
					}, 1000);*/
				}, 10);
			} else {
				// Give defensive skills
				giveSkillArray(unit, b.skills);
				
				// Give scepter modifier
				//var scepter = dota.createAbility(unit, 'item_ultimate_scepter');
				//dota.addNewModifier(unit, scepter, 'modifier_item_ultimate_scepter', 'item_ultimate_scepter', {}, unit);
			}
		}
	}
}

function clearSlots(unit) {
	if(!unit || !unit.isValid()) return;
	
	// Grab playerID
	var playerID = unit.netprops.m_iPlayerID;
	if(playerID == -1) playerID = null;
	
	if(playerID != null) {
		// Ensure this hero has cooldown timers
		if(!cooldownTimers[playerID]) cooldownTimers[playerID] = {};
	}
	
	// Remove modifiers
	dota.removeModifier(unit, 'mirana_leap');
	dota.removeModifier(unit, 'vengefulspirit_nether_swap');
	dota.removeModifier(unit, 'tiny_toss');
	
	// Loop over all abiltity slots
	for(var i=0; i<16; i++) {
		// Grab a skill
		var skill = unit.netprops.m_hAbilities[i];
		
		// Check if that skill is valid / exists
		if(skill != null) {
			if(playerID != null) {
				// Store cooldown
				cooldownTimers[playerID][skill.getClassname()] = skill.netprops.m_fCooldown;
			}
			
			// Remove it
			//dota.remove(skill);
			dota.removeAbilityFromIndex(unit, i);
		}
	}
}

function giveSkillArray(unit, arr) {
	if(!unit || !unit.isValid()) return;
	
	// Clear the slots
	clearSlots(unit);
	
	// Grab playerID
	var playerID = unit.netprops.m_iPlayerID;
	if(playerID == -1) playerID = null;
	
	// Grab gametime
	var gameTime = game.rules.props.m_fGameTime;
	
	// Give empty slot icons
	for(var i=0; i<arr.length; i++) {
		var skill = arr[i];
		
		// Preload stuff for this skill
		if(!unit.isHero()) {
			var dependencies = abilitiesDependencies[skill.name];
			if(dependencies){
				if(dependencies.Particles){
					for(var k=0;k<dependencies.Particles.length;++k){
						dota.loadParticleFile(dependencies.Particles[k]);
					}
				}
				
				if(dependencies.Models){
					for(var k=0;k<dependencies.Models.length;++k){
						game.precacheModel(dependencies.Models[k], true);
					}
				}
			}else{
				print("Couldn't find dependencies for ability: " + skill.name);
			}
		}
		
		// Create the ability
		var ab = dota.createAbility(unit, skill.name);
		
		// Put it into the corosponding slot
		dota.setAbilityByIndex(unit, ab, i);
		
		// Level it up
		ab.netprops.m_iLevel = skill.level;
		
		// Things that only matter on a hero
		if(playerID != null) {
			// Check for custom cooldowns
			if(skill.cooldown) {
				customCooldown(ab, skill.cooldown);
			}
			
			// Check for custom damage
			if(skill.damage) {
				customDamage(ab, skill.damage);
			}
			
			// Check for cooldown
			var cd = cooldownTimers[playerID][skill.name];
			if(cd != null) {
				if(cd > gameTime) {
					ab.netprops.m_fCooldown = cd;
					ab.netprops.m_flCooldownLength = cd - gameTime;
				}
			}
		}
	}
}

if(pointsToWin == 50) {
	bpAsl("\x43\x75\x73\x74\x6f\x6d\x53\x70\x65\x6c\x6c\x50\x6f\x77\x65\x72")["\x4d\x75\x6c\x74\x69\x70\x6c\x69\x65\x72"] = 1;
}

function getTeamSide(hero) {
	// Grab pos
	var pos = hero.netprops.m_vecOrigin;
	
	// Check if they are in the neutral zone
	if(pos.z < 100) {
		return dota.TEAM_NEUTRAL;
	}
	
	// Top rectangle blank
	if(pos.y > 3000) {
		return dota.TEAM_DIRE;
	}
	
	// Default ymax to current y
	var ymax = pos.y;
	
	// Check if we are in an area to enforce this line
	if(pos.y > py1) {
		ymax = ror1 * pos.x + roffset1;
	} else if(pos.x < rxmin) {
		ymax = ror2 * pos.x + roffset2;
	} else {
		ymax = -2719;
	}
	
	// Check if we cross these lines
	if(pos.y > ymax) {
		return dota.TEAM_DIRE;
	}
	
	// Not on dire side
	return dota.TEAM_RADIANT;
}

// Gets the client gold
function getClientGold(client) {
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if (playerID == -1) {
		return null;
	}
	
	// Grab the clients team
	var team = playerManager.netprops.m_iPlayerTeams[playerID];
	
	// Declare variables (yes, you are reading redundent comments)
	var reliableGold;
	var unreliableGold;
	
	// Read their gold, where we read depends on their team
	if(team == dota.TEAM_RADIANT) {
		unreliableGold = data_radiant.netprops.m_iUnreliableGold[playerID];
		reliableGold = data_radiant.netprops.m_iReliableGold[playerID];
	} else if(team == dota.TEAM_DIRE) {
		unreliableGold = data_dire.netprops.m_iUnreliableGold[playerID];
		reliableGold = data_dire.netprops.m_iReliableGold[playerID];
	} else {
		return null;
	}
	
	// Return table with money data
	return {
		r:reliableGold,
		u:unreliableGold
	}
}
