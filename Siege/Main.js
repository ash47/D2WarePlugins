var pluginID = 'Siege';

game.hookEvent('last_hit', onLastHit);
game.hook('OnMapStart', onMapStart);

var playerManager = null;

// Settings
var bonusStats = 1;
var removeStats = 0;
var bonusGold = 0;
var heroMultiplyer = 1;
var towerMultiplyer = 10;

plugin.get('LobbyManager', function(obj){
	// Grab options
	var options = obj.getOptionsForPlugin(pluginID);
	if(!options) return;
	
	// Bonus Stats
	var m = options['Bonus Stats'];
	if(m) {
		switch(m) {
			case '+1 Team Stats on Last Hit':
				bonusStats = 1;
			break;
			
			case '+2 Team Stats on Last Hit':
				bonusStats = 2;
			break;
			
			case '+5 Team Stats on Last Hit':
				bonusStats = 5;
			break;
			
			case '+10 Team Stats on Last Hit':
				bonusStats = 10;
			break;
			
			case 'No Bonus Team Stats':
				bonusStats = 0;
			break;
		}
	}
	
	// Negative Enemy Stats
	m = options['Remove Stats'];
	if(m) {
		switch(m) {
			case 'No Negative Enemy Stats':
				removeStats = 0;
			break;
			
			case '-1 Enemy Stats on Last Hit':
				removeStats = 1;
			break;
			
			case '-2 Enemy Stats on Last Hit':
				removeStats = 2;
			break;
			
			case '-5 Enemy Stats on Last Hit':
				removeStats = 5;
			break;
			
			case '-10 Enemy Stats on Last Hit':
				removeStats = 10;
			break;
		}
	}
	
	// Bonus Gold
	m = options['Bonus Gold'];
	if(m) {
		switch(m) {
			case 'No Bonus Team Gold':
				removeStats = 0;
			break;
			
			case '+1 Team Gold on Last Hit':
				bonusGold = 1;
			break;
			
			case '+5 Team Gold on Last Hit':
				bonusGold = 5;
			break;
			
			case '+10 Team Gold on Last Hit':
				bonusGold = 10;
			break;
			
			case '+15 Team Gold on Last Hit':
				bonusGold = 15;
			break;
			
			case '+25 Team Gold on Last Hit':
				bonusGold = 10;
			break;
			
			case '+50 Team Gold on Last Hit':
				bonusGold = 50;
			break;
		}
	}
	
	// Tower Multiplier
	m = options['Tower Multiplier'];
	if(m) {
		switch(m) {
			case '10X Tower Multiplier':
				towerMultiplyer = 10;
			break;
			
			case '5X Tower Multiplier':
				towerMultiplyer = 5;
			break;
			
			case '1X Tower Multiplier':
				towerMultiplyer = 1;
			break;
		}
	}
	
	// Hero Multiplier
	m = options['Hero Multiplier'];
	if(m) {
		switch(m) {
			case '1X Hero Multiplier':
				heroMultiplyer = 1;
			break;
			
			case '2X Hero Multiplier':
				heroMultiplyer = 2;
			break;
			
			case '5X Hero Multiplier':
				heroMultiplyer = 5;
			break;
			
			case '10X Hero Multiplier':
				heroMultiplyer = 10;
			break;
		}
	}
});

function onMapStart() {
	playerManager = game.findEntityByClassname(-1, 'dota_player_manager');
	
	if(!playerManager) {
		server.print('\n\nWARNING: Failed to find PLAYER MAANGER!');
	}
}

function onLastHit(event) {
	// Grab playerID, validate
	var playerID = event.getInt("PlayerID");
	if(playerID < 0 || playerID > 10) return;
	
	// Grab the entity killed
	var entKilled = game.getEntityByIndex(event.getInt('EntKilled'));
	
	// The multiplier to multiply shit by
	var mul = 1;
	
	// Check if it was a hero killed, apply hero multiplier
	if(entKilled != null && entKilled.isValid() && entKilled.isHero()) {
		mul *= heroMultiplyer;
	}
	
	// Check if it was a tower killed, apply tower multiplier
	if(event.getBool('TowerKill')) {
		mul *= towerMultiplyer;
	}
	
	// Grab [the person who last hit]'s teamID
	var playerTeam = playerManager.netprops.m_iPlayerTeams[playerID];
	
	// Store people who have gotten gold
	var gottenGold = {};
	
	// Grab all heroes
	var heroes = game.findEntitiesByClassname('npc_dota_hero_*');
	
	// Loop over heroes
	for(var hh=0; hh<heroes.length; hh++) {
		// Grab a hero
		var hero = heroes[hh];
		
		// Validate hero
		if(!hero || !hero.isValid() || !hero.isHero()) continue;
		
		// No illusions
		if(dota.hasModifier(hero, 'modifier_illusion')) continue;
		
		// Check if they are on our team
		if (hero.netprops.m_iTeamNum == playerTeam) {
			// Award Bonuses
			hero.netprops.m_flStrength += bonusStats * mul;
			hero.netprops.m_flAgility += bonusStats * mul;
			hero.netprops.m_flIntellect += bonusStats * mul;
			
			// Grab playerID
			var pid = hero.netprops.m_iPlayerID;
			if(pid < 0 || pid > 10) continue;
			
			// Check if this hero needs gold
			if(bonusGold > 0 && !gottenGold[pid]) {
				// Give gold
				dota.givePlayerGold(pid, bonusGold * mul, false);
				
				// This player has gotten gold
				gottenGold[pid] = true;
			}
		} else {
			// Award negatives
			
			// Grab original stats
			var s = hero.netprops.m_flStrength - removeStats * mul;
			var a = hero.netprops.m_flAgility - removeStats * mul;
			var i = hero.netprops.m_flIntellect - removeStats * mul;
			
			// Make sure they don't go below 0
			if(s < 0) s = 0;
			if(a < 0) a = 0;
			if(i < 0) i = 0;
			
			// Set new stats
			hero.netprops.m_flStrength = s;
			hero.netprops.m_flAgility = a;
			hero.netprops.m_flIntellect = i;
		}
	}
}