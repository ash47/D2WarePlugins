// Unique ID of plugin on d2ware
var pluginID = 'FastRespawn';

// List of game breaking skills
var gameBreakingSkills = [
	'zuus_thundergods_wrath',
	'skeleton_king_reincarnation',
	'silencer_global_silence',
	'chen_hand_of_god',
	'omniknight_guardian_angel',
	'abaddon_borrowed_time'
]

// Libraries
var timers = require('timers');

// To look at gold etc
var playerManager = null;
var data_dire = null;
var data_radiant = null;

// Load KVs
var abs = keyvalue.parseKVFile('npc_abilities.kv').DOTAAbilities;

// Respawn Vars
var respawnModifier = 1;
var respawnTime = 0;

// Spell cooldown vars
var cooldownModifier = 1;
var cooldownTime = 0;
var doHookCooldowns = 0;

// Manacost stuff
var doHookManaCost = 0;
var manacostModifier = 1;

// Damage stuff
var doHookDamage = 0;
var damageModifier = 1;

// Gold modifier stuff
var goldModifier = 1;

// Bounty Stuff
var goldBountyModifier = 1;
var xpBountyModifier = 1;

// Free courier
var freeCourier = false;
var flyingCourier = false;

// Should we ignore cooldowns that break the game?
var ignoreGameBreakingCooldowns = true;

// The min level a player can be
var minSpawnLevel = 1;

// How many levels to increase spell values by
var spellLevelIncrease = 0;

// How should we change stats?
var baseStatMultiplier = 1;

// How much faster should they move?
var speedModifier = 1;

// Building / creep scalers
var buildingScaler = 1;
var creepScaler = 1;

// The level cap
var levelcap = 25;

// How long for creep camps to spawn
var creepCampTime = 60;
var CVNeutralCampTimer = console.findConVar("dota_neutral_spawn_interval");

