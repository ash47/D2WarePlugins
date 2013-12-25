// Create a place to store all player related variables, indexed by their playerID
var playerInfo = new Array(dota.MAX_PLAYERS);

// Create a blank store for each player
for(var i=0;i<dota.MAX_PLAYERS;i++) {
	playerInfo[i] = {};
}

function getPlayerID(unit) {
	// Make sure they passes a playerID
	if((typeof unit) == 'object') {
		// Check if this is a unit, and if it has a player id
		if(unit != null && unit.netprops != null && unit.netprops.m_iPlayerID != null) {
			// Change playerID to actually be playerID
			return unit.netprops.m_iPlayerID;
		} else {
			// This is no player!
			return -1;
		}
	}
	
	// If non-number, return -1
	if((typeof unit) != 'number') {
		return -1;
	}
	
	// Must be a number, just return it
	return unit;
}

// Used for setting a variable
exports.set = function(unit, varName, value) {
	// Grab a playerID
	var playerID = getPlayerID(unit);
	
	// Validate playerID
	if(playerID < 0 || playerID >= dota.MAX_PLAYERS) {
		return false;
	}
	
	// Store player info
	playerInfo[playerID][varName] = value;
}

// Used for getting a variable
exports.get = function(unit, varName, def) {
	// Grab a playerID
	var playerID = getPlayerID(unit);
	
	// Validate playerID
	if(playerID < 0 || playerID >= dota.MAX_PLAYERS) {
		return def;
	}
	
	// Check if we have that info
	if(playerInfo[playerID][varName] == null) {
		// Return the default value
		return def;
	} else {
		// Return the info
		return playerInfo[playerID][varName]
	}
}