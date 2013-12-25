// 'Global' vars
var customCreep = false;
var customSheep = false;
var customEvilSheep = false;
var customPowerup = 0;

var playerManager;

var winNumber = 30;

// Contains all the sheep
var evilSheepList = new Array();

// 'Constant' vars
var FOLLOW_DISTANCE = 100
var CREEP_THINK_DELAY = 0.3;
var HERO_THINK_DELAY = 0.1;

// How fast heroes move
var hero_move_speed = '350';

// Sounds
var SOUND_EAT_SHEEP = 'ui/coins.wav';
var SOUND_EAT_POWERUP = 'ui/item_drop_gem_world.wav';

// Models
var SHEEP_MODEL = 'models/props_gameplay/donkey.mdl';
var EVIL_SHEEP_MODEL = 'models/courier/baby_rosh/babyroshan.mdl';

// Map bounds
var MAP_RIGHT = 7450;
var MAP_LEFT = -7300;
var MAP_TOP = -7000;
var MAP_BOTTOM = 6800;

// Radius around the edge where sheep cant spawn
MAP_PADDING = 2500;

// Number of sheep to start with
var STARTING_SHEEP = 100;
var STARTING_EVIL_SHEEP = 10;
var STARTING_POWERUPS = 3;

var cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning");

// Grab libraries
var timers = require('timers');

// Hook functions
game.hook('OnMapStart', onMapStart);
game.hook('OnGameFrame', onGameFrame);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hook("Dota_OnUnitParsed", onUnitParsed);
game.hook('Dota_OnUnitThink', onUnitThink);
game.hook("Dota_OnBuyItem", onBuyItem);

/*
Hook functions
*/

function onMapStart() {
	// Precache particles needed for this gamemode
	dota.loadParticleFile('particles/units/heroes/hero_nyx_assassin.pcf');
	
	// Preload models
	game.precacheModel(SHEEP_MODEL);
	game.precacheModel(EVIL_SHEEP_MODEL);
	game.precacheModel('models/heroes/nerubian_assassin/nerubian_assassin.mdl');
	
	// Cleanup buildings
	removeAllSort('npc_dota_tower');
	removeAllSort('npc_dota_building');
	removeAllSort('npc_dota_barracks');
	removeAllSort('npc_dota_roshan_spawner');
	removeAllSort('npc_dota_roshan');
	
	// Spawn starting sheep
	for(var i=0; i<STARTING_SHEEP; i++) {
		spawnSheep();
	}
	
	// Spawn starting evil sheep
	for(var i=0; i<STARTING_EVIL_SHEEP; i++) {
		spawnEvilSheep();
	}
	
	for(var i=0; i<STARTING_POWERUPS; i++) {
		spawnPowerup();
	}
	
	// Grab the player manager
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	
	if(playerManager == null) {
		server.print('\n\nFAILED TO FIND RESOURCE HANDLE\n\n');
	}
}

function onGameFrame(){
	// No creeps
	cvCreepsNoSpawning.setInt(1);
}

function onHeroSpawn(hero) {
	// Cleanup any worms they have
	cleanupWorms(hero);
	
	// Make the hero think
	hero.nextWormThink = 0;
	
	// Remove skills
	for(var i=0;i<16;i++) {
		var ab = hero.netprops.m_hAbilities[i];
		
		if(ab != null) {
			dota.remove(ab);
			hero.netprops.m_hAbilities[i] = null;
		}
	}
	
	// Give speed skill
	var speed = dota.createAbility(hero, 'courier_burst');
	speed.netprops.m_iLevel = 1;
	dota.setAbilityByIndex(hero, speed, 0);
	
	// Give force staff
	if(!hero.forceStaff) {
		// Stop them from getting it again
		hero.forceStaff = true;
		
		// Give item
		dota.giveItemToHero('item_force_staff', hero);
	}
	
	// Remove skill points
	hero.netprops.m_iAbilityPoints = 0;
	
	// Teleport on a random spawn on the next frame
	timers.setTimeout(function() {
		hero.teleport(getRandomSpawn());
	}, 1);
	
	// Print help
	if(!hero.seenHelp) {
		// Grab client
		var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
		if(!client || !client.isInGame()) return;
		
		// Tell them how to play
		client.printToChat('Collect donkies to grow in size.');
		client.printToChat('First hero to collect '+winNumber+' donkies wins!');
		client.printToChat('Collect runes for various powerups.');
		client.printToChat('Leaving the screen kills you.');
		client.printToChat('Spiked stuff kills you!');
		client.printToChat('Press R for speed boost.');
		
		// Store that they've seen this
		hero.seenHelp = true;
	}
}

