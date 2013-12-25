// Load libraries
var timers = require('timers');

// The ID on d2ware
var pluginID = 'Cycle';

// Hook functions
game.hook("OnMapStart", onMapStart);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnUnitParsed", onUnitParsed);

// Hook Events
game.hookEvent("dota_player_gained_level", onPlayerGainedLevel);
game.hookEvent("entity_killed", onEntityKilled);

// Load KVs
var basefile = keyvalue.parseKVFile('omg_base.kv');
var abilitiesDependencies = keyvalue.parseKVFile('abilities_dependencies.kv');
var abs = keyvalue.parseKVFile('npc_abilities.kv').DOTAAbilities;

// Colors
var C_RED = '\x12';
var C_LGREEN = '\x15';

// Sounds
var SOUND_GET_SKILL = 'ui/npe_objective_given.wav';

// Stores the player manager
var playerManager = null;
var data_dire = null;
var data_radiant = null;

// Will store all abiltities
var abilities = [];
var volatileAbilities = [];
var ults = [];
var volatileUlts = [];

// Build list of abiltities
for(var i in basefile.Heroes){
	var h = basefile.Heroes[i];
	
	if(h.Abilities){
		for(var k = 0; k < h.Abilities.length; ++k) {
			var ab = h.Abilities[k];
			if(abilitiesDependencies[ab]) {
				abilities.push(ab);
				
				// Load dependencies (avoid lag later)
				loadDeps(ab);
			}
		}
	}
	
	if(h.VolatileAbilities){
		for(var k = 0; k < h.VolatileAbilities.length; ++k){
			var ab = h.VolatileAbilities[k]
			
			if(abilitiesDependencies[ab]) {
				volatileAbilities.push(ab);
			}
		}
	}
	
	if(h.Ult) {
		var ab = h.Ult;
		
		if(abilitiesDependencies[ab]) {
			ults.push(ab);
			
			// Load dependencies (avoid lag later)
			loadDeps(ab);
		}
	}
	if(h.VolatileUlt) {
		var ab = h.VolatileUlt;
		
		if(abilitiesDependencies[ab]) {
			volatileUlts.push(ab);
		}
	}
}

var startingSkills = 1;
var removeOriginal = true;

// The type of skills to give
var skillSet = 1;

// How we should scale skills
var scaleMode = 1;

// The combinations of skills allowed
var skillCombo = 1;

// Number of seconds to wait for a cycle
var waitTime = 30;

// Give skills on a timer
var timedSkills = true;

// A multiplyer for duration, stupid CSP fuck you
var durationMultiplier = 1;

// Should we stack the passive skills?
var stackPassives = false;

// Should we cooldown new skills?
var cooldownNewSkills = true;

// Should we cycle when we die?
var cycleOnDeath = false;

// Should we cycle when we kill someone?
var cycleOnKill = false;

// Allow the user to -cycle ?
var manualCycling = false;

// Cost for a manual cycle
var manualCost = 0;

