// Global that will eventually store the player manager ent
var playerManager;
var data_dire = null;
var data_radiant = null;

// Load libraries THE ORDER IS VERY IMPORTANT

var timers = require('timers');					// Timing library
var settings = require('settings.js');			// Load the settings
var lang = require('language.js');				// Load the language stuff
var customUnits = require('customUnits.js');	// Lets you build custom units
var lobby = require('lobby.js');				// Loads settings from the lobby
var mapManager = require('mapManager.js');		// Makes changes to the map
require('playerManager.js');					// Allows us to access the player manager
var util = require('util.js');					// A bunch of useful commands
var playerInfo = require('playerInfo.js');		// Stores info on players
var customTeams = require('customTeams.js');	// Allows custom team sizes
var goldManager = require('goldManager.js');	// Manages client's gold
require('dev.js');								// Developer library, wont load if settings.dev = false
require('redux.js');							// The actual gamemode
