/*
This module uses a gold object:

gold.r = Reliable Gold
gold.u = Unrealiable Gold
*/

// Adds gold to a client
function addGold(client, gold) {
	if((!client) || (!gold)) return false;
	
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if (playerID == -1) {
		return false;
	}
	
	// Give the gold
	dota.givePlayerGold(playerID, gold.r, true);
	dota.givePlayerGold(playerID, gold.u, false);
	
	// It worked
	return true;
}

// Sets the client's gold
function setGold(client, gold) {
	if((!client) || (!gold)) return false;
	
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if (playerID == -1) {
		return false;
	}
	
	// Grab current gold
	var currentGold = getGold(client);
	if(!currentGold) return false;
	
	// Give the difference in current gold
	dota.givePlayerGold(playerID, gold.r - currentGold.r, true);
	dota.givePlayerGold(playerID, gold.u - currentGold.u, false);
	
	// It worked
	return true;
}

function getGold(client) {
	if(!client) return null;
	
	// Grab playerID
	var playerID = client.netprops.m_iPlayerID;
	if (playerID == -1) {
		return null;
	}
	
	// Grab this user's current team
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
		r:reliableGold,
		u:unreliableGold
	}
}

// Setup exports
exports.addGold = addGold;
exports.setGold = setGold;
exports.getGold = getGold;