plugin.get('LobbyManager', function(obj){
	// Grab options
	var options = obj.getOptionsForPlugin(pluginID);
	if(options) {
		// How often should we cycle the skills?
		switch(options['Cycle Time']) {
			case "Don't Cycle on Timers":
				// Disable auto cycling
				timedSkills = false;
			break;
			
			default:
				// How long to wait between cycles
				waitTime = friendlyTimeToSeconds(options['Cycle Time']);
				
				// Change skills based on a timer
				timedSkills = true;
			break;
		}
		
		// Should we cycle on death / jull?
		switch(options['Kill Death Cycle']) {
			case 'Cycle on Kills':
				// Cycle on kill
				cycleOnKill = true;
			break;
			
			case 'Cycle on Kills & Deaths':
				// Cycle on deaths
				cycleOnDeath = true;

				// Cycle on kill
				cycleOnKill = true;
			break;
			
			case 'Cycle on Deaths':
				// Cycle on deaths
				cycleOnDeath = true;
			break;
			
			case "Don't Cycle on Kills or Deaths":
				// Disable death / kill cycling
				cycleOnDeath = false;
				cycleOnKill = false;
			break;
		}
		
		// Should we allow -cycle ?
		switch(options['Manual Cycling']) {
			case 'Free Manual Cycling':
				allowManualCycle(0);
			break;
			
			case '50g Manual Cycling':
				allowManualCycle(50);
			break;
			
			case '150g Manual Cycling':
				allowManualCycle(150);
			break;
			
			case '250g Manual Cycling':
				allowManualCycle(250);
			break;
			
			case '500g Manual Cycling':
				allowManualCycle(500);
			break;
			
			case '1000g Manual Cycling':
				allowManualCycle(1000);
			break;
		}
		
		// Combination of skills allowed
		switch(options['Combination']) {
			case 'Any Combination':
				skillCombo = 1;
			break;
			
			case 'Unique Skills':
				skillCombo = 2;
			break;
			
			case 'Global Unique Skills':
				skillCombo = 3;
			break;
		}
		
		// Skillset
		switch(options['Skill Set']) {
			case 'Skills and Ults':
				skillSet = 1;
			break;
			
			case 'Skills Only':
				skillSet = 2;
			break;
			
			case 'Ults Only':
				skillSet = 3;
			break;
			
			case '3 Skills, 1 Ult':
				skillSet = 4;
			break;
			
			case 'Only Passives':
				skillSet = 5;
				
				// Can't allow global unique, not enough skills
				if(skillCombo == 3) {
					skillCombo = 2;
				}
			break;
			
			case 'Only AOE':
				skillSet = 6;
				
				// Can't allow global unique, not enough skills
				if(skillCombo == 3) {
					skillCombo = 2;
				}
			break;
			
			case 'Only Point Target':
				skillSet = 7;
				
				// Can't allow global unique, not enough skills
				if(skillCombo == 3) {
					skillCombo = 2;
				}
			break;
			
			case 'Only Target':
				skillSet = 8;
				
				// Can't allow global unique, not enough skills
				if(skillCombo == 3) {
					skillCombo = 2;
				}
			break;
			
			case 'Only No Target':
				skillSet = 9;
				
				// Can't allow global unique, not enough skills
				if(skillCombo == 3) {
					skillCombo = 2;
				}
			break;
		}
		
		// Starting skills
		switch(options['Starting Skills']) {
			case '1 Starting Skill':
				startingSkills = 1;
				removeOriginal = true;
			break;
			
			case '2 Starting Skills':
				startingSkills = 2;
				removeOriginal = true;
			break;
			
			case '3 Starting Skills':
				startingSkills = 3;
				removeOriginal = true;
			break;
			
			case '4 Starting Skills':
				startingSkills = 4;
				removeOriginal = true;
			break;
			
			case 'No Starting Skills':
				startingSkills = 0;
				removeOriginal = true;
			break;
			
			case 'Original Skills':
				startingSkills = 0;
				removeOriginal = false;
			break;
		}
		
		
		
		// How should we scale the skills?
		switch(options['Scaling']) {
			case 'Max Out Skills':
				scaleMode = 1;
			break;
			
			case 'Scale On Hero Level':
				scaleMode = 2;
			break;
			
			case 'Scale On Average Hero Level':
				scaleMode = 3;
			break;
			
			case 'Scale On Highest Hero Level':
				scaleMode = 4;
			break;
		}
		
		// Should we stack passives?
		switch(options['Stacking']) {
			case 'Remove Passives':
				stackPassives = false;
			break;
			
			case 'Stack Passives':
				stackPassives = true;
			break;
		}
		
		// Should we cooldown new abilities?
		switch(options['Cooldown']) {
			case 'Cooldown New Abilities':
				cooldownNewSkills = true;
			break;
			
			case 'Preserve Cooldowns':
				cooldownNewSkills = false;
			break;
		}
	}
	
	// Fix fucking custom spell power SHIT
	var csp = obj.getOptionsForPlugin('CustomSpellPower');
	if(csp) {
		// Try to grab multiplier
		var mult = csp['Multiplier'];
		if(mult) {
			// Try to change the duration modifier
			durationMultiplier = parseFloat(mult.substr(1, mult.length)) || 1;
		}
	}
});

function onMapStart() {
	// Grab managers
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	data_dire = game.findEntityByClassname(-1, "dota_data_dire");
	data_radiant = game.findEntityByClassname(-1, "dota_data_radiant");
}