plugin.get('LobbyManager', function(obj){
	// Grab options
	var options = obj.getOptionsForPlugin(pluginID);
	if(!options) return;
	
	// Grab Respawn Multiplier
	switch(options['Respawn Multiplier']) {
		case '2X Faster Respawn':
			respawnModifier = 2;
			respawnTime = 0;
		break;
		
		case '3X Faster Respawn':
			respawnModifier = 3;
			respawnTime = 0;
		break;
		
		case '4X Faster Respawn':
			respawnModifier = 4;
			respawnTime = 0;
		break;
		
		case '5X Faster Respawn':
			respawnModifier = 5;
			respawnTime = 0;
		break;
		
		case '10X Faster Respawn':
			respawnModifier = 10;
			respawnTime = 0;
		break;
		
		case '1 second Respawn':
			respawnModifier = 0;
			respawnTime = 1;
		break;
		
		case '3 second Respawn':
			respawnModifier = 0;
			respawnTime = 3;
		break;
		
		case '5 second Respawn':
			respawnModifier = 0;
			respawnTime = 5;
		break;
		
		case '10 second Respawn':
			respawnModifier = 0;
			respawnTime = 10;
		break;
		
		case 'Instant Respawn':
			respawnModifier = 0;
			respawnTime = 0;
		break;
		
		case 'Default Respawn':
			respawnModifier = 1;
			respawnTime = 0;
		break;
	}
	
	// Grab Cooldown Multiplier
	switch(options['Cooldown Multiplier']) {
		case 'Normal Skill Cooldown':
			doHookCooldowns = 0;
		break;
		
		case '2X Faster Skill Cooldown':
			doHookCooldowns = -1;
			cooldownModifier = 2;
			cooldownTime = 0;
		break;
		
		case '3X Faster Skill Cooldown':
			doHookCooldowns = -1;
			cooldownModifier = 3;
			cooldownTime = 0;
		break;
		
		case '4X Faster Skill Cooldown':
			doHookCooldowns = -1;
			cooldownModifier = 4;
			cooldownTime = 0;
		break;
		
		case '5X Faster Skill Cooldown':
			doHookCooldowns = -1;
			cooldownModifier = 5;
			cooldownTime = 0;
		break;
		
		case '10X Faster Skill Cooldown':
			doHookCooldowns = -1;
			cooldownModifier = 10;
			cooldownTime = 0;
		break;
		
		case '2X Slower Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 2;
			cooldownTime = 0;
		break;
		
		case '3X Slower Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 3;
			cooldownTime = 0;
		break;
		
		case '4X Slower Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 4;
			cooldownTime = 0;
		break;
		
		case '5X Slower Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 5;
			cooldownTime = 0;
		break;
		
		case '10X Slower Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 10;
			cooldownTime = 0;
		break;
		
		case '1 second Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 0;
			cooldownTime = 1;
		break;
		
		case '3 second Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 0;
			cooldownTime = 3;
		break;
		
		case '5 second Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 0;
			cooldownTime = 5;
		break;
		
		case '10 second Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 0;
			cooldownTime = 10;
		break;
		
		case 'Instant Skill Cooldown':
			doHookCooldowns = 1;
			cooldownModifier = 0;
			cooldownTime = 0;
		break;
	}
	
	switch(options['Ignore game breaking cooldowns']) {
		case 'Ignore game breaking cooldowns':
			ignoreGameBreakingCooldowns = true;
		break;
		
		case 'Change all cooldowns':
			ignoreGameBreakingCooldowns = false;
		break;
	}
	
	// Grab Manacost Multiplier
	switch(options['Mana Multiplier']) {
		case 'Normal Spell Manacost':
			doHookManaCost = 0;
		break;
		
		case '2X Less Spell Manacost':
			doHookManaCost = -1;
			manacostModifier = 2;
		break;
		
		case '3X Less Spell Manacost':
			doHookManaCost = -1;
			manacostModifier = 3;
		break;
		
		case '4X Less Spell Manacost':
			doHookManaCost = -1;
			manacostModifier = 4;
		break;
		
		case '5X Less Spell Manacost':
			doHookManaCost = -1;
			manacostModifier = 5;
		break;
		
		case '10X Less Spell Manacost':
			doHookManaCost = -1;
			manacostModifier = 10;
		break;
		
		case '2X More Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 2;
		break;
		
		case '3X More Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 3;
		break;
		
		case '4X More Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 4;
		break;
		
		case '5X More Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 5;
		break;
		
		case '10X More Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 10;
		break;
		
		case 'No Spell Manacost':
			doHookManaCost = 1;
			manacostModifier = 0;
		break;
	}
	
	// Grab Spell Value Multiplier
	switch(options['Spell Value Multiplier']) {
		case 'Normal Spell Values':
			spellLevelIncrease = 0;
		break;
		
		case '+1 Level Spell Values':
			spellLevelIncrease = 1;
		break;
		
		case '+2 Levels Spell Values':
			spellLevelIncrease = 2;
		break;
		
		case '+3 Levels Spell Values':
			spellLevelIncrease = 3;
		break;
		
		case '+4 Levels Spell Values':
			spellLevelIncrease = 4;
		break;
		
		case '+5 Levels Spell Values':
			spellLevelIncrease = 5;
		break;
		
		case '+6 Levels Spell Values':
			spellLevelIncrease = 6;
		break;
		
		case '+7 Levels Spell Values':
			spellLevelIncrease = 7;
		break;
		
		case '+8 Levels Spell Values':
			spellLevelIncrease = 8;
		break;
		
		case '+9 Levels Spell Values':
			spellLevelIncrease = 9;
		break;
		
		case '+10 Levels Spell Values':
			spellLevelIncrease = 10;
		break;
	}
	
	// Grab Stat Multiplier
	switch(options['Base Stat Multiplier']) {
		case 'Normal Spell Manacost':
			baseStatMultiplier = 1;
		break;
		
		case '2X More Stats':
			baseStatMultiplier = 2;
		break;
		
		case '3X More Stats':
			baseStatMultiplier = 3;
		break;
		
		case '4X More Stats':
			baseStatMultiplier = 4;
		break;
		
		case '5X More Stats':
			baseStatMultiplier = 5;
		break;
		
		case '10X More Stats':
			baseStatMultiplier = 10;
		break;
	}
	
	// Grab Creeo Spawn Timer Changer
	switch(options['Creep Camp Spawn Time']) {
		case '45 Second Creep Camp Spawn Time':
			creepCampTime = 45;
		break;
		
		case '30 Second Creep Camp Spawn Time':
			creepCampTime = 30;
		break;
		
		case '15 Second Creep Camp Spawn Time':
			creepCampTime = 15;
		break;
		
		case '10 Second Creep Camp Spawn Time':
			creepCampTime = 10;
		break;
		
		case '5 Second Creep Camp Spawn Time':
			creepCampTime = 5;
		break;
		
		case '1 Second Creep Camp Spawn Time':
			creepCampTime = 1;
		break;
		
		case 'Instant Creep Camp Spawn Time':
			creepCampTime = 0;
		break;
		
		default:
			creepCampTime = 60;
		break;
	}
	
	CVNeutralCampTimer.setInt(creepCampTime);
	
	
	// Grab Creep Scaler
	switch(options['Creep Scaler']) {
		case 'Normal Creep Power':
			creepScaler = 1;
		break;
		
		case '2X Creep Power':
			creepScaler = 2;
		break;
		
		case '3X Creep Power':
			creepScaler = 3;
		break;
		
		case '4X Creep Power':
			creepScaler = 4;
		break;
		
		case '5X Creep Power':
			creepScaler = 5;
		break;
		
		case '10X Creep Power':
			creepScaler = 10;
		break;
		
		case '15X Creep Power':
			creepScaler = 15;
		break;
		
		case '25X Creep Power':
			creepScaler = 25;
		break;
	}
	
	// Grab Building Scaler
	switch(options['Building Scaler']) {
		case 'Normal Building Power':
			buildingScaler = 1;
		break;
		
		case '2X Building Power':
			buildingScaler = 2;
		break;
		
		case '3X Building Power':
			buildingScaler = 3;
		break;
		
		case '4X Building Power':
			buildingScaler = 4;
		break;
		
		case '5X Building Power':
			buildingScaler = 5;
		break;
		
		case '10X Building Power':
			buildingScaler = 10;
		break;
		
		case '15X Building Power':
			buildingScaler = 15;
		break;
		
		case '25X Building Power':
			buildingScaler = 25;
		break;
	}
	
	// Grab Damage Multiplier
	switch(options['Damage Multiplier']) {
		case 'Normal Spell Damage':
			doHookDamage = 0;
		break;
		
		case '2X More Spell Damage':
			doHookDamage = 1;
			damageModifier = 2;
		break;
		
		case '3X More Spell Damage':
			doHookDamage = 1;
			damageModifier = 3;
		break;
		
		case '4X More Spell Damage':
			doHookDamage = 1;
			damageModifier = 4;
		break;
		
		case '5X More Spell Damage':
			doHookDamage = 1;
			damageModifier = 5;
		break;
		
		case '10X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 10;
		break;
		
		case '2X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 2;
		break;
		
		case '3X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 3;
		break;
		
		case '4X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 4;
		break;
		
		case '5X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 5;
		break;
		
		case '10X Less Spell Damage':
			doHookDamage = -1;
			damageModifier = 10;
		break;
	}
	
	// Grab Damage Multiplier
	switch(options['Move Speed Multiplier']) {
		case 'Normal Move Speed':
			speedModifier = 1;
		break;
		
		case '2X Faster Move Speed':
			speedModifier = 2;
		break;
		
		case '3X Faster Move Speed':
			speedModifier = 3;
		break;
		
		case '4X Faster Move Speed':
			speedModifier = 4;
		break;
		
		case '5X Faster Move Speed':
			speedModifier = 5;
		break;
		
		case '10X Faster Move Speed':
			speedModifier = 10;
		break;
	}
	
	// Grab Gold Multiplier
	switch(options['Gold Multiplier']) {
		case 'Normal Starting Gold':
			goldModifier = 1;
		break;
		
		case '2X More Starting Gold':
			goldModifier = 2;
		break;
		
		case '3X More Starting Gold':
			goldModifier = 3;
		break;
		
		case '4X More Starting Gold':
			goldModifier = 4;
		break;
		
		case '5X More Starting Gold':
			goldModifier = 5;
		break;
		
		case '10X More Starting Gold':
			goldModifier = 10;
		break;
		
		case '25X More Starting Gold':
			goldModifier = 25;
		break;
		
		case '50X More Starting Gold':
			goldModifier = 50;
		break;
		
		case '100X More Starting Gold':
			goldModifier = 100;
		break;
		
		case 'No Starting Gold':
			goldModifier = 0;
		break;
	}
	
	// Grab Bounty Gold Multiplier
	switch(options['Gold Bounty Multiplier']) {
		case 'Normal Gold Bounty':
			goldBountyModifier = 1;
		break;
		
		case '2X More Gold Bounty':
			goldBountyModifier = 2;
		break;
		
		case '3X More Gold Bounty':
			goldBountyModifier = 3;
		break;
		
		case '4X More Gold Bounty':
			goldBountyModifier = 4;
		break;
		
		case '5X More Gold Bounty':
			goldBountyModifier = 5;
		break;
		
		case '10X More Gold Bounty':
			goldBountyModifier = 10;
		break;
		
		case 'No Gold Bounty':
			goldBountyModifier = 0;
		break;
	}
	
	// Grab Bounty XP Multiplier
	switch(options['XP Bounty Multiplier']) {
		case 'Normal XP Bounty':
			xpBountyModifier = 1;
		break;
		
		case '2X More XP Bounty':
			xpBountyModifier = 2;
		break;
		
		case '3X More XP Bounty':
			xpBountyModifier = 3;
		break;
		
		case '4X More XP Bounty':
			xpBountyModifier = 4;
		break;
		
		case '5X More XP Bounty':
			xpBountyModifier = 5;
		break;
		
		case '10X More XP Bounty':
			xpBountyModifier = 10;
		break;
		
		case 'No XP Bounty':
			xpBountyModifier = 0;
		break;
	}
	
	// Grab Courier option
	switch(options['Starting Courier']) {
		case 'Free Flying Courier':
			freeCourier = true;
			flyingCourier = true;
		break;
		
		case 'Free Waking Courier':
			freeCourier = true;
			flyingCourier = false;
		break;
		
		case 'No Free Courier':
			freeCourier = false;
			flyingCourier = false;
		break;
	}
	
	// Grab Starting level option
	var sl = options['Starting Level'];
	if(sl) {
		// Change the min spawn level
		minSpawnLevel = parseInt(sl.replace('Start at Level ', ''));
		if(minSpawnLevel > 25) minSpawnLevel = 25;
	}
	
	// Grab Courier option
	switch(options['Level Cap']) {
		case 'Level Cap 25':
			levelcap = 25;
		break;
		
		case 'Level Cap 6':
			levelcap = 6;
		break;
		
		case 'Level Cap 11':
			levelcap = 11;
		break;
		
		case 'Level Cap 16':
			levelcap = 16;
		break;
		
		case 'Level Cap 50':
			levelcap = 50;
		break;
		
		case 'Level Cap 75':
			levelcap = 75;
		break;
		
		case 'Level Cap 100':
			levelcap = 100;
		break;
		
		case 'Level Cap 150':
			levelcap = 150;
		break;
		
		case 'Level Cap 250':
			levelcap = 250;
		break;
		
		case 'Level Cap 500':
			levelcap = 500;
		break;
		
		case 'Level Cap 750':
			levelcap = 750;
		break;
		
		case 'Level Cap 1000':
			levelcap = 1000;
		break;
		
		case 'Level Cap 5000':
			levelcap = 5000;
		break;
	}
});