function onUnitParsed(unit, keyvalues){
	if(unit.isHero()) {
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_FLY';
		keyvalues['MovementSpeed'] = hero_move_speed;
		keyvalues['MovementTurnRate'] = '0.5';
		
		// Disable attacking
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
	}
	
	// Make a worm
	if(customCreep) {
		// Model
		keyvalues['model'] = 'models/heroes/nerubian_assassin/nerubian_assassin.mdl';
		
		// Disable attacking
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
		
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_FLY';
		keyvalues['MovementSpeed'] = '1000';
		keyvalues['MovementTurnRate'] = '0.5';
	}
	
	// Make a sheep
	if(customSheep) {
		// Model
		keyvalues['model'] = SHEEP_MODEL;
		
		// Disable attacking
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
		
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_FLY';
		keyvalues['MovementSpeed'] = '150';
		keyvalues['MovementTurnRate'] = '0.5';
	}
	
	// Make an evil sheep
	if(customEvilSheep) {
		// Model
		keyvalues['model'] = EVIL_SHEEP_MODEL;
		
		// Disable attacking
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
		
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_FLY';
		keyvalues['MovementSpeed'] = '150';
		keyvalues['MovementTurnRate'] = '0.5';
	}
	
	// Make a powerup
	if(customPowerup) {
		// Model
		if(customPowerup == 1) {
			keyvalues['model'] = 'models/props_gameplay/rune_haste01.mdl';
		} else if(customPowerup == 2) {
			keyvalues['model'] = 'models/props_gameplay/rune_doubledamage01.mdl';
		}
		
		// Disable attacking
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_NO_ATTACK';
		
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_FLY';
		keyvalues['MovementSpeed'] = '150';
		keyvalues['MovementTurnRate'] = '0.5';
	}
}