// Stores everyone who has gotten their initial skills
function onHeroSpawn(hero) {
	if(!hero) return;
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Check if they are in manual mode
	if(manualCycling) {
		// Grab gametime
		var gameTime = game.rules.props.m_fGameTime;
		
		// Print cycling help
		if(!lastMessage[playerID] || gameTime > lastMessage[playerID]) {
			// Minimum time between messages
			lastMessage[playerID] = gameTime + 10;
			
			// Find Client
			var client = dota.findClientByPlayerID(playerID);
			if(client && client.isInGame()) {
				// Check if it costs anything to cycle
				if(manualCost == 0) {
					// Print message
					client.printToChat(C_LGREEN+'Type '+C_RED+'-cycle'+C_LGREEN+' to change your skills.');
				} else {
					// Print message
					client.printToChat(C_LGREEN+'Type '+C_RED+'-cycle'+C_LGREEN+' to change your skills, it costs '+C_RED+manualCost+' gold'+C_LGREEN+'!');
				}
			}
		}
	}
	
	// Only do this once
	if(gottenSkills[playerID]) return;
	gottenSkills[playerID] = true;
	
	// Have to do this next frame for this to work
	timers.setTimeout(function() {
		// Make sure hero is still valid
		if(!hero || !hero.isValid()) return;
		
		// Check if we should remove original
		if(removeOriginal) {
			// Remove all starting abilities
			for(var i=0; i<16; i++) {
				var ab = hero.netprops.m_hAbilities[i];
				if(ab != null) {
					cleanupAbility(hero, ab);
					dota.removeAbilityFromIndex(hero, i);
				}
			}
			
			// Give 4 empty slots
			var ab = dota.createAbility(hero, 'doom_bringer_empty1');
			dota.setAbilityByIndex(hero, ab, 0);
			
			ab = dota.createAbility(hero, 'doom_bringer_empty2');
			dota.setAbilityByIndex(hero, ab, 1);
			
			ab = dota.createAbility(hero, 'invoker_empty1');
			dota.setAbilityByIndex(hero, ab, 2);
			
			ab = dota.createAbility(hero, 'invoker_empty2');
			dota.setAbilityByIndex(hero, ab, 3);
		} else {
			// Max out all skills
			for(var i=0; i<4; i++) {
				// Grab ability
				var ab = hero.netprops.m_hAbilities[i];
				if(ab != null && ab.isValid()) {
					// Grab name of ability
					var name = ab.getClassname();
					
					// Max number of levels to give
					var maxLevels = 4;
					
					// Check if it's an ult
					if(ults.indexOf(name) != -1) {
						// Only give 3 levels
						maxLevels = 3;
					}
					
					// Give levels
					for(l=0; l < maxLevels; l++) {
						dota.upgradeAbility(ab);
					}
				}
			}
		}
		
		// Remove skill points
		hero.netprops.m_iAbilityPoints = 0;
		
		// Give starting skills
		for(var i=0; i<startingSkills; i++) {
			cycle(hero);
		}
		
		// Stop ult from changing instantly in 3 Skills, 1 Ult
		if(skillSet == 4) {
			cycleNumber[playerID] = 0;
		}	
	}, 1);
}


var gameStarted = false;
function onGameFrame(){
	// check if the game has started yet
	if(!gameStarted && game.rules.props.m_nGameState == dota.STATE_GAME_IN_PROGRESS) {
		// It has
		gameStarted = true;
		
		// Check if we should automatically cycle the skills
		if(timedSkills) {
			// Cycle skills automatically
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
					
					// Cycle this hero
					cycle(hero);
					
					// Grab client
					var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
					if(client && client.isInGame()) {
						// Play new skill sound
						dota.sendAudio(client, false, SOUND_GET_SKILL);
					}
				}
			}, waitTime * 1000);
		}
	}
}

// Remove skill points
function onPlayerGainedLevel(event) {
	// Update everyone's skills
	for(var i=0;i<server.clients.length;i++) {
		// Grab a client
		var client = server.clients[i];
		
		// Check if this client is a zombie
		if(client && client.isInGame()) {
			var heroes = client.getHeroes();
			for(var hh=0; hh<heroes.length; hh++) {
				var hero = heroes[hh];
				
				if(hero && hero.isValid() && !dota.hasModifier(hero, 'modifier_illusion')) {
					hero.netprops.m_iAbilityPoints = 0;
				}
			}
		}
	}
}

