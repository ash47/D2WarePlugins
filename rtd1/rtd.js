var timers = require('timers');
var lang = require('language.js');
var util = require('util.js');
var debug = require('debug.js');
var playerInfo = require('playerInfo.js');
var settings = require('settings.js').s;

/*
NOTE:	Most of the functions in here are as defensive as possible,
		since they will be exposed for anyone to play with
*/

// This will contain all the possible dice roll outcomes
var outcomes = [];

// This will contain all the banned types
var banned = {};

/*
Adds an roll outcome

name - The name of your outcome: 'Bonus Gold'
des - A description of what it does: 'Give you between 50 and 1000g'
type - An object containing the type of award this can give: {
	good: 1,		// Anything that can be considered good
	bad: 1,			// Anything that can be considered bad
	terrible: 1,	// Anything terrible (insta death?)
	gold: 1,		// Anything gold related (get / lose gold?)
	stats: 1		// Anything that plays with stats (extra strength, lose strength, etc)
}
	All plugins not loaded directly from this plugin (unoffical ones) will be tagged 'unoffical'

callback - A function that runs the effect, and returns a string of what it did, eg: '{0} has won 500g'
			This will then print: 'xxx has won 500g'
			{0} will be replaced by the player's name
			
			Callback takes playerID as an argument, this is all!
NOTE:	You can have a function that does good and bad things, however, it may never be called if the user
			decides they don't want bad outcomes, you are better off creating one bad, and one good outcome.

NOTE:	Don't add your outcome twice, the same outcome can be added twice, and it will appear twice!

FOR EXAMPLES:	See defaultOutcomes.js
*/
function addOutcome(args) {
	try {
		// Validate args
		if(!args || !typeof(args) == 'object') {
			debug.print(lang.invalidArgs);
			return false;
		}
		
		// Grab args
		var name = args.name;
		var des = args.des;
		var type = args.type
		var callback = args.callback;
		
		// Validate outcome
		if(!name || typeof(name) != 'string') {
			debug.print(lang.invalidName);
			return false;
		}
		
		if(!des || typeof(des) != 'string') {
			debug.print(lang.invalidDes);
			return false;
		}
		
		if(!type || typeof(type) != 'object') {
			debug.print(lang.invalidType);
			return false;
		}
		
		if(!callback || typeof(callback) != 'function') {
			debug.print(lang.invalidcallback);
			return false;
		}
		
		// Push the outcome
		outcomes.push({
			name: name,
			des: des,
			type: type,
			callback: callback
		});
		
		// Success!
		return true;
	} catch(e) {
		// Something stuffed up
		debug.print(lang.addOutcomeError, [e]);
	}
	
	// It didn't work
	return false;
}

/*
Removes the FIRST outcome found with this name
*/
function removeOutcomeByName(name) {
	try {
		// Validate name
		if(!name || typeof(name) != 'string') {
			debug.print(lang.invalidRemoveName);
			return false;
		}
		
		// Look at each outcome
		for(var i=0;i<outcomes.length;i++) {
			// Grab, and validate an outcome
			var o = outcomes[i];
			if(!o) continue;
			
			// Check if this was the one we were looking for
			if(o.name == name) {
				// Remove this outcome
				outcomes.splice(i, 1);
				
				// Return success
				return true;
			}
		}
	} catch(e) {
		// Something stuffed up
		debug.print(lang.removeOutcomeError, [e]);
	}
	
	// Nothing was found under this name
	return false;
}

// Bans an outcome type
function banOutcome(sort) {
	try {
		// Validate input
		if(!sort || typeof(sort) != 'string') {
			debug.print(lang.banFailed);
			return false;
		}
		
		// Ban it
		banned[sort] = true;
		
		// Success
		return true;
	} catch(e) {
		// Something stuffed up
		debug.print(lang.banError, [e]);
	}
	
	return false;
}

