// Load RTD
var lang = require('language.js');				// Contains all the langauge related stuff
var debug = require('debug.js');				// Debug library
require('playerManager.js');					// Grabs Player Manager
var util = require('util.js');					// 
var playerInfo = require('playerInfo.js');		// Lets us store info onto a player
var goldManager = require('goldManager.js');	// Manages Client's Gold
var rtd = require('rtd.js');					// Setup all the RTD hooks
require('commands.js');							// All the chat commands players can use (besides dev)
require('defaultOutcomes.js');					// Load in the default outcomes
require('lobbySettings.js')						// Load the lobby settings
require('adverts.js');							// Tells the client about -rtd