// Stores who has gotten bonus starting gold
var gottenGold = {};

game.hook('OnMapStart', function() {
	// Grab the managers
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	data_dire = game.findEntityByClassname(-1, "dota_data_dire");
	data_radiant = game.findEntityByClassname(-1, "dota_data_radiant");
});

var gottenCouriers = {};

// Fix camp spawn times
game.hook('OnGameFrame',function() {
	CVNeutralCampTimer.setInt(creepCampTime)
});

game.hook("Dota_OnHeroSpawn", function(hero) {
	
	// Level out a hero
	timers.setTimeout(function() {
		if(!hero || !hero.isValid()) return;
		
		// No illusions
		if(dota.hasModifier(hero, 'modifier_illusion')) return;
		
		var totalUps = 0
		
		var curLevel;
		while((curLevel = hero.netprops.m_iCurrentLevel) < minSpawnLevel && totalUps < minSpawnLevel) {
			// Prevent infinite loop
			totalUps++;
			
			// Levelup
			dota.levelUpHero(hero, false);
			
			// Patch XP
			hero.netprops.m_iCurrentXP = dota.getTotalExpRequiredForLevel(minSpawnLevel);
		}
		
		// Increase the heroes speed
		if(speedModifier > 1) {
			dota.attachMasterModifier(hero, {
				getMoveSpeedLimit: function() {
					return 522 * speedModifier;
				},
				getMoveSpeedBonusConstant: function() {
					return 522*(speedModifier-1);
				}
			});
		}
	}, 1);
	
	// Check if players should get a free courier
	if(freeCourier) {
		// We have to wait a moment before giving the courier
		timers.setTimeout(function() {
			// Check if the hero is valid
			if(!hero || !hero.isValid()) return;
			
			// Check if we've already gotten a courier
			if(gottenCouriers[hero.netprops.m_iTeamNum]) return;
			
			// Check if this hero has space
			var hasSpace = false;
			for(var i=0; i<6; i++) {
				if(hero.netprops.m_hItems[i] == null) {
					hasSpace = true;
					break;
				}
			}
			
			// Only a hero with space can do this
			if(!hasSpace) return;
			
			// Spawn a courier
			var item = dota.giveItemToHero('item_courier', hero);
			
			dota.executeOrders(hero.netprops.m_iPlayerID, dota.ORDER_TYPE_CAST_ABILITY_NO_TARGET, [hero], null, item, false, {x:0, y:0, z:0});
			
			// Stop sellage
			item.netprops.m_bSellable = 0;
			
			// Upgrade it
			if(flyingCourier) {
				item = dota.giveItemToHero('item_flying_courier', hero);
				item.netprops.m_bSellable = 0;
			}
			
			// Store that this team now has a courier
			gottenCouriers[hero.netprops.m_iTeamNum] = true;
		}, 1000);
	}
	
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID < 0 || playerID > 9) return;
	
	// Check if this player has already gotten their starting gold
	if(gottenGold[playerID]) return;
	
	// Grab our gold
	var gold = getGold(playerID);
	if(gold == null) return;
	
	// Multiply it
	var newR = gold.r * goldModifier;
	var newU = gold.u * goldModifier;
	
	// Give the difference in current gold
	dota.givePlayerGold(playerID, newR - gold.r, true);
	dota.givePlayerGold(playerID, newU - gold.u, false);
	
	// Store that they've gotten their gold
	gottenGold[playerID] = true;
});