// Cycle on death / kill
function onEntityKilled(event) {
	var killed = game.getEntityByIndex(event.getInt('entindex_killed'));
	if(killed == null || !killed.isValid()) return;
	var attacker = game.getEntityByIndex(event.getInt('entindex_attacker'));
	
	// Cycle on death
	if(cycleOnDeath) {
		// Check if it was a hero that was killed (and not an illusion)
		if(killed != null && killed.isHero() && !dota.hasModifier(killed, 'modifier_illusion')) {
			// Grab the playerID to match
			var matchID = killed.netprops.m_iPlayerID;
			if(matchID < 0 || matchID > 9) return;
			
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
				
				// Make sure it's owned by the corret player
				if(hero.netprops.m_iPlayerID != matchID) continue;
				
				// Cycle this hero
				cycle(hero);
			}
			
			// Grab client
			var client = dota.findClientByPlayerID(matchID);
			if(client && client.isInGame()) {
				// Play new skill sound
				dota.sendAudio(client, false, SOUND_GET_SKILL);
			}
		}
	}
	
	// Cycle on kill
	if(cycleOnKill) {
		// Check if it was a hero that got the kill (and not an illusion)
		if(attacker != null && attacker.isValid() && attacker.isHero() && !dota.hasModifier(attacker, 'modifier_illusion') && killed.isHero()) {
			// Grab the playerID to match
			var matchID = attacker.netprops.m_iPlayerID;
			if(matchID < 0 || matchID > 9) return;
			
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
				
				// Make sure it's owned by the corret player
				if(hero.netprops.m_iPlayerID != matchID) continue;
				
				// Cycle this hero
				cycle(hero);
			}
			
			// Grab client
			var client = dota.findClientByPlayerID(matchID);
			if(client && client.isInGame()) {
				// Play new skill sound
				dota.sendAudio(client, false, SOUND_GET_SKILL);
			}
		}
	}
}

function onUnitParsed(unit, keyvalues){
	// Check if they are are hero
	if(unit.isHero()) {
		// Give extra mana
		keyvalues['StatusMana'] = 500;
		keyvalues['StatusManaRegen'] = 2;
	}
}

function allowManualCycle(cost) {
	// Load -cycle
	console.addClientCommand('cycle', CmdUserCycle);
	
	// Make the game tell the user
	manualCycling = true;
	
	// Set the cost
	manualCost = cost;
}

var gottenSkills = {};
var cycleNumber = {};
var lastMessage = {};

function getMaxLevels(hero, maxLevels) {
	// Check if there is a different scaling method in place
	if(scaleMode > 1) {
		switch(scaleMode) {
			// Scale on hero level
			case 2:
				maxLevels = getMaxSkillLevel(hero.netprops.m_iCurrentLevel, maxLevels);
			break;
			
			// Scale on average hero level
			case 3:
				var totalHeroes = 0;
				var totalLevels = 0;
				
				var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
				
				// Loop over heroes
				for(var hh=0; hh<heroes.length; hh++) {
					// Grab a hero
					var h = heroes[hh];
					
					// Validate hero
					if(!h || !h.isValid() || !h.isHero()) continue;
					
					// No illusions
					if(dota.hasModifier(h, 'modifier_illusion')) continue;
					
					// Found a hero
					totalHeroes += 1;
					
					// Add level
					totalLevels += hero.netprops.m_iCurrentLevel;
				}
				
				// If we found any heroes
				if(totalHeroes > 0) {
					// Change the max level
					maxLevels = getMaxSkillLevel(Math.floor(totalLevels/totalHeroes), maxLevels);
				}
			break;
			
			// Scale on max hero level
			case 4:
				var highestLevel = 1;
				
				var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
				
				// Loop over heroes
				for(var hh=0; hh<heroes.length; hh++) {
					// Grab a hero
					var h = heroes[hh];
					
					// Validate hero
					if(!h || !h.isValid() || !h.isHero()) continue;
					
					// No illusions
					if(dota.hasModifier(h, 'modifier_illusion')) continue;
					
					// grab level
					newLevel = hero.netprops.m_iCurrentLevel;
					
					// Check if the new level is higher than our old highest
					if(newLevel > highestLevel) {
						// Store our new highest
						highestLevel = newLevel;
					}
				}
				
				// Change the max level of the skill
				maxLevels = getMaxSkillLevel(highestLevel, maxLevels);
			break;
		}
	}
	
	// Return maxlevels
	return maxLevels;
}

