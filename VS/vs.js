/*
'Global' variables / constants
*/
var titanID = -1;					// Stores the playerID of the titan

// Check if developer mode is on
if(settings.dev) {	
	// Load the dev titanID
	titanID = settings.forceTitanID;
}

// Hook functions
game.hook("Dota_OnHeroPicked", onHeroPicked);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);

/*
Hook functions
*/

function onHeroPicked(client, heroname) {
	// Select the titan (if there isn't already one)
	selectTitan();
	
	// Move this client onto the correct team / setup titan
	setupTeam(client);
	
	// Check if this client is the titan
	if(isTitan(client)) {
		// Force client to be the titan class
		if(lobby.titanHero != '') {
			return lobby.titanHero;
		}
	}
}

function onHeroSpawn(hero) {
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	
	// Grab client
	var client = server.clients[playerID];
	if(!client) return;
	
	// Move this client onto the correct team / setup titan
	setupTeam(client);
	
	// Setup everyone's level
	maxLevel(client);
	
	// Give bonus gold
	giveBonusGold(client);
}

/*
Functions
*/

// Works out if the titan is needed in this gamemode
function titanNeeded() {
	// List of gamemodes that don't need a titan
	if(lobby.gamemode == settings.GAMEMODE_WAVES) return false;
	
	// Every other gamemode needs a titan
	return true;
}

// Works out if max level should be applied
function maxLevelNeeded() {
	// List of gamemodes that dont need max level
	if(lobby.gamemode == settings.GAMEMODE_WAVES) return false;
	
	// Every other gamemode needs max level
	return true;
}

// Selects the titan if it's needed
function selectTitan() {
	// Check if we even need a titan
	if(!titanNeeded()) {
		// Ensure titan ID is -1
		titanID = -1;
		
		// No need to run this
		return;
	}
	
	// Check if there is already a titan
	if(titanID == -1) {
		var possibleTitans = new Array();
		
		// Build list of possible zombies
		for(var i=0;i<server.clients.length;i++) {
			// Grab client
			var client = server.clients[i];
			
			// Make sure this client is valid
			if(client != null && client.isInGame() && client.netprops.m_iPlayerID != -1) {
				// Push this clients ID into possible zombies
				possibleTitans.push(i);
			}
		}
		
		// Pick a zombie
		titanID = possibleTitans[Math.floor((Math.random()*possibleTitans.length))];
		
		// Grab the client that corosponds to this zombie
		var titan = server.clients[titanID];
		
		if(titan == null) {
			// Shit is broken!! (mostly here for dev reasons)
			server.print(lang.brokenGamemode);
			return;
		}
	}
}

// Spawns people onto the correct teams
function setupTeam(client) {
	// Validate client
	if(!client) return;
	
	// Check if this client is the titan
	if(isTitan(client)) {
		// Become the titan
		customTeams.setTeam(client, dota.TEAM_DIRE);
		
		// Check if this client has any heroes
		var heroes = client.getHeroes();
		for(var hh in heroes) {
			// Grab hero
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Scale hero
			hero.netprops.m_flModelScale = settings.titanScale;
			
			// Store scaled health
			hero.keyvalues['StatusHealth'] = hero.netprops.m_iMaxHealth * settings.titanHeathScale;
			hero.keyvalues['StatusMana'] = hero.netprops.m_flMaxMana * settings.titanManaScale;
		}
	} else {
		// Spawn them on radiant
		customTeams.setTeam(client, dota.TEAM_RADIANT);
	}
}

function giveBonusGold(client) {
	if(!settings.noBonusGold[lobby.gamemode]) {
		var hasExtraGold = playerInfo.get(client, 'hasExtraGold');
		if(!hasExtraGold) {
			// Store that we have the extra gold
			playerInfo.set(client, 'hasExtraGold', true);
			
			// Give bonus gold here
			goldManager.addGold(client, {
				r: settings.startingGold,	// Store it as reliable gold
				u: 0
			});
		}
	}
}

// Maxes out a client's level, and gives gold (if needed for this gamemode)
function maxLevel(client) {
	// Validate client
	if(!client) return;
	
	// Make sure we need to max out the level
	if(!maxLevelNeeded()) return;
	
	// Check if this client has any heroes
	var heroes = client.getHeroes();
	for(var hh in heroes) {
		// Grab hero
		var hero = heroes[hh];
		if(!hero) continue;
		
		// Check this hero's level
		var heroLevel = hero.netprops.m_iCurrentLevel;
		
		if(heroLevel != 25) {
			// Work out how many skill points are needed
			var difference = 25 - heroLevel;
			
			// Change level
			hero.netprops.m_iCurrentLevel = 25;
			
			// Add extra skill points
			hero.netprops.m_iAbilityPoints += difference;
		}
	}
}

// Checks if client is the titan or not
function isTitan(client) {
	if(!client) return false;
	
	return titanID == client.netprops.m_iPlayerID;
}

// Define exports
exports.isTitan = isTitan;