// Gets the client gold
function getGold(playerID) {
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
		r:(0+reliableGold),
		u:(0+unreliableGold)
	}
}

game.hookEvent("entity_hurt", function(event) {
	// Grab the entity that was attacked
	var ent = game.getEntityByIndex(event.getInt('entindex_killed'));
	
	// Grab the ent's HP
	var entHP = ent.netprops.m_iHealth;
	
	// Check if it is a hero
	if(ent.isHero()) {
		// Check if they will die as a result of this
		if(entHP == 0) {
			// Grab playerID
			var playerID = ent.netprops.m_iPlayerID;
			if(playerID == -1) return;
			
			// Grab client
			var client = dota.findClientByPlayerID(playerID);
			if(!client || !client.isInGame()) return;
			
			// Check if this is their main hero
			if(client.netprops.m_hAssignedHero != ent) return;
			
			// Respawn them after 2 seconds
			timers.setTimeout(function() {
				// Grab the current time
				var gameTime = game.rules.props.m_fGameTime;
				
				// Grab heroes
				var heroes = client.getHeroes();
				
				// Cycle all heroes
				for(var hh=0; hh<heroes.length; hh++) {
					// Grab hero
					var hero = heroes[hh];
					if(!hero || !hero.isValid()) continue;
					
					// Grab current respawn time
					var currentRespawn = hero.netprops.m_flRespawnTime - gameTime;
					
					// Check if we have a respawn modifier
					if(respawnModifier) {
						// Change their respawn time based on the modifier
						hero.netprops.m_flRespawnTime = gameTime + currentRespawn / respawnModifier + respawnTime;
					} else {
						// Timed respawn
						hero.netprops.m_flRespawnTime = gameTime + respawnTime;
					}
				}
			}, 1)
		}
	}
});

