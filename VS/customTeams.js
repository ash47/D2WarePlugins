/* Custom Team Size Module by Ash47

Methods:
setTeam(client)
	Puts a client onto a different team
	Returns true on success, false otherwise
	
*/

// Hook functions
game.hook("OnClientDisconnect", onClientDisconnect);
game.hook("OnClientPutInServer", onClientPutInServer);

// Hook events
game.hookEvent("entity_hurt", onEntityHurt);

/*
Hook functions
*/

function onClientPutInServer(client) {
	// Grab current team
	var currentTeam = playerInfo.get(client, 'currentTeam')
	
	// Check if it exists
	if(currentTeam) {
		// Teleport them back in after a second
		timers.setTimeout(function() {
			// Put them to their current team
			setTeam(client, currentTeam);
		}, 1000);
	}
}

function onClientDisconnect(client) {
	var playerID = client.netprops.m_iPlayerID;
	if(playerID == -1) return;
	
	// Grab original team
	var oTeam = playerInfo.get(client, 'originalTeam');
	
	// Store their current team
	playerInfo.set(client, 'currentTeam', client.netprops.m_iTeamNum);
	
	// Reset their team back to normal
	setTeam(client, oTeam);
}

/*
Functions
*/

// Set a client's team
var setTeam = function(client, team) {
	// Validate client
	if(!client || !client.isValid()) return false;
	
	// Validate team choice
	if(team != dota.TEAM_DIRE && team != dota.TEAM_RADIANT) return false;
	
	// Grab the user's playerID
	var playerID = client.netprops.m_iPlayerID;
	
	// Store original team
	if(!playerInfo.get(client, 'originalTeam')) {
		playerInfo.set(client, 'originalTeam', playerManager.netprops.m_iPlayerTeams[playerID]);
	}
	
	// Change the user's team
	client.netprops.m_iTeamNum = team;
	
	// Change all heroes of this player
	var heroes = client.getHeroes();
	for(var hh in heroes) {
		var hero = heroes[hh];
		if(!hero) continue;
		
		hero.netprops.m_iTeamNum = team;
	}
	
	return true
}

// Returns the clients current team
function getTeam(client) {
	// Validate client
	if(!client) return -1;
	
	// Return this user's current team
	return client.netprops.m_iTeamNum;
}

// Swaps a client's team
function swapTeam(client) {
	// Validate client
	if(!client) return false;
	
	// Get current team
	var team = getTeam(client);
	
	// Check which team they are on
	if(team == dota.TEAM_RADIANT) {
		// Set team to dire
		setTeam(client, dota.TEAM_DIRE);
		
		return true;
	} else if(team == dota.TEAM_DIRE) {
		// Set team to radiant
		setTeam(client, dota.TEAM_RADIANT);
		
		return true;
	} else {
		// What team are they on?!?
		return false;
	}
}

function onEntityHurt(event) {
	// Grab the entity that was attacked
	var ent = game.getEntityByIndex(event.getInt('entindex_killed'));
	
	// Grab the ent's HP
	var entHP = ent.netprops.m_iHealth;
	
	if(entHP <= 0) {
		// Loop over all clients
		for(var i=0;i<server.clients.length;i++) {
			// Grab client
			var client = server.clients[i]
			if(!client || !client.isInGame()) continue;
			
			var playerID = client.netprops.m_iPlayerID;
			if(playerID == -1) continue;
			
			// Grab our original team
			var originalTeam = playerInfo.get(client, 'originalTeam');
			
			// Make sure they have an original team
			if(originalTeam) {
				// Grab their team
				var team = client.netprops.m_iTeamNum;
				
				// Only need to do this if they aren't on their original team AND a change isn't currently in progress!
				if(team != originalTeam && originalTeam == playerManager.netprops.m_iPlayerTeams[playerID]) {
					// Put them onto the 'correct' team for a moment
					playerManager.netprops.m_iPlayerTeams[playerID] = team;
					
					if(team == dota.TEAM_DIRE) {
						// Copy their gold into their other team's slot
						playerManager.netprops.m_iReliableGoldDire[playerID] = playerManager.netprops.m_iReliableGoldRadiant[playerID];
						playerManager.netprops.m_iUnreliableGoldDire[playerID] = playerManager.netprops.m_iUnreliableGoldRadiant[playerID];
						
						// Reset this player's team
						resetTeamRadiant(playerID);
					} else if(team == dota.TEAM_RADIANT) {
						// Copy their gold into their other team's slot
						playerManager.netprops.m_iReliableGoldRadiant[playerID] = playerManager.netprops.m_iReliableGoldDire[playerID];
						playerManager.netprops.m_iUnreliableGoldRadiant[playerID] = playerManager.netprops.m_iUnreliableGoldDire[playerID];
						
						// Reset the player's team
						resetTeamDire(playerID)
					}
				}
			}
		}
	}
}

/*
Functions
*/

function resetTeamRadiant(playerID) {
	// Reset them to their original team after 1 second
	timers.setTimeout(function() {
		// Reset their team
		playerManager.netprops.m_iPlayerTeams[playerID] = originalTeam[playerID];
		
		// Reset their gold
		playerManager.netprops.m_iReliableGoldRadiant[playerID] = playerManager.netprops.m_iReliableGoldDire[playerID];
		playerManager.netprops.m_iUnreliableGoldRadiant[playerID] = playerManager.netprops.m_iUnreliableGoldDire[playerID];
	}, 1);
}

function resetTeamDire(playerID) {
	// Reset them to their original team after 1 second
	timers.setTimeout(function() {
		// Reset their team
		playerManager.netprops.m_iPlayerTeams[playerID] = originalTeam[playerID];
		
		// Reset their gold
		playerManager.netprops.m_iReliableGoldDire[playerID] = playerManager.netprops.m_iReliableGoldRadiant[playerID];
		playerManager.netprops.m_iUnreliableGoldDire[playerID] = playerManager.netprops.m_iUnreliableGoldRadiant[playerID];
	}, 1);
}

// Define exports
exports.setTeam = setTeam;
exports.getTeam = getTeam;
exports.swapTeam = swapTeam;
