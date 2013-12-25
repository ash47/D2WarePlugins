// Hook functions
game.hook("OnMapStart", onMapStart);

/*
Hook Functions
*/

function onMapStart() {
	// Remove all fountains
	removeAllSort('ent_dota_fountain');
	
	timers.setTimeout(function() {
		// Remove all buildings on dire
		removeAllTeam('npc_dota_tower', dota.TEAM_DIRE);
		removeAllTeam('npc_dota_building', dota.TEAM_DIRE);
		removeAllTeam('npc_dota_barracks', dota.TEAM_DIRE);
		
		// Grab forts
		var df = game.findEntityByTargetname('dota_badguys_fort');
		var rf = game.findEntityByTargetname('dota_goodguys_fort')
		
		// Don't bother if we didn't find the forts
		if(!df || !rf) return;
		
		var dp = df.netprops.m_vecOrigin;
		var rp = rf.netprops.m_vecOrigin;
		
		// Store sort locations
		exports.direFortPos = {
			x: dp.x,
			y: dp.y,
			z: dp.z
		};
		
		exports.radiantFortPos = {
			x: rp.x,
			y: rp.y,
			z: rp.z
		};
		
		// Give the forts the upgrades
		var a = dota.createAbility(df, 'abaddon_borrowed_time');
		a.netprops.m_iLevel = 3;
		
		dota.setAbilityByIndex(df, a, 0);
		
		df.netprops.m_iIsControllableByPlayer = 1;
		
		game.hookEnt(a, dota.ENT_HOOK_ON_SPELL_START, function(ab) {
			server.print(ab)
			
			//server.print(dota.getAbilityCaster(ab))
			//server.print(dota.getAbilityCaster(ab).getClassname())
			
			return false;
		})
		
		
	}, 1)
}

/*
Functions
*/
function removeAllSort(sort) {
	// Find all ents of type sort
	var found = game.findEntitiesByClassname(sort);
	
	// Cycle them all
	for(var i=0;i<found.length;i++) {
		// Remove it
		dota.remove(found[i]);
	}
}

function removeAllTeam(sort, team) {
	// Find all ents of sort
	var found = game.findEntitiesByClassname(sort);
	
	// Cycle them all
	for(var i=0;i<found.length;i++) {
		// Check if it's the same team
		if(found[i].netprops.m_iTeamNum == team) {
			// Remove it
			dota.remove(found[i]);
		}
	}
}
