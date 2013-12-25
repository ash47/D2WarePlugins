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
	
	// Grab this user's current team
	var team = playerManager.netprops.m_iPlayerTeams[playerID];
	
	// Check which team this player was ORIGINALLY on
	if(team == dota.TEAM_RADIANT) {
		playerManager.netprops.m_iReliableGoldRadiant[playerID] += gold.r;
		playerManager.netprops.m_iUnreliableGoldRadiant[playerID] += gold.u;
	} else if(team == dota.TEAM_DIRE) {
		playerManager.netprops.m_iReliableGoldDire[playerID] += gold.r;
		playerManager.netprops.m_iUnreliableGoldDire[playerID] += gold.u;
	} else {
		return false;
	}
	
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
	
	// Grab this user's current team
	var team = playerManager.netprops.m_iPlayerTeams[playerID];
	
	// Check which team this player was ORIGINALLY on
	if(team == dota.TEAM_RADIANT) {
		playerManager.netprops.m_iReliableGoldRadiant[playerID] = gold.r;
		playerManager.netprops.m_iUnreliableGoldRadiant[playerID] = gold.u;
	} else if(team == dota.TEAM_DIRE) {
		playerManager.netprops.m_iReliableGoldDire[playerID] = gold.r;
		playerManager.netprops.m_iUnreliableGoldDire[playerID] = gold.u;
	} else {
		return false;
	}
	
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
		reliableGold = playerManager.netprops.m_iReliableGoldRadiant[playerID];
		unreliableGold = playerManager.netprops.m_iUnreliableGoldRadiant[playerID];
	} else if(team == dota.TEAM_DIRE) {
		reliableGold = playerManager.netprops.m_iReliableGoldDire[playerID];
		unreliableGold = playerManager.netprops.m_iUnreliableGoldDire[playerID];
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