function cycle(hero, specificSkill) {
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Make sure they player has a cycle count
	if(cycleNumber[playerID] == null) cycleNumber[playerID] = -1;
	
	// Keep track of the cycle number
	cycleNumber[playerID] += 1;
	if(cycleNumber[playerID] > 3) {
		cycleNumber[playerID] = 0;
	}
	
	// Queue the ability to be cleaned up
	cleanupAbility(hero, hero.netprops.m_hAbilities[0]);
	
	// Remove first slot
	dota.removeAbilityFromIndex(hero, 0);
	
	// Number of slots to carry
	var carryNumber = 4;
	
	// Change how many skills to carry
	if(skillSet == 4) {
		carryNumber = 3;
	}
	
	// Carry slots
	for(var i=1; i<carryNumber; i++) {
		var ab = hero.netprops.m_hAbilities[i];
		
		if(ab != null) {
			// Remove from current slot
			dota.removeAbilityFromIndex(hero, i);
			
			// Roll down to new slot
			dota.setAbilityByIndex(hero, ab, i-1);
		}
	}
	
	
	var skill = '';
	var maxLevels = 0;
	
	var invalidSkills = null;
	
	// Keep picking a new skill until we have a valid one
	var validSkill = false;
	while(!validSkill) {
		// Pick a new skill
		switch(skillSet) {
			// Skills only
			case 2:
				skill = getRandomFromArray(abilities);
				maxLevels = 4;
			break;
			
			// Ults Only
			case 3:
				skill = getRandomFromArray(ults);
				maxLevels = 3;
			break;
			
			// 3 Skills, 1 Ult
			case 4:
				skill = getRandomFromArray(abilities);
				maxLevels = 4;
			break;
			
			// Skills and Ults
			default:
				if(Math.random() > 0.8) {
					skill = getRandomFromArray(ults);
					maxLevels = 3;
				} else {
					skill = getRandomFromArray(abilities);
					maxLevels = 4;
				}
			break;
		}
		
		switch(skillCombo) {
			// Allow any combination of skills
			case 1:
				validSkill = true;
			break;
			
			// Stop the player's hero from getting the same skill twice
			case 2:
				// Check if we need to build a list of invalid skills
				if(invalidSkills == null) {
					// Create array of invalid skills
					invalidSkills = [];
					
					// Loop over all abilities
					for(var i=0; i<16; i++) {
						// Grab ability
						var ab = hero.netprops.m_hAbilities[i];
						
						// Validate ability
						if(ab && ab.isValid()) {
							// Store it as an invalid skill
							invalidSkills.push(ab.getClassname());
						}
					}
				}
				
				// Check if the selected skill is not in our invalid skills
				if(invalidSkills.indexOf(skill) == -1) {
					// This is now a valid skill
					validSkill = true;
				}
			break;
			
			// Stop any player from sharing the same skills with any other player
			case 3:
				// Check if we need to build a list of invalid skills
				if(invalidSkills == null) {
					// Create array of invalid skills
					invalidSkills = [];
					
					var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
				
					// Loop over heroes
					for(var hh=0; hh<heroes.length; hh++) {
						// Grab a hero
						var h = heroes[hh];
						
						// Validate hero
						if(!h || !h.isValid() || !h.isHero()) continue;
						
						// No illusions
						if(dota.hasModifier(h, 'modifier_illusion')) continue;
					
						// Loop over all abilities
						for(var i=0; i<16; i++) {
							// Grab ability
							var ab = h.netprops.m_hAbilities[i];
							
							// Validate ability
							if(ab && ab.isValid()) {
								// Store it as an invalid skill
								invalidSkills.push(ab.getClassname());
							}
						}
					}
				}
				
				// Check if the selected skill is not in our invalid skills
				if(invalidSkills.indexOf(skill) == -1) {
					// This is now a valid skill
					validSkill = true;
				}
			break;
		}
		
		// Validate skill specific types
		switch(skillSet) {
			// Only passives
			case 5:
				// Check if the skill is a passive
				if(!isSkillType(skill, "DOTA_ABILITY_BEHAVIOR_PASSIVE")) {
					// Nope, don't allow it
					validSkill = false;
				}
			break;
			
			// Only AOE
			case 6:
				// Check if the skill is an Point Target
				if(!isSkillType(skill, "DOTA_ABILITY_BEHAVIOR_AOE")) {
					// Nope, don't allow it
					validSkill = false;
				}
			break;
			
			// Only Point Target
			case 7:
				// Check if the skill is an Point Target
				if(!isSkillType(skill, "DOTA_ABILITY_BEHAVIOR_POINT")) {
					// Nope, don't allow it
					validSkill = false;
				}
			break;
			
			// Only Target
			case 8:
				// Check if the skill is an AOE
				if(!isSkillType(skill, "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET")) {
					// Nope, don't allow it
					validSkill = false;
				}
			break;
			
			// Only No Target
			case 9	:
				// Check if the skill is an AOE
				if(!isSkillType(skill, "DOTA_ABILITY_BEHAVIOR_NO_TARGET")) {
					// Nope, don't allow it
					validSkill = false;
				}
			break;
		}
		
		// Adjust the max level of this skill
		maxLevels = getMaxLevels(hero, maxLevels);
		
		// If we're not playing ULTS only
		if(skillSet != 3) {
			// Make sure there is at least one level in it
			if(maxLevels <= 0) {
				validSkill = false;
			}
		}
	}
	
	// Check if a specific skill was parsed
	if(specificSkill) {
		skill = specificSkill;
	}
	
	// Load dependencies
	loadDeps(skill);
	
	// Push into top level slot
	var ab = dota.createAbility(hero, skill);
	dota.setAbilityByIndex(hero, ab, carryNumber-1);
	
	// If we should cooldown new skills
	if(cooldownNewSkills) {
		dota.endCooldown(ab);
	}
	
	// Level the skill
	for(var i=0; i<maxLevels; i++) {
		dota.upgradeAbility(ab);
	}
	
	if(skillSet == 4) {
		// Check if we should change our ult
		if(cycleNumber[playerID] == 0) {
			// Queue the ability to be cleaned up
			cleanupAbility(hero, hero.netprops.m_hAbilities[3]);
			
			// Remove ult slot
			dota.removeAbilityFromIndex(hero, 3);
			
			// Grab new ult
			skill = getRandomFromArray(ults);
			maxLevels = getMaxLevels(hero, 3);
			
			// Load dependencies
			loadDeps(skill);
			
			// Push into ult slot
			var ab = dota.createAbility(hero, skill);
			dota.setAbilityByIndex(hero, ab, 3);
			
			// If we should cooldown new skills
			if(cooldownNewSkills) {
				dota.endCooldown(ab);
			}
			
			// Level the skill
			for(var i=0; i<maxLevels; i++) {
				dota.upgradeAbility(ab);
			}
		}
	}
}

