// Hook functions
game.hook("OnMapStart", onMapStart);

/*
Hook Functions
*/

function onMapStart() {
	// Remove all fountains
	removeAllSort('ent_dota_fountain');
	
	timers.setTimeout(function() {
		// Grab forts
		var dp = game.findEntityByTargetname('dota_badguys_fort').netprops.m_vecOrigin;
		var rp = game.findEntityByTargetname('dota_goodguys_fort').netprops.m_vecOrigin;
		
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
		
		// Check for gamemode specific rules
		if(lobby.gamemode == settings.GAMEMODE_LMS) {
			// Remove all buildings
			removeAllSort('npc_dota_tower');
			removeAllSort('npc_dota_building');
			removeAllSort('npc_dota_fort');
			removeAllSort('npc_dota_barracks');
		} else if(lobby.gamemode == settings.GAMEMODE_ASSULT) {
			// Remove all buildings on dire
			removeAllTeam('npc_dota_tower', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_building', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_fort', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_barracks', dota.TEAM_DIRE);
		} else if(lobby.gamemode == settings.GAMEMODE_WAVES) {
			// Remove all buildings on dire
			removeAllTeam('npc_dota_tower', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_building', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_fort', dota.TEAM_DIRE);
			removeAllTeam('npc_dota_barracks', dota.TEAM_DIRE);
		}
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
