var lang = require('language.js');
var rtd = require('rtd.js');
var util = require('util.js');
var settings = require('settings.js').s;
var playerInfo = require('playerInfo.js');

// Setup commands
console.addClientCommand('rtdhelp', CmdRTD);
console.addClientCommand('rtd', CmdR);
console.addClientCommand('autoroll', CmdAutoRoll);

// Main RTD Help command
function CmdRTD(client, args) {
	if(!client) return;
	
	// Print a list of all RTD outcomes
	rtd.printOutcomes(client);
	
	// Print help to chat
	client.printToChat(util.format(lang.rtdHelp, [settings.rtdDelay]));
	client.printToChat(lang.rtdHelp2);
}

// Rolls the Dice
function CmdR(client, args) {
	if(!client) return;
	
	// Grab all heroes of this client
	var heroes = client.getHeroes();
	
	// Make sure they have atleast one hero
	if(heroes.length <= 0) {
		client.printToChat(lang.rtdMustHaveHero);
		return;
	}
	
	// Make sure all their heroes are alive
	for(var hh = 0; hh<heroes.length; hh++) {
		// Grab a hero
		var hero = heroes[hh];
		if(!hero || !hero.isValid() || !hero.isHero() || !hero.netprops) continue;
		
		// Check life state
		if(hero.netprops.m_lifeState != 0) {
			// It's dead, tell client
			client.printToChat(lang.rtdMustBeAlive);
			return;
		}
	}
	
	// Roll the dice
	rtd.roll(client.netprops.m_iPlayerID);
}

function CmdAutoRoll(client, args) {
	// Validate client
	if(!client || !client.isValid() || !client.isInGame()) return;
	
	// Check the current state of autoRoll
	var on = playerInfo.get(client, 'autoRoll') || false;
	
	// Invert the state
	playerInfo.set(client, 'autoRoll', !on);
	
	// Tell the client what happened
	if(on) {
		// Turned it off
		client.printToChat(lang.rtdAutoOff);
	} else {
		// Turned it on
		client.printToChat(lang.rtdAutoOn);
		
		// Grab the current gameTime
		var gameTime = util.gameTime();
		
		// Grab when they can next roll
		var nextRollTime = playerInfo.get(client, 'nextRollTime') || 0;
		
		// Check if they can roll right now
		if(gameTime > nextRollTime) {
			// Roll
			rtd.roll(client.netprops.m_iPlayerID);
		}
	}
}