// Caches which are stored
var hookedCooldowns = {};
var hookedManaCosts = {};
var hookedDamages = {};

function hookCooldown(ent) {
	// Validate ent
	if(!ent || !ent.isValid()) return;
	
	// Grab the name of this ability
	var name = ent.getClassname();
	
	// Check if this one is already hooked
	if(hookedCooldowns[ent.index] == name) {
		return;
	}
	
	// Should we ignore game breaking ults?
	if(ignoreGameBreakingCooldowns) {
		// Check if this is a game breaking skill
		if(gameBreakingSkills.indexOf(name) != -1) return;
	}
	
	// Make sure we have info on this skill
	var info = abs[name];
	if(!info || !info.AbilityCooldown) return;
	
	// Grab the cooldowns
	var cooldowns = info.AbilityCooldown.split(" ");
	
	// Hook the cooldown
	game.hookEnt(ent, dota.ENT_HOOK_GET_COOLDOWN, function(ab) {
		// Grab the level of the ability
		var level = ab.netprops.m_iLevel;
		
		// No idea what to do
		if(level <= 0) return;
		
		// Lower the level, to work with JS indexes starting at 0
		level -= 1;
		
		// Check if a cooldown exists for this level
		if(level >= cooldowns.length) {
			level = cooldowns.length - 1;
		}
		
		// Grab the current cooldown value
		var cd = parseFloat(cooldowns[level]);
		
		// Return the modified cooldown value
		if(cooldownModifier <= 0) {
			return cooldownTime;
		} else {
			if(doHookCooldowns > 0) {
				return cd*cooldownModifier + cooldownTime;
			} else {
				return cd/cooldownModifier + cooldownTime;
			}
		}
	});
	
	// Store that this ent has been hooked
	hookedCooldowns[ent.index] = name;
}

