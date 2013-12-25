// Add chat adverts
game.hook("Dota_OnHeroSpawn", onHeroSpawn);

var lang = require('language.js');
var util = require('util.js');
var playerInfo = require('playerInfo.js');

function onHeroSpawn(hero) {
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	
	// Grab the current gameTime
	var gameTime = util.gameTime();
	
	// Grab the last time this message was printed
	var lastTime = playerInfo.get(playerID, 'lastAdPrint');
	
	// Put a 30 second delay on printing this ad
	if(gameTime < lastTime + 30) return;
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client) return;
	
	// Print ad
	client.printToChat(lang.rtdAd);
	
	// Store the current time
	playerInfo.set(playerID, 'lastAdPrint', gameTime);
}