// Check's if a skill is a certain type
function isSkillType(name, type) {
	var info = abs[name];
	if(!info) return true;
	
	// Check if it matches the type, or has no types
	if(!info.AbilityBehavior || info.AbilityBehavior.indexOf(type) != -1) return true;
	
	// Failure
	return false;
}

// Scales maxLevels based on the heroes level
function getMaxSkillLevel(heroLevel, maxLevels) {
	if(maxLevels == 3) {
		// ULT
		
		// Scales like the real game
		if(heroLevel < 6) return 0;
		if(heroLevel < 11) return 1;
		if(heroLevel < 16) return 2;
		
		return 3;
	} else {
		// Regular skill
		
		if(heroLevel < 3) return 1;
		if(heroLevel < 5) return 2;
		if(heroLevel < 7) return 3;
		
		return 4;
	}
}

function loadDeps(skill) {
	var dependencies = abilitiesDependencies[skill];
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
		print("Couldn't find dependencies for ability: " + skill);
	}
}

// Returns a random value from an array
function getRandomFromArray(ar) {
	return ar[Math.floor(Math.random()*ar.length)];
}

function cleanupModifier(hero, name) {
	if(dota.hasModifier(hero, name)) {
		dota.removeModifier(hero, name);
	}
	
	if(dota.hasModifier(hero, 'modifier_'+name)) {
		dota.removeModifier(hero, 'modifier_'+name);
	}
}

