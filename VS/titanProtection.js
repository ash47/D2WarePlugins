// Hook functions
game.hook('Dota_OnUnitThink', onUnitThink);

/*
Hook functions
*/
function onUnitThink(unit) {
	// Grab this unit's playerID
	var playerID = unit.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Check if this hero is the titan
	if(vs.isTitan(unit)) {
		// Grab if the titan is stunned
		var stunned = playerInfo.get(unit, 'stunned');
		
		// Check if the titan is hexed
		if(getUnitState(unit, dota.UNIT_STATE_HEXED)) {
			// Check if they aren't currently hexed in our index
			if(!playerInfo.get(unit, 'hexed')) {
				// Store that we have canc
				playerInfo.set(unit, 'hexed', 1);
				
				// Create a timer to remove the hex
				timers.setTimeout(function() {
					// Store that we are no longer hexed
					playerInfo.set(unit, 'hexed', 0);
					
					// Remove hex
					util.removeHex(unit);
				}, settings.titanMaxHexTime * 1000);
			}
		}
		
		// Check if the titan is stunned
		if(getUnitState(unit, dota.UNIT_STATE_STUNNED)) {
			/*var bkb = dota.createAbility(unit, "item_black_king_bar");
			dota.addNewModifier(unit, bkb, "modifier_black_king_bar_immune", "item_black_king_bar", {"duration":10});
			
			var bkb = dota.createAbility(unit, "roshan_spell_block");
			dota.addNewModifier(unit, bkb, "modifier_roshan_spell_block", "roshan_spell_block", {"duration":10});*/
			
			// Check if they aren't currently stunned in our index
			if(!stunned) {
				// Store that we have canc
				playerInfo.set(unit, 'stunned', 1);
				
				// Create a timer to remove the hex
				timers.setTimeout(function() {
					// Store that we are no longer hexed
					playerInfo.set(unit, 'stunned', 0);
					
					// Remove stun
					util.removeStun(unit);
				}, settings.titanMaxStunTime * 1000);
			}
		}
		
		// Enable spawn protection
		spawnProtection(unit, mapManager.direFortPos);
	} else {
		// Enable spawn protection
		spawnProtection(unit, mapManager.radiantFortPos);
		
		// Stop this unit from going over to dire (if enabled)
		noDireSide(unit);
	}
}

function spawnProtection(unit, pos1) {
	// Check if spawn proection is enabled for this gamemode
	if(!settings.spawnProtection[lobby.gamemode]) return;
	
	// Check if the game hasn't started yet
	if(game.rules.props.m_nGameState != dota.STATE_GAME_IN_PROGRESS) {
		// Grab position
		var pos2 = unit.netprops.m_vecOrigin;
		
		if(util.vecDist(pos1, pos2) > settings.baseRadius) {
			// Calculate
			var dir = Math.atan2(pos2.y-pos1.y, pos2.x-pos1.x);
			
			var newpos = {
				x: (pos1.x + Math.cos(dir)*settings.baseRadius),
				y: (pos1.y + Math.sin(dir)*settings.baseRadius),
				z: pos1.z
			}
			
			// Teleport them back
			dota.findClearSpaceForUnit(unit, newpos);
			
			// Check if we've already told the player
			if(!playerInfo.get(unit, 'spawnProtection')) {
				// Grab client
				var client = dota.findClientByPlayerID(unit.netprops.m_iPlayerID);
				if(!client) return;
				
				// Tell the client about spawn protection
				client.printToChat(lang.spawnProtection);
				
				// Store that we've shown them the message
				playerInfo.set(unit, 'spawnProtection', true);
			}
		}
	}
}

// Grab point that we can use to draw a line
var px1 = -415;
var px2 = -2266;
var px3 = 2997;

var py1 = -155;
var py2 = 1898;
var py3 = -2404;

// Calculate rise over run
var ror1 = (py1 - py2) / (px1 - px2);
var roffset1 = py1 - (ror1 * px1);

var ror2 = (py1 - py3) / (px1 - px3);
var roffset2 = py1 - (ror2 * px1);

// Calculate the min x value for 2nd line to work
var rxmin = (-2719 - roffset2) / ror2;

function noDireSide(unit) {
	// Check if no dire side is enabled
	if(!settings.noDireSide[lobby.gamemode]) return;
	
	var playerID = unit.netprops.m_iPlayerID
	if(playerID != 0) return;
	
	// Grab pos
	var pos = unit.netprops.m_vecOrigin;
	
	var newPos = {
		x: pos.x,
		y: pos.y,
		z: pos.z
	}
	
	var changed = false;
	
	// Top rectangle blank
	if(newPos.y > 3000) {
		changed = true;
		newPos.y = 3000;
	}
	
	// Default ymax to current y
	var ymax = newPos.y;
	
	// Check if we are in an area to enforce this line
	if(newPos.y > py1) {
		ymax = ror1 * newPos.x + roffset1;
	} else if(newPos.x < rxmin) {
		ymax = ror2 * newPos.x + roffset2;
	} else {
		ymax = -2719;
	}
	
	if(newPos.y > ymax) {
		changed = true;
		newPos.y = ymax;
	}
	
	// Check if their position needs changing
	if(changed) {
		// Store new pos
		dota.findClearSpaceForUnit(unit, newPos);
		
		// Check if we've already told the player
		if(!playerInfo.get(unit, 'noDireSide')) {
			// Grab client
			var client = dota.findClientByPlayerID(unit.netprops.m_iPlayerID);
			if(!client) return;
			
			// Tell the client about spawn protection
			client.printToChat(lang.noDireSide);
			
			// Store that we've shown them the message
			playerInfo.set(unit, 'noDireSide', true);
		}
	}
}

// Create an array to precompute bit masks
var totalStates = 32;
var states = new Array(totalStates);

for(var i=0;i<totalStates;i++) {
	states[i] = Math.pow(2, i);
}

// NOTE: We are using bitwise AND (&), this is different to logical AND (&&), if you don't know
//       what it is, and how it works, please google :P

function getUnitState(unit, state) {
	// No validate here, make sure to validate unit before calling :P
	
	// Calculate if state is on
	return unit.netprops.m_nUnitState & states[state];
}

function setUnitState(unit, state, value) {
	// Decide which opperator to use
	if(value) {
		// Turn the state bit on
		unit.netprops.m_nUnitState = unit.netprops.m_nUnitState | states[state];
	} else {
		// Turn the state bit off
		unit.netprops.m_nUnitState = unit.netprops.m_nUnitState & (~states[state]);
	}
}