function hookManaCost(ent) {
	// Validate ent
	if(!ent || !ent.isValid()) return;
	
	// Grab the name of this ability
	var name = ent.getClassname();
	
	// Check if this one is already hooked
	if(hookedManaCosts[ent.index] == name) {
		return;
	}
	
	// Make sure we have info on this skill
	var info = abs[name];
	if(!info || !info.AbilityManaCost) return;
	
	// Grab the manacosts
	var manacosts = info.AbilityManaCost.split(" ");
	
	// Hook the manacost
	game.hookEnt(ent, dota.ENT_HOOK_GET_MANA_COST, function(ab) {
		// Grab the level of the ability
		var level = ab.netprops.m_iLevel;
		
		// No idea what to do
		if(level <= 0) return;
		
		// Lower the level, to work with JS indexes starting at 0
		level -= 1;
		
		// Check if a manacost exists for this level
		if(level >= manacosts.length) {
			level = manacosts.length - 1;
		}
		
		// Grab the current manacost value
		var cd = parseInt(manacosts[level]);
		
		// Return the modified manacost value
		if(manacostModifier <= 0) {
			return 0;
		} else {
			if(doHookManaCost > 0) {
				return parseInt(cd*manacostModifier);
			} else {
				return parseInt(cd/manacostModifier);
			}
		}
	});
	
	// Store that this ent has been hooked
	hookedManaCosts[ent.index] = name;
}

function hookDamage(ent) {
	// Validate ent
	if(!ent || !ent.isValid()) return;
	
	// Grab the name of this ability
	var name = ent.getClassname();
	
	// Check if this one is already hooked
	if(hookedDamages[ent.index] == name) {
		return;
	}
	
	// Make sure we have info on this skill
	var info = abs[name];
	if(!info || !info.AbilityDamage) return;
	
	// Grab the damages
	var damages = info.AbilityDamage.split(" ");
	
	// Hook the damage
	game.hookEnt(ent, dota.ENT_HOOK_GET_ABILITY_DAMAGE, function(ab) {
		// Grab the level of the ability
		var level = ab.netprops.m_iLevel;
		
		// No idea what to do
		if(level <= 0) return;
		
		// Lower the level, to work with JS indexes starting at 0
		level -= 1;
		
		// Check if a damage exists for this level
		if(level >= damages.length) {
			level = damages.length - 1;
		}
		
		// Grab the current damage value
		var cd = parseInt(damages[level]);
		
		// Return the modified damage value
		if(doHookDamage > 0) {
			return parseInt(cd*damageModifier);
		} else {
			return parseInt(cd/damageModifier);
		}
	});
	
	// Store that this ent has been hooked
	hookedDamages[ent.index] = name;
}

// Check if we need to hook cooldowns
if(doHookCooldowns || doHookManaCost || doHookDamage) {
	// Try to hook every hero's abilities once a second
	timers.setInterval(function() {
		// Grab all heroes
		var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
		
		// Loop over heroes
		for(var hh=0; hh<heroes.length; hh++) {
			// Grab a hero
			var hero = heroes[hh];
			
			// Validate hero
			if(!hero || !hero.isValid() || !hero.isHero()) continue;
			
			// No illusions
			if(dota.hasModifier(hero, 'modifier_illusion')) continue;
			
			// Hook all skills
			for(var i=0; i<16; i++) {
				// Grab a skill
				var ab = hero.netprops.m_hAbilities[i];
				
				// Make sure there is an ability in this slot
				if(ab != null) {
					// Try to hook it
					if(doHookCooldowns) {
						hookCooldown(ab);
					}
					
					if(doHookManaCost) {
						hookManaCost(ab);
					}
					
					if(doHookDamage) {
						hookDamage(ab);
					}
				}
			}
		}
	}, 1000);
}

// Stores base unit stuff
var heroStatGrowth = {};

game.hook("Dota_OnUnitParsed", function(unit, keyvalues) {
	// Grab the name of this unit
	var name = unit.getClassname();
	
	// Hero stat related stuff
	if(unit.isHero()) {
		// Increase base stats
		keyvalues["AttributeBaseStrength"] *= baseStatMultiplier;
		keyvalues["AttributeBaseAgility"] *= baseStatMultiplier;
		keyvalues["AttributeBaseIntelligence"] *= baseStatMultiplier;
		
		keyvalues["AttributeStrengthGain"] *= baseStatMultiplier;
		keyvalues["AttributeAgilityGain"] *= baseStatMultiplier;
		keyvalues["AttributeIntelligenceGain"] *= baseStatMultiplier;
		
		// Store base stats
		heroStatGrowth[name] = {
			'str': keyvalues["AttributeStrengthGain"],
			'agi': keyvalues["AttributeAgilityGain"],
			'int': keyvalues["AttributeIntelligenceGain"]
		};
	} else {
		// Bounty
		if(keyvalues["BountyXP"] != null) {
			keyvalues["BountyXP"] = keyvalues["BountyXP"] * xpBountyModifier;
		}
		
		if(keyvalues["BountyGoldMin"] != null) {
			keyvalues["BountyGoldMin"] = keyvalues["BountyGoldMin"] * goldBountyModifier;
		}
		
		if(keyvalues["BountyGoldMax"] != null) {
			keyvalues["BountyGoldMax"] = keyvalues["BountyGoldMax"] * goldBountyModifier;
		}
	}
	
	// Scale units
	if(name.indexOf('building') != -1 || name.indexOf('tower') != -1 || name.indexOf('fort') != -1) {
		keyvalues["AttackDamageMin"] *= buildingScaler;
		keyvalues["AttackDamageMax"] *= buildingScaler;
		keyvalues["StatusHealth"] *= buildingScaler;
	}
	
	if(name.indexOf('creep') != -1 || name.indexOf('siege') != -1 || name.indexOf('neutral') != -1 || name.indexOf('roshan') != -1) {
		keyvalues["AttackDamageMin"] *= creepScaler;
		keyvalues["AttackDamageMax"] *= creepScaler;
		keyvalues["StatusHealth"] *= creepScaler;
	}
});