function onUnitThink(unit) {
	if(unit.isHero()) {
		// Check if it's time for our next think
		var gameTime = game.rules.props.m_fgameTime;
		if(gameTime < unit.nextWormThink) return;
		
		// Add a delay to our next think
		unit.nextWormThink = gameTime + HERO_THINK_DELAY;
		
		// Grab hero's position
		var pos = unit.netprops.m_vecOrigin;
		
		// Grab the client's hero rotation
		var heroAng = unit.netprops.m_angRotation;
		var ang = toRadians(heroAng.y);
		
		// Find position behind us
		var x = Math.round(pos.x + 100*Math.cos(ang));
		var y = Math.round(pos.y + 100*Math.sin(ang));
		var z = pos.z;
		
		// March towards our pos
		dota.executeOrders(unit.netprops.m_iPlayerID, dota.ORDER_TYPE_MOVE_TO_LOCATION, [unit], null, null, false, {
			x: x,
			y: y,
			z: z
		});
		
		// Check map bounds
		if(	pos.x > MAP_RIGHT ||
			pos.x < MAP_LEFT ||
			pos.y > MAP_BOTTOM ||
			pos.y < MAP_TOP) {
				// KILL IT
				killHero(unit);
		}
	} else if(unit.isWormCreep) {
		// Check if it's time for our next think
		var gameTime = game.rules.props.m_fgameTime;
		if(gameTime < unit.nextWormThink) return;
		
		// Add a delay to our next think
		unit.nextWormThink = gameTime + CREEP_THINK_DELAY;
		
		// Find and kill a hero if they come too close
		killHero(findClosetHero(unit, 100));
		
		// Grab my pos
		var pos = unit.netprops.m_vecOrigin;
		
		// Kill any sheep that walk into us
		for(var i=0; i<evilSheepList.length;i++) {
			var sheep = evilSheepList[i];
			if(!sheep.isSheep) continue;
			
			// Grab distance to this sheep
			var dist = vecDist(pos, sheep.netprops.m_vecOrigin);
			
			if(dist < 100) {
				// This unit is no longer a sheep
				sheep.isSheep = null;
				unit.isEvil = null;
				
				// Kill the sheep
				killUnit(sheep);
				
				if(unit.isEvil) {
					// Create an evil sheep to replace this one
					spawnEvilSheep();
				} else {
					// Create a sheep to replace this one
					spawnSheep();
				}
			}
		}
	} else if(unit.isSheep) {
		// Check if it's time for our next think
		var gameTime = game.rules.props.m_fgameTime;
		if(gameTime < unit.nextWormThink) return;
		
		// Add a delay to our next think
		unit.nextWormThink = gameTime + CREEP_THINK_DELAY;
		
		// Find a close hero
		var hero = findClosetHero(unit, 1000);
		
		// Walk away from the hero if we found one
		if(hero) {
			// Grab hero's position
			var pos = hero.netprops.m_vecOrigin;
			var mypos = unit.netprops.m_vecOrigin;
			
			// Workout the angle between the sheep and the player
			var ang;
			
			if(unit.isEvil) {
				// Chase
				ang = Math.atan2(pos.y-mypos.y, pos.x-mypos.x);
			} else {
				// Flee
				ang = Math.atan2(mypos.y-pos.y, mypos.x-pos.x);
			}
			
			// Find position behind us
			var x = Math.round(mypos.x + 250*Math.cos(ang));
			var y = Math.round(mypos.y + 250*Math.sin(ang));
			var z = mypos.z;
			
			// Walk away from it
			dota.executeOrders(23, dota.ORDER_TYPE_MOVE_TO_LOCATION, [unit], null, null, false, {
				x: x,
				y: y,
				z: z
			});
			
			// Check map bounds
			if(	mypos.x > MAP_RIGHT-MAP_PADDING ||
				mypos.x < MAP_LEFT+MAP_PADDING ||
				mypos.y > MAP_BOTTOM-MAP_PADDING ||
				mypos.y < MAP_TOP+MAP_PADDING) {
					// KILL IT
					killUnit(unit);
					
					// This unit is no longer a sheep
					unit.isSheep = null;
					unit.isEvil = null;
					
					if(unit.isEvil) {
						// Create an evil sheep to replace this one
						spawnEvilSheep();
					} else {
						// Create a sheep to replace this one
						spawnSheep();
					}
			}
			
			// Find a close hero
			hero = findClosetHero(unit, 100);
			
			// Check if we found one
			if(hero) {
				if(unit.isEvil) {
					if(!hero.isBadass) {
						// Kill the player
						killHero(hero);
					} else {
						// Die :(
					
						// This unit is no longer a sheep
						unit.isSheep = null;
						unit.isEvil = null;
						
						// Add a worms to this hero
						for(var i=0;i<5;i++) {
							addWorm(hero);
						}
						
						// Kill this sheep
						killUnit(unit);
						
						// Creep a new sheep to replace this one
						spawnEvilSheep();
						
						// Find client
						var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
						if(!client || !client.isInGame()) return;
						
						// Play sound
						dota.sendAudio(client, false, SOUND_EAT_SHEEP);
						
						// Tell them they got 5 worms
						client.printToChat('You gained 5 worms!');
					}
				} else {
					// Die :(
					
					// This unit is no longer a sheep
					unit.isSheep = null;
					
					// Add a worm to this hero
					addWorm(hero);
					
					// Kill this sheep
					killUnit(unit);
					
					// Creep a new sheep to replace this one
					spawnSheep();
					
					// Find client
					var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
					if(!client || !client.isInGame()) return;
					
					// Play sound
					dota.sendAudio(client, false, SOUND_EAT_SHEEP);
				}
			}
		}
	} else if(unit.isPowerup) {
		var hero = findClosetHero(unit, 100);
		
		if(hero) {
			// Find client
			var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
			if(!client || !client.isInGame()) return;
			
			// Play sound
			dota.sendAudio(client, false, SOUND_EAT_POWERUP);
			
			if(unit.isPowerup == 1) {
				// Check if they already have the haste ability
				if(!hero.hastePowerup) {
					hero.hastePowerup = dota.createAbility(hero, 'dark_seer_surge');
					hero.hastePowerup.netprops.m_iLevel = 4;
				}
				
				// Apply modifier
				dota.addNewModifier(hero, hero.hastePowerup, 'modifier_dark_seer_surge', "dark_seer_surge", {duration:15});
			} else if(unit.isPowerup == 2) {
				// Check if they already have the haste ability
				if(!hero.damagePowerup) {
					hero.damagePowerup = dota.createAbility(hero, 'nyx_assassin_spiked_carapace');
					hero.damagePowerup.netprops.m_iLevel = 4;
				}
				
				// Make this hero badass
				if(!hero.isBadass) {
					hero.isBadass = 1;
				} else {
					hero.isBadass += 1;
				}
				
				// Apply modifier
				dota.addNewModifier(hero, hero.damagePowerup, 'modifier_nyx_assassin_spiked_carapace', "nyx_assassin_spiked_carapace", {duration:15});
				
				// Tell client
				client.printToChat('You can eat the little spiked roshans for the next 15 seconds.');
				
				// Used incase they pickup another rune
				var thisTimer = hero.isBadass;
				
				// Add timer to remove badassness
				timers.setTimeout(function() {
					// Check if they havent picked up another
					if(hero.isBadass == thisTimer) {
						// Turn it off
						hero.isBadass = 0;
					}
				}, 15000);
			}
			
			// This unit is no longer a powerup
			unit.isPowerup = null;
			
			// Remove myself
			killUnit(unit);
			dota.remove(unit);
			
			// Spawn a new one
			spawnPowerup();
		}
	}
}

