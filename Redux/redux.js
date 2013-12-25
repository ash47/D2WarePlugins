// Hook functions
game.hook('OnMapStart', onMapStart);
game.hook("OnGameFrame", onGameFrame);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hook("Dota_OnHeroPicked", onHeroPicked);

// 'Global' variables
var pickedZombies = false;		// Has the infected people been picked?

/*
Hook functions
*/

function onMapStart() {
	// Stop undying from being picked
	dota.setHeroAvailable(85 , false);
	
	// Precache particles + models needed for the zombies
	dota.loadParticleFile('particles/units/heroes/hero_sniper.pcf');
	dota.loadParticleFile('particles/units/heroes/hero_undying.pcf');
	
	game.precacheModel('models/heroes/undying/undying_flesh_golem.mdl');
	game.precacheModel('models/heroes/undying/undying_minion.mdl');
	game.precacheModel('models/heroes/undying/undying_minion_torso.mdl');
	game.precacheModel('models/heroes/undying/undying_tower.mdl');
	game.precacheModel('models/heroes/furion/treant.mdl');
	
	// Create couriers
	var courier = dota.createUnit('npc_dota_courier', dota.TEAM_RADIANT);
	dota.findClearSpaceForUnit(courier, -7271, -6713, 270);
	
	var courier = dota.createUnit('npc_dota_courier', dota.TEAM_DIRE);
	dota.findClearSpaceForUnit(courier, 7031, 6427, 263);
}

var aaaa = 0;
var zzzz = 0;

function onGameFrame() {
	for(var i=0; i<server.clients.length; i++) {
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		/*if(client.netprops.m_iSpectatorClickBehavior != 0) {
			server.print('printing click behavior')
			server.print(client.netprops.m_iSpectatorClickBehavior)
			server.print('done!')
		}
		
		server.print(client.netprops.m_cellX)
		server.print(client.netprops.m_cellY)
		server.print(client.netprops.m_cellZ)
		server.print(client.netprops.m_iSpectatorClickBehavior)
		server.print(client.netprops.m_iCursor[0])
		server.print(client.netprops.m_iCursor[1])
		server.print(client.netprops.m_hKillCamUnit)
		server.print(client.netprops.m_hSpectatorQueryUnit)
		server.print(client.netprops.m_hObserverTarget)
		server.print(client.netprops.m_hViewEntity)
		server.print(client.netprops.m_hConstraintEntity)*/
	}
	
	// Do we need to pick the infected people?
	if(!pickedZombies && game.rules.props.m_nGameState == dota.STATE_HERO_SELECTION) {
		// Done picking infected
		pickedZombies = true;
		
		// Short delay so messages can be seen
		timers.setTimeout(function() {
			// Build a list of possible zombies
			var possibleZombies = [];
			
			for(var i=0; i<server.clients.length; i++) {
				// Grab client
				var client = server.clients[i];
				if(!client || !client.isInGame()) continue;
				
				// Grab playerID
				var playerID = client.netprops.m_iPlayerID;
				if(playerID == -1) continue;
				
				server.print('Added '+playerID)
				
				// This client is a possible zombie
				possibleZombies.push(playerID);
			}
			
			// How many zombies are left to be spawned
			var zombiesRemaining = settings.startingZombies;
			
			while(zombiesRemaining > 0 && possibleZombies.length > 0) {
				// Pick a possible zombie
				var num = util.randomFromInterval(0, possibleZombies.length-1);
				
				// Grab zombieID
				var zombieID = possibleZombies[num];
				
				// Remove this ID from the list
				possibleZombies.splice(num, 1);
				
				// Store that this player is a zombie
				playerInfo.set(zombieID, 'isZombie', true);
				
				// Grab client
				var client = dota.findClientByPlayerID(zombieID);
				if(!client || !client.isInGame()) continue;
				
				// Tell this player they will spawn as a zombie
				client.print(lang.selectedAsZombie);
			}
		}, 100);
	}
}

function onHeroPicked(client, heroName){
	// No one is allowed to pick undying
	if(heroName == 'npc_dota_hero_undying') {
		return null;
	}
	
	// Check if this player is a zombie
	if(playerInfo.get(client, 'isZombie', false)) {
		// Set them onto dire
		customTeams.setTeam(client, dota.TEAM_DIRE);
	} else {
		// Set them onto radiant
		customTeams.setTeam(client, dota.TEAM_RADIANT);
	}
}

function onHeroSpawn(hero) {
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client || !client.isInGame()) return;
	
	// Change teams
	timers.setTimeout(function() {
		// Check if this player is a zombie
		if(playerInfo.get(playerID, 'isZombie', false)) {
			// Set them onto dire
			customTeams.setTeam(client, dota.TEAM_DIRE);
		} else {
			// Set them onto radiant
			customTeams.setTeam(client, dota.TEAM_RADIANT);
		}
	}, 1)
	
	// Check if they've seen the spawn instructions
	if(!playerInfo.get(playerID, 'spawnInstructions', false)) {
		// They have now seen the spawn instructions
		playerInfo.set(playerID, 'spawnInstructions', true);
		
		// Print istructions based on team
		if(playerInfo.get(playerID, 'isZombie', false)) {
			// Zombie instructions
			client.print(lang.instructionsZombie);
		} else {
			// Human instructions
			client.print(lang.instructionsHuman);
		}
		
		// Print common instructions
		client.print(lang.instructionsCommon)
	}
	
	
}
