var customUnit = null;

// Hook functions
game.hook('Dota_OnUnitParsed', onUnitParsed);

/*
Hook functions
*/

function onUnitParsed(unit, keyvalues) {
	// Check if there is a custom unit
	if(customUnit) {
		// Copy in custom keys
		if(customUnit) {
			for(var k in customUnit) {
				keyvalues[k] = customUnit[k];
			}
		}
	}
	
	// Make roshan into a zombie
	if(unit.getClassname() == 'npc_dota_roshan') {
		keyvalues['model'] = 'models/heroes/undying/undying_flesh_golem.mdl';
	}
	
	// Check if it is one of our units
	if(	unit.getClassname() == 'npc_dota_creep_lane' ||
		unit.getClassname() == 'npc_dota_creep' ||
		unit.getClassname() == 'npc_dota_creep_siege') {
			// Check if it is a dire creep
			if(keyvalues['TeamName'] == 'DOTA_TEAM_BADGUYS' || unit.netprops.m_iTeamNum == dota.TEAM_DIRE) {
				// Change model to random zombie
				if(Math.random() < 0.5) {
					keyvalues['model'] = 'models/heroes/undying/undying_minion_torso.mdl';
				} else {
					keyvalues['model'] = 'models/heroes/undying/undying_minion.mdl';
				}
				
				keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_MELEE_ATTACK';
				keyvalues['AttackRange'] = 128;
			}
	}
	
	// Check if it's a hero
	if(unit.isHero()) {
		// Make all heroes ranged, and change their range
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_RANGED_ATTACK';
		keyvalues['ProjectileModel'] = 'sniper_base_attack';
		keyvalues['AttackRange'] = '500';
		keyvalues['ProjectileSpeed'] = '3000';
	}
}

/*
Exports
*/

// Sets a custom unit up
exports.setup = function(args) {
	// Store the custom unit stuff
	customUnit = args;
}

// Resets custom units
exports.reset = function() {
	customUnit = null;
}