/*
Rolls the dice for a given client
*/
function rtd(playerID) {
	try {
		// Validate the playerID
		if(!typeof(playerID) == 'number') {
			return false;
		}
		
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return;
		
		// Grab the current gameTime
		var gameTime = util.gameTime();
		
		// Grab when they can next roll
		var nextRollTime = playerInfo.get(playerID, 'nextRollTime') || 0;
		
		// Check if it's time for our next roll
		if(gameTime < nextRollTime) {
			// Tell the client they can't use it at this stage
			client.printToChat(util.format(lang.rtdCooldown, [Math.ceil(nextRollTime-gameTime)]));
			
			// Failure
			return false;
		}
		
		// Build an array of possible outcomes
		var possible = [];
		
		outcomeBuilder:
		for(var i=0;i<outcomes.length;i++) {
			// Grab an outcome
			var o = outcomes[i];
			if(!o) continue;
			
			// Check all banned types
			for(var key in banned) {
				// Check if this is a banned type
				if(o.type[key]) {
					// Skip this outcome
					continue outcomeBuilder;
				}
			}
			
			// This outcome isn't banned, add it
			possible.push(o);
		}
		
		// Check if there are any possible outcomes
		if(possible.length <= 0) {
			// Tell the client
			client.printToChat(lang.rtdNoOutcomes);
			
			// Failure
			return false;
		}
		
		// Pick a random outcome
		var o = util.randomFromArray(possible);
		
		// Validate
		if(!o || !o.callback) {
			// Tell the client (i guess we can assume no outcomes)
			client.printToChat(lang.rtdNoOutcomes);
			
			// Failure
			return false;
		}
		
		// Run it
		var prize = o.callback(playerID);
		
		// Tell everyone
		util.printToAll(lang.rtdPrefix+util.format(prize, [client.getName()]));
		
		// Play a sound
		dota.sendAudio(client, false, lang.sound_rtdRoll);
		
		// Stop them from rolling again instantly
		playerInfo.set(playerID, 'nextRollTime', gameTime + settings.rtdDelay);
		
		// Set a timer to tell them they can roll again
		timers.setTimeout(function() {
			// Make sure client is still valid
			if(!client || !client.isValid() || !client.isInGame()) return;
			
			// Check if they want auto roll
			if(playerInfo.get(playerID, 'autoRoll')) {
				// roll for them
				rtd(playerID);
			} else {
				// Tell client
				client.printToChat(lang.rtdReady);
				
				// Make a noise
				dota.sendAudio(client, false, lang.sound_rtdReady);
			}
		}, settings.rtdDelay * 1000 + 100);
	} catch(e) {
		// Something stuffed up
		debug.print(lang.rtdError, [e]);
	}
	
	// Failure
	return false;
}

function printOutcomes(client) {
	// Validate client
	if(!client || !client.isValid()) return;
	
	var num = 1;
	
	outcomeBuilder:
	for(var i=0;i<outcomes.length;i++) {
		// Grab an outcome
		var o = outcomes[i];
		if(!o) continue;
		
		// Check all banned types
		for(var key in banned) {
			// Check if this is a banned type
			if(o.type[key]) {
				// Skip this outcome
				continue outcomeBuilder;
			}
		}
		
		// Grab printable n
		var n = num;
		if(n < 10) n = '0'+n;
		
		// Move num forward
		num += 1;
		
		// This outcome isn't banned, print
		client.printToChat(util.format(lang.chatOutcomeList, [n, o.name, o.des]));
	}
	
	// Check if there were no outcomes
	if(num == 1) {
		// Tell the client :(
		client.printToChat(lang.rdmNoOutcomes);
	}
}

// Setup exports
exports.roll = rtd;
exports.ban = banOutcome;
exports.add = addOutcome;
exports.remove = removeOutcomeByName;
exports.printOutcomes = printOutcomes;

// Expose functions
plugin.expose({
	// Allows you to roll the dice for a given player
	roll: rtd,
	
	// Allows you to ban dice rollage for a  given player
	ban: banOutcome,
	
	// Allows you to add a custom outcome
	add: function(args) {
		try {
			// Validate args
			if(!args || !typeof(args) == 'object') {
				debug.print(lang.invalidArgs);
				return false;
			}
			
			// Check if it has a type field
			if(args.type && typeof(args.type) == 'object') {
				// Mark this as an unoffical plugin
				args.type['unoffical'] = 1;
			}
			
			// Add it
			return addOutcome(args);
		} catch(e) {
			debug.print(e);
		}
	},
	
	// Allows you to remove outcomes
	remove: removeOutcomeByName
});
