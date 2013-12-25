// Max number of skills allowed
var maxSkills = 6;

// The title you gave it, for use with loading lobby settings
var LobbyTitle = 'SpecificSkills';

var cvForceGameMode = console.findConVar("dota_force_gamemode");
cvForceGameMode.setInt(11);

// KVs
var abilitiesDependencies = keyvalue.parseKVFile('abilities_dependencies.kv');

// Default skills
var skills = [];

// Weather or not to force a hero
var forceHero = '';

// A map of heros mostly from Mid Only by M28
var heroMap = keyvalue.parseKVFile('heroMap.kv');
var abs = keyvalue.parseKVFile('npc_abilities.kv').DOTAAbilities;

// Stores for our skills
var skillsBasic = [];
var skillsUlt = [];

// Build list of abilities
for(key in abs) {
	// Don't add these skills
	if(	key == 'ability_base' ||
		key == 'default_attack' ||
		key == 'attribute_bonus') {
			continue;
	}
	
	// Grab an ability
	var ab = abs[key];
	if(!ab) continue;
	
	// Make sure it has a type
	if(!ab.AbilityName) continue;
	
	// Check if it's an ult
	if(ab.AbilityType == 'DOTA_ABILITY_TYPE_ULTIMATE') {
		// Store this ult
		skillsUlt.push(ab.AbilityName);
	} else {
		// Store this skill
		skillsBasic.push(ab.AbilityName);
	}
}

// List of all skills
var skillsAll = skillsBasic.concat(skillsUlt);

// Load lobby stuff
plugin.get('LobbyManager', function(obj){
	// Load forced hero
	forceHero = obj.getOptionsForPlugin(LobbyTitle)['Hero'] || '';
	
	if(forceHero.toLowerCase().indexOf('any') != -1) {
		// Allow any hero
		forceHero = ''
	} else if(forceHero.toLowerCase().indexOf('random') != -1) {
		// Force random
		forceHero = 'random';
	} else {
		// Attempt to find hero
		if(heroMap[forceHero]) {
			// Found it, grab the real name
			forceHero = heroMap[forceHero];
		} else {
			// Failed, lets not force anything
			forceHero = '';
		}
	}
	
	// Will store dependency abilities
	var skillsDep = [];
	
	// Parse each skill
	loadSkillLoop:
	for(var i=0;i<maxSkills;i++) {
		// Grab the skill
		var skill = obj.getOptionsForPlugin(LobbyTitle)['Skill '+(i+1)] || 'none';
		
		switch(skill) {
			case 'Random Skill':
				// Grab a random skill
				skill = getRandomSkill(skillsBasic);
			break;
			
			case 'Random Ult':
				// Grab a random ult
				skill = getRandomSkill(skillsUlt);
			break;
			
			case 'Random Skill Or Ult':
				// Grab a random ult or skill
				skill = getRandomSkill(skillsAll);
			break;
			
			case 'Individual Random Skill':
			case 'Individual Random Ult':
			case 'Individual Random Skill Or Ult':
				// Store that we need a random one
				skills.push(skill);
				
				// No need to try and load this skill
				continue loadSkillLoop;
			break;
		}
		
		// Fix 'none' case
		if(skill.toLowerCase().indexOf('none') == -1) {
			// Store the skill
			skills.push(skill);
			
			// Preload the skills
			var deps = preLoadSkill(skill);
			
			// Concat in the dependencies
			skillsDep = skillsDep.concat(deps);
		}
	}
	
	// Append attribute skill
	skills.push('attribute_bonus');
	
	// Merge in dependencies
	skills = skills.concat(skillsDep);
});

// Hook functions
game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnHeroPicked", onHeroPicked);
game.hook("Dota_OnUnitParsed", onUnitParsed);

/*
Hook functions
*/

function onGameFrame(){
	cvForceGameMode.setInt(11);
}

function onHeroPicked(client, heroName) {
	// Force a hero pick if it was specified
	if(forceHero != '') return forceHero;
}

function onUnitParsed(unit, keyvalues) {
	// Only apply to heros
	if (!unit.isHero()) return;
	
	// This is required, otherwise 4 slot heroes can't get bonus atribbutes
	keyvalues['AbilityLayout'] = '6';
	
	// Grab a copy of skills
	var mySkills = [skills.length];
	for(var i=0;i<skills.length;i++) mySkills[i] = skills[i];
	
	// Replace skills
	for(var i=0; i< 16; i++) {
		// Grab the slot this refers to
		var slot = i+1;
		
		// Grab a skill
		var skill = mySkills[i];
		
		// Check if we need a random skill
		switch(skill) {
			case 'Individual Random Skill':
				// Grab a random skill
				skill = getRandomSkill(skillsBasic);
				
				// Preload the skills, add dependencies
				var deps = preLoadSkill(skill);
				mySkills = mySkills.concat(deps);
			break;
			
			case 'Individual Random Ult':
				// Grab a random ult
				skill = getRandomSkill(skillsUlt);
				
				// Preload the skills, add dependencies
				var deps = preLoadSkill(skill);
				mySkills = mySkills.concat(deps);
			break;
			
			case 'Individual Random Skill Or Ult':
				// Grab a random ult or skill
				skill = getRandomSkill(skillsAll);
				
				// Preload the skills, add dependencies
				var deps = preLoadSkill(skill);
				mySkills = mySkills.concat(deps);
			break;
		}
		
		// Check if we grabbed a skill
		if(skill) {
			// Store the ability
			keyvalues["Ability"+slot] = skill;
		} else {
			// Check if there is a skill in this slot
			if(keyvalues["Ability"+slot]) {
				// Remove it
				keyvalues["Ability"+slot] = '';
			}
		}
	}
}

/*
Functions
*/

// Gets a random skill from the given array
function getRandomSkill(ar) {
	var s;
	
	do {
		s = ar[Math.floor(Math.random()*ar.length)];
	} while(!abilitiesDependencies[s]);
	
	return s;
}

function preLoadSkill(skill) {
	var deps = [];
	
	// Load dependencies
	var dependencies = abilitiesDependencies[skill];
	if (dependencies) {
		// Particles
		if (dependencies.Particles) {
			for (var k = 0 ; k < dependencies.Particles.length ; ++k) {
				dota.loadParticleFile(dependencies.Particles[k]);
			}
		}
		
		// Models
		if (dependencies.Models) {
			for (var k = 0 ; k < dependencies.Models.length ; ++k) {
				game.precacheModel(dependencies.Models[k], true);
			}
		}
		
		// Extra abilities
		if (dependencies.SubAbilities) {
			for (var k = 0 ; k < dependencies.SubAbilities.length ; ++k) {
				// Store that we need this ability
				deps.push(dependencies.SubAbilities[k]);
			}
		}
	} else {
		print("Couldn't find dependencies for ability: " + skill);
		return [];
	}
	
	// Return the dependencies
	return deps;
}