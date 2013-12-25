// The playerID to use to control creeps
var creepControllerID = 23;

var waveNumber = 0;			// The wave we are currently at
var inWave = false;			// Are we currently in a wave?
var activeCreeps;			// Will store an array of creeps spawned in the last wave
var customUnits = null;	// Used to spawn custom units

var unitKV = keyvalue.parseKVFile('units.kv');

// Load dota files
var npc_heroes = keyvalue.parseKVFile('npc_heroes.kv').DOTAHeroes;
var npc_units = keyvalue.parseKVFile('npc_units.kv').DOTAUnits;
var npc_abilities = keyvalue.parseKVFile('npc_abilities.kv').DOTAAbilities;
var abilities_dependencies = keyvalue.parseKVFile('abilities_dependencies.kv');


var unitHP = 600;

// Wave scaling stuff
var hpScale = 1/10;		// Creeps HP doubles every 10 waves

// Hook functions
game.hook('OnMapStart', onMapStart);
game.hook('Dota_OnUnitParsed', onUnitParsed);
game.hook('Dota_OnUnitThink', onUnitThink);

/*
Hook functions
*/

function onMapStart() {
	// Spawn a pudge
	spawnHero('npc_dota_hero_pudge');
}

function onUnitParsed(ent, keys) {
	if(!customUnits) return;
	
	// Apply each field
	for(var key in customUnits) {
		keys[key] = customUnits[key];
	}
}

function onUnitThink(unit) {
	if(unit.isHeroCreep) {
		// Turn on any skills
		for(key in unit.skillInfo) {
			if(unit.skillInfo[key].toggle) {
				if(!unit.toggled) {
					server.print('toggling');
					
					var ab = unit.netprops.m_hAbilities[parseInt(key)-1];
					server.print(ab.getClassname());
					
					// Turn it on
					//ab.netprops.m_bToggleState = true;
					
					server.print(key);
					
					unit.toggled = true;
					
					// Toggle the skill
					dota.executeOrders(creepControllerID, dota.ORDER_TYPE_AUTO_CAST_ABILITY, [unit], null, ab, false, util.pos0);
					
					//dota.executeOrders(creepControllerID, dota.ORDER_TYPE_MOVE_TO_LOCATION, [unit], null, null, false, util.pos0);
				}
			}
		}
	}
}

/*
Functions
*/

// Starts the next wave (if the last one is over)
function newWave() {
	// Make sure there isn't a wave active
	if(inWave) return;
	
	// The wave we are currently in increases
	waveNumber += 1;
	
	
}

console.addClientCommand("h", function(client, args) {
	// Spawn a pudge
	var creep = spawnHero('npc_dota_hero_pudge');
	
	var heroes = client.getHeroes();
	for(var hh in heroes) {
		var hero = heroes[hh];
		if(!hero) continue;
		
		// Teleport him near us
		dota.findClearSpaceForUnit(creep, hero.netprops.m_vecOrigin);
	}
	
});

console.addClientCommand("spawn", function(client, args) {
	// Spawn custom units
	customUnits = {
		StatusHealth: 132,
		model: 'models/heroes/pudge/pudge.mdl'
	};
	
	for(var i=0;i<settings.creepSpawns.length;i++) {
		// Spawn creep
		var creep = dota.createUnit('npc_dota_neutral_black_dragon', dota.TEAM_DIRE);
		dota.findClearSpaceForUnit(creep, settings.creepSpawns[i].spawnPos);
		
		// Make creep march towards radiant
		var wp = game.findEntityByTargetname(settings.creepSpawns[i].march);
		dota.setUnitWaypoint(creep, wp)
	}
	
	// Stop making custom units
	customUnits = null;
});



/*
Data loading functions
*/

function spawnHero(name) {
	// Grab hero data
	var hd = loadHero(name);
	if(!hd) return;
	
	// Create a custom unit
	customUnits = hd.spawnData;
	
	server.print(JSON.stringify(customUnits))
	
	// Spawn that unit
	var creep = dota.createUnit('npc_dota_neutral_black_dragon', dota.TEAM_RADIANT);
	
	// This creep is a hero
	creep.isHeroCreep = true;
	
	// Store info on skills
	creep.skillInfo = hd.skillInfo;
	
	// No more custom units
	customUnits = null;
	
	// Make it controllable
	creep.netprops.m_iIsControllableByPlayer = (1 << creepControllerID) + 1;
	
	// Return the creep
	return creep;
}