function cleanupAbility(hero, ab) {
	if(!ab || !ab.isValid()) return;
	
	// If we are stacking passives (why people want this, idk) just dont remove the ability / skill >_>
	if(stackPassives) return;
	
	// Grab info on the skill
	var name = ab.getClassname();
	var info = abs[name];
	
	// Cleanup spirit bear
	if(name == 'lone_druid_spirit_bear') {
		var conIndex = 1 << hero.netprops.m_iPlayerID;
		
		// Remove bears owned by this hero
		var bears = game.findEntitiesByClassname('npc_dota_lone_druid_bear*');
		for(i=0; i<bears.length; i++) {
			var bear = bears[i];
			if(!bear || !bear.isValid()) continue;
			
			// Check if the bear is owned by this player
			if(bear.netprops.m_iIsControllableByPlayer == conIndex) {
				// Remove it
				dota.remove(bear);
			}
		}
		
		// Remove stuff
		dota.remove(ab);
		cleanupModifier(hero, name);
		return;
	}
	
	// Cleanup familiars
	if(name == 'visage_summon_familiars') {
		var conIndex = 1 << hero.netprops.m_iPlayerID;
		
		// Remove bears owned by this hero
		var bears = game.findEntitiesByClassname('npc_dota_visage_familiar*');
		for(i=0; i<bears.length; i++) {
			var bear = bears[i];
			if(!bear || !bear.isValid()) continue;
			
			// Check if the bear is owned by this player
			if(bear.netprops.m_iIsControllableByPlayer == conIndex) {
				// Remove it
				dota.remove(bear);
			}
		}
		
		// Remove stuff
		dota.remove(ab);
		cleanupModifier(hero, name);
		return;
	}
	
	// Cleanup webs
	if(name == 'broodmother_spin_web') {
		var conIndex = 1 << hero.netprops.m_iPlayerID;
		
		// Remove bears owned by this hero
		var bears = game.findEntitiesByClassname('npc_dota_broodmother_web*');
		for(i=0; i<bears.length; i++) {
			var bear = bears[i];
			if(!bear || !bear.isValid()) continue;
			
			// Check if the bear is owned by this player
			if(bear.netprops.m_hOwnerEntity == hero) {
				// Remove it
				dota.remove(bear);
			}
		}
		
		// Remove stuff
		dota.remove(ab);
		cleanupModifier(hero, name);
		return;
	}
	
	// Cleanup restoration
	if(name == 'witch_doctor_voodoo_restoration') {
		cleanupModifier(hero, 'modifier_voodoo_restoration_aura');
		cleanupModifier(hero, 'modifier_voodoo_restoration_heal');
	}
	
	// Cleanup templar refraction
	if(name == 'templar_assassin_refraction') {
		cleanupModifier(hero, 'modifier_templar_assassin_refraction_damage');
		cleanupModifier(hero, 'modifier_templar_assassin_refraction_absorb');
	}
	
	var duration = -1;
	
	if(info) {
		for(key in info) {
			if(	key.indexOf('duration') != -1 ||
				key.indexOf('ChannelTime') != -1) {
				
				// Grab all durations
				var durs = info[key].split(' ');
				
				// Update duration
				var newDuration = parseFloat(durs[durs.length-1]);
				
				// Take largest
				if(newDuration > duration) {
					duration = newDuration;
				}
			}
		}
		
		// Check for duration
		var spec = info.AbilitySpecial;
		if(spec) {
			for(key in spec) {
				for(key2 in spec[key]) {
					if(	key2.indexOf('duration') != -1 ||
						key2.indexOf('channel_time') != -1) {
						
						// Grab all durations
						var durs = spec[key][key2].split(' ');
						
						// Update duration
						var newDuration = parseFloat(durs[durs.length-1]);
						
						// Take largest
						if(newDuration > duration) {
							duration = newDuration;
						}
					}
				}
			}
		}
		
		// Check if this ability has behavior (probably does)
		var b = info['AbilityBehavior'];
		if(b != null) {
			// If it's a passive, we can simply remove it
			if(b.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) {
				dota.remove(ab);
				return;
			}
		}
	}
	
	// Failed to find duration, default to 300
	if(duration == -1) {
		duration = 300;
	}
	
	// Cleanup modifiers
	cleanupModifier(hero, name);
	
	// Remvoe after duration is up (add a buffer of 10 seconds since cleanup doesnt matter too much anyways)
	timers.setTimeout(function() {
		if(ab && ab.isValid()) {
			dota.remove(ab);
		}
	}, (duration) * 1000 * durationMultiplier + 1000);
	// durationMultiplier is for CSP support
	// Add an extra second just to be sure
}

// Only load if this plugin isn't sandboxed
if(!plugin.isSandboxed()) {
	server.print('\n\nCycle Dev Stuff Loaded!\n\n')
	
	// Add command to cycle easily
	console.addClientCommand('c', function(client, args) {
		var hero = client.netprops.m_hAssignedHero;
		if(!hero || !hero.isValid()) return;
		
		if(args.length > 0) {
			cycle(hero, args[0]);
		} else {
			cycle(hero);
		}
	});
	
	var upto = 0;
	
	// Add command to cycle all skills in order
	console.addClientCommand('s', function(client, args) {
		var hero = client.netprops.m_hAssignedHero;
		if(!hero || !hero.isValid()) return;
		
		// Skip to number X
		if(args.length > 0) {
			upto = parseInt(args[0]);
		}
		
		cycle(hero, abilities[upto]);
		upto += 1;
		if(upto >= abilities.length) upto = 0;
	});
	
	// Add command to cycle all ults in order
	console.addClientCommand('u', function(client, args) {
		var hero = client.netprops.m_hAssignedHero;
		if(!hero || !hero.isValid()) return;
		
		// Skip to number X
		if(args.length > 0) {
			upto = parseInt(args[0]);
		}
		
		cycle(hero, ults[upto]);
		upto += 1;
		if(upto >= ults.length) upto = 0;
	});
}

// Cycles all of a users heroes's skills
function CmdUserCycle(client, args) {
	if(manualCost > 0) {
		// Grab gold
		var gold = getClientGold(client);
		
		// Make sure they have enough gold for a cycle
		if(!gold || (gold.u+gold.r) <= manualCost) {
			client.printToChat(C_LGREEN+"You don't have enough gold to cycle your skills. ("+C_RED+manualCost+'g'+C_LGREEN+")");
			return;
		}
		
		// Remove gold
		gold.u -= manualCost;
		if(gold.u < 0) {
			gold.r += gold.u;
			gold.u = 0;
		}
		
		// Change their gold
		if(!setClientGold(client, gold)) {
			return;
		}
	}
	
	var heroes = client.getHeroes();
	for(var hh=0; hh<heroes.length; hh++) {
		var hero = heroes[hh];
		
		// Validate hero
		if(hero && hero.isValid() && hero.isHero() && !dota.hasModifier(hero, 'modifier_illusion')) {
			cycle(hero);
		}
	}
	
	// Valid client
	if(client && client.isInGame()) {
		// Play new skill sound
		dota.sendAudio(client, false, SOUND_GET_SKILL);
	}
}

function friendlyTimeToSeconds(input) {
	// Split into two parts
    var parts = input.split(':');
	
	// Grab minutes and seconds
    var minutes = parseInt(parts[0]);
    var seconds = parseInt(parts[1]);
	
	// Return seconds
    return (minutes * 60 + seconds);
}

// Gets the client gold
function getClientGold(client) {
	// Grab playerID
	var playerID = client.getPlayerID();
	if(playerID < 0 || playerID > 9) return null;
	
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
		r:0+reliableGold,
		u:0+unreliableGold
	}
}

// Sets the clients gold
function setClientGold(client, gold) {
	// Validate gold
	if(gold == null || gold.r == null || gold.u == null) {
		return false;
	}
	
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if (playerID < 0 || playerID > 9) {
		return false;
	}
	
	// Grab current gold
	var currentGold = getClientGold(client);
	if(!currentGold) return false;
	
	// Give the difference in current gold
	dota.givePlayerGold(playerID, gold.r - currentGold.r, true);
	dota.givePlayerGold(playerID, gold.u - currentGold.u, false);
	
	return true;
}