// Disable buying
function onBuyItem(ent, item, playerID, unknown) {
	return false;
}

/*
Functions
*/

function spawnPowerup() {
	// We are making a custom sheep
	customPowerup = randomFromInterval(1, 2);
	
	// Spawn a powerup
	var powerup = dota.createUnit('npc_dota_creep', randomFromInterval(dota.TEAM_RADIANT, dota.TEAM_DIRE));
	
	// Make sure the game knowns it a powerup
	powerup.isPowerup = customPowerup;
	
	// Make it controllable by 23
	powerup.netprops.m_iIsControllableByPlayer = 1 << 23;
	
	// We are no longer making a powerup
	customPowerup = 0;
	
	// Find a random home for this sheep
	powerup.teleport(getRandomSpawn());
}

function spawnSheep() {
	// We are making a custom sheep
	customSheep = true;
	
	// Spawn a sheep
	var sheep = dota.createUnit('npc_dota_creep', randomFromInterval(dota.TEAM_RADIANT, dota.TEAM_DIRE));
	
	// Make sure the game knowns it a sheep
	sheep.isSheep = true;
	
	// Make it controllable by 23
	sheep.netprops.m_iIsControllableByPlayer = 1 << 23;
	
	// We are no longer making a sheep
	customSheep = false;
	
	// Find a random home for this sheep
	sheep.teleport(getRandomSpawn());
}

function spawnEvilSheep() {
	// We are making a custom sheep
	customEvilSheep = true;
	
	// Spawn a sheep
	var sheep = dota.createUnit('npc_dota_creep', randomFromInterval(dota.TEAM_RADIANT, dota.TEAM_DIRE));
	
	// Make sure the game knowns it a sheep
	sheep.isSheep = true;
	
	// Make is evil
	sheep.isEvil = true;
	
	// Make it controllable by 23
	sheep.netprops.m_iIsControllableByPlayer = 1 << 23;
	
	// We are no longer making a sheep
	customEvilSheep = false;
	
	// Find a random home for this sheep
	sheep.teleport(getRandomSpawn());
	
	// Add to our evil sheep list
	evilSheepList.push(sheep);
	
	// Give spike effect
	sheep.spikes = dota.createAbility(sheep, 'nyx_assassin_spiked_carapace');
	dota.addNewModifier(sheep, sheep.spikes , 'modifier_nyx_assassin_spiked_carapace', "nyx_assassin_spiked_carapace", {duration:36000});
}

// Finds a random place to spawn
function getRandomSpawn() {
	return {
		x: randomFromInterval(MAP_LEFT+MAP_PADDING, MAP_RIGHT-MAP_PADDING),
		y: randomFromInterval(MAP_TOP+MAP_PADDING, MAP_BOTTOM-MAP_PADDING),
		z: 256
	}
}

function addWorm(hero) {
	if(!hero) return;
	
	// What we should be following
	var toFollow = hero.endOfChain;
	
	// Grab hero's position
	var pos = toFollow.netprops.m_vecOrigin;
	
	// Grab the client's hero rotation
	var heroAng = toFollow.netprops.m_angRotation;
	var ang = toRadians(heroAng.y);
	var angBack = ang + Math.PI;
	
	// Find position behind us
	var x = Math.round(pos.x + FOLLOW_DISTANCE*Math.cos(angBack));
	var y = Math.round(pos.y + FOLLOW_DISTANCE*Math.sin(angBack));
	var z = pos.z;
	
	// Start making our custom creep
	customCreep = true;
	
	// Spawn creep
	var creep = dota.createUnit('npc_dota_creep', hero.netprops.m_iTeamNum);
	
	// Make it controllable by 23
	creep.netprops.m_iIsControllableByPlayer = 1 << 23;
	
	// Teleport them behind you
	creep.teleport(x, y, z);
	
	// Rotate them to follow you
	creep.setRotation(heroAng);
	
	// Make it follow the on the next frame
	timers.setTimeout(function() {
		dota.executeOrders(23, dota.ORDER_TYPE_MOVE_TO_UNIT, [creep], toFollow, null, false, toFollow.netprops.m_vecOrigin);
	}, 100);
	
	// Update the end of the chain to this creep
	hero.endOfChain = creep;
	
	// Store that this unit is a worm
	creep.isWormCreep = true;
	
	// Give spike effect
	creep.spikes = dota.createAbility(creep, 'nyx_assassin_spiked_carapace');
	dota.addNewModifier(creep, creep.spikes , 'modifier_nyx_assassin_spiked_carapace', "nyx_assassin_spiked_carapace", {duration:36000});
	
	// Make this creep think
	creep.nextWormThink = 0;
	
	// Stop making a custom creep
	customCreep = false;
	
	// Store this worm
	hero.wormArray.push(creep);
	
	// Add worms
	hero.totalWorms += 1;
	
	// Grab client
	var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
	if(!client || !client.isInGame()) return;
	
	// Tell the client how many they got
	client.printToChat('You have '+hero.totalWorms+'/'+winNumber+'.');
	
	// Check win condition
	if(hero.totalWorms >= winNumber) {
		
		// Print victory
		printToAll(client.getName()+' has won!');
		
		// End game
		dota.forceWin(dota.TEAM_RADIANT);
	}
}

function printToAll(str) {
	// Validate input
	if(!str) return;
	
	// cucle all clients
	for(var i=0;i<server.clients.length;i++) {
		// Grab, validate client
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Print the message
		client.printToChat(str);
	}
}

function cleanupWorms(hero) {
	if(hero.wormArray) {
		for(var i=0;i<hero.wormArray.length;i++) {
			var worm = hero.wormArray[i];
			
			// Make sure it is a worm
			if(worm.isWormCreep) {
				// It is no longer a worm creep
				worm.isWormCreep = false;
				
				// Kill the worm
				killUnit(worm);
			}
		}
	}
	
	// Create a new array to store our worms into
	hero.wormArray = new Array();
	
	// Make itself the end of the chain
	hero.endOfChain = hero;
	
	// Total worms = 0
	hero.totalWorms = 0;
}

function findClosetHero(unit, range) {
	// Check if it's time for our next think
	var gameTime = game.rules.props.m_fgameTime;
	if(gameTime < unit.nextWormThink) return;
	
	// Add a delay to our next think
	unit.nextWormThink = gameTime + CREEP_THINK_DELAY;
	
	// Grab my position
	var pos = unit.netprops.m_vecOrigin;
	
	// No found hero to start
	var foundHero = null;
	var foundDist = range
	
	for(var i=0;i<dota.MAX_PLAYERS;i++) {
		// Find this client
		var client = dota.findClientByPlayerID(i);
		if(!client || !client.isInGame()) continue;
		
		// Find this client's heroes
		var heroes = client.getHeroes();
		for(var hh in heroes) {
			// Grab a hero
			var hero = heroes[hh];
			
			// Validate hero, make sure it is alive!
			if(!hero || hero.netprops.m_lifeState != 0) continue;
			
			// Grab distance to this hero
			var dist = vecDist(pos, hero.netprops.m_vecOrigin);
			
			// Check if this hero is too close
			if(dist < foundDist) {
				// Store hero
				foundHero = hero;
				
				// Update min range
				foundDist = dist;
			}
		}
	}
	
	// Return what ever was found
	return foundHero;
}

function removeAllSort(sort) {
	// Find all ents of type sort
	var found = game.findEntitiesByClassname(sort);
	
	// Cycle them all
	for(var i=0;i<found.length;i++) {
		// Remove it
		dota.remove(found[i]);
	}
}

function killUnit(unit) {
	if(!unit) return;
	
	// Check if it's in our evilSheepList, remove
	var index = evilSheepList.indexOf(unit);
	if(index != -1) evilSheepList.splice(index, 1);
	
	// Kill the unit
	dota.applyDamage(unit, unit, unit, 999999, dota.DAMAGE_TYPE_PURE);
}

function killHero(hero) {
	if(!hero) return;
	
	// Kill his worms
	cleanupWorms(hero);
	
	// Kill the hero
	killUnit(hero);
}

// Convert degrees to radians
function toRadians (angle) {
	return angle * (Math.PI / 180);
}

// Calculates the distance between two vectors (not taking into account for z)
function vecDist(vec1, vec2) {
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

function randomFromInterval(from,to) {
	// Make sure from < to
	if(to < from) {
		var t = to;
		to = from;
		from = t;
	}
	
	// Pick a number in this range
    return Math.floor(Math.random()*(to-from+1)+from);
}