var changedValues = {};
game.hook("Dota_OnGetAbilityValue", function(ability, abilityName, field, values) {
	// Check if we've seen this skill before
	var abName = abilityName + '.' + field;
	if(changedValues[abName]) return;
	changedValues[abName] = true;
	
	// Don't touch items yet
	if(abilityName.indexOf('item') != -1) {
		return;
	}
	
	// Make sure there is an inrease in spell values
	if(spellLevelIncrease <= 0) return;
	
	// We don't scale reductions
	if(field.indexOf('reduction') != -1) return;
	
	// Don't scale reflecting of damage
	if(field.indexOf('reflection') != -1) return;
	
	// Don't scale chances
	if(field.indexOf('chance') != -1) return;
	
	// Don't scale chances
	if(field.indexOf('interval') != -1) return;
	
	var min = 10000;
	
	if(values.length <= 1) {
		min = 0;
	} else {
		// Find the minimum difference
		for(var i=1; i<values.length; i++) {
			// Workout the difference
			var dif = values[i] - values[i-1];
			
			if(Math.abs(dif) < Math.abs(min)) {
				min = dif;
			}
		}
	}
	
	// Generate the list of new values
	var newValues = values.slice();
	
	for(var i=0; i<spellLevelIncrease;i++) {
		// Workout the next value
		var prev = newValues[newValues.length-1];
		var next = prev+min;
		
		// Make sure values don't become negative
		if(prev > 0 && next <= 0) next = prev;
		if(prev < 0 && next >= 0) next = prev;
		
		newValues.push(next);
	}
	
	for(var i=0; i<values.length; i++) {
		values[i] = newValues[i+spellLevelIncrease];
	}
	
	return values;
});

// Check if the level cap is larger than 25
if(levelcap > 25) {
	timers.setInterval(function() {
		// Grab all heroes
		var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
		
		// Loop over heroes
		for(var hh=0; hh<heroes.length; hh++) {
			// Grab a hero
			var hero = heroes[hh];
			
			// Validate hero
			if(!hero || !hero.isValid() || !hero.isHero()) continue;
			
			// No illusions
			if(dota.hasModifier(hero, 'modifier_illusion')) continue;
			
			// Grab my level
			var myLevel = +hero.netprops.m_iCurrentLevel;
			
			// Skip over level 25
			if(myLevel == 25) {
				hero.netprops.m_iCurrentLevel += 1;
			}
			
			if(myLevel >= 26) {
				// Check if we've reached the cap
				if(myLevel >= levelcap) continue;
				
				// Grab my current XP
				var myXP = +hero.netprops.m_iCurrentXP;
				
				// Workout how much XP is needed
				var xpNeeded = (myLevel+1)*(myLevel+2)/2*100;
				
				// Check if we should level up
				if(myXP > xpNeeded) {
					// Increase level
					hero.netprops.m_iCurrentLevel += 1;
					
					// Grab the classname
					var name = hero.getClassname();
					
					// Make sure we know how this hero grows
					if(heroStatGrowth[name]) {
						// Add stat points
						hero.netprops.m_flStrength += heroStatGrowth[name]['str'];
						hero.netprops.m_flAgility += heroStatGrowth[name]['agi'];
						hero.netprops.m_flIntellect += heroStatGrowth[name]['int'];
					}
				}
			}
		}
	}, 100);
} else if(levelcap < 25) {
	timers.setInterval(function() {
		// Grab all heroes
		var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
		
		// Loop over heroes
		for(var hh=0; hh<heroes.length; hh++) {
			// Grab a hero
			var hero = heroes[hh];
			
			// Validate hero
			if(!hero || !hero.isValid() || !hero.isHero()) continue;
			
			// No illusions
			if(dota.hasModifier(hero, 'modifier_illusion')) continue;
			
			// Grab my level
			var myLevel = +hero.netprops.m_iCurrentLevel;
			
			if(myLevel >= levelcap) {
				// Lower XP
				hero.netprops.m_iCurrentXP = dota.getTotalExpRequiredForLevel(levelcap);
			}
		}
	}, 100);
	
	// Make the amount of XP needed crazy high
	dota.setTotalExpRequiredForLevel(levelcap+1, 1000000);
}