function loadHero(name) {
	// Grab the hero data
	var hd = npc_heroes[name];
	if(!hd) return null;
	
	// This will store all the info needed to control this hero
	var info = {
		skillInfo: {}
	};
	
	// This will store all the data needed to spawn the hero
	var spawnData = {
		// Visual stuff
		Model: hd.Model,
		SoundSet: hd.SoundSet,
		ModelScale: hd.ModelScale,
		
		// Armor
		ArmorPhysical: hd.ArmorPhysical,
		
		// Attack
		AttackCapabilities: hd.AttackCapabilities,
		AttackDamageMin: hd.AttackDamageMin,
		AttackDamageMax: hd.AttackDamageMax,
		AttackRate: hd.AttackRate,
		AttackAnimationPoint: hd.AttackAnimationPoint,
		AttackAcquisitionRange: hd.AttackAcquisitionRange,
		AttackRange: hd.AttackRange,
		ProjectileModel: hd.ProjectileModel,
		ProjectileSpeed: hd.ProjectileSpeed,
		
		// Attributes
		AttributePrimary: hd.AttributePrimary,
		AttributeBaseStrength: hd.AttributeBaseStrength,
		AttributeStrengthGain: hd.AttributeStrengthGain,
		AttributeBaseIntelligence: hd.AttributeBaseIntelligence,
		AttributeIntelligenceGain: hd.AttributeIntelligenceGain,
		AttributeBaseAgility: hd.AttributeBaseAgility,
		AttributeAgilityGain: hd.AttributeAgilityGain,
		
		// Bounds
		BoundsHullName: hd.BoundsHullName,
		HealthBarOffset: hd.HealthBarOffset,
		
		// Movement
		MovementSpeed: hd.MovementSpeed,
		MovementTurnRate: hd.MovementTurnRate,
		
		// Vision
		VisionDaytimeRange: hd.VisionDaytimeRange,
		VisionNighttimeRange: hd.VisionNighttimeRange
		
	};
	
	// Abilities
	for(var i=1; i<=8; i++) {
		// Grab skill
		var skill = hd['Ability'+i] || '';
		
		// Store the skill
		spawnData['Ability'+i] = skill;
		
		// Attempt to load info on it
		if(skill != '' && skill != 'attribute_bonus') {
			// Attempt to load this ability
			var ab = loadAbility(skill);
			
			// Preload shit that is needed
			var dependencies = abilities_dependencies[skill];
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
			}
			
			// Check if it loaded
			if(ab) {
				// Store the info on this skill
				info.skillInfo[i] = ab;
			}
		}
	}
	
	// Store spawn data
	info.spawnData = spawnData;
	
	// Return the info
	return info;
}

function loadAbility(name) {
	// Grab a reference to this ability
	var ab = npc_abilities[name];
	if(!ab) return null;
	
	// Grab the range of this skill
	var range = ab.AbilityCastRange || 0;
	
	// This will store all the info we need to know about this skill
	var info = {
		range: [range, range, range, range]
	};
	
	// Workout how to use this skill
	var b = ab.AbilityBehavior;
	if(b.indexOf('DOTA_ABILITY_BEHAVIOR_UNIT_TARGET') != -1) {
		// It needs to be targeted onto someone
		info.needsTarget = true;
	}
	if(b.indexOf('DOTA_ABILITY_BEHAVIOR_POINT') != -1) {
		// We can cast onto a point
		info.castPoint = true;
	}
	if(b.indexOf('DOTA_ABILITY_BEHAVIOR_AOE') != -1) {
		// This spell has area of effect
		info.aoe = true;
	}
	if(b.indexOf('DOTA_ABILITY_BEHAVIOR_TOGGLE') != -1) {
		// This spell is toggledable
		info.toggle = true;
	}
	
	// Filter special info
	if(ab.AbilitySpecial) {
		// Look at every special key
		for(key1 in ab.AbilitySpecial) {
			// Look at all the keys in this key
			for(key2 in ab.AbilitySpecial[key1]) {
				// Check if it has something to do with range (and not min range)
				if(key2.indexOf('range') != -1 && key2.indexOf('min') == -1) {
					// Split it into multiple sections
					var r = ab.AbilitySpecial[key1][key2].split(' ');
					
					// Make sure it has 4 numbers
					while(r.length < 4) {
						// Push the last element onto it
						r.push(r[r.length-1]);
					}
					
					// Store range
					info.range = r;
				}
				
				// Check if there is any info on a radius
				if(key2.indexOf('radius') != -1) {
					info.radius = ab.AbilitySpecial[key1][key2];
				}
			}
		}
	}
	
	//server.print(JSON.stringify(info))
	
	// Return the info
	return info;
}
