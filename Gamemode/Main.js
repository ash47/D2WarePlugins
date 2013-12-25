// The unique ID on d2ware for this plugin
var pluginID = 'Gamemode';

// Allow our the map to change
console.findConVar('sv_hibernate_when_empty').setBool(false);

// Roshan settings
var roshanTimerA = 10 * 60;
var roshanTimerB = 10 * 60;
var roshanScaler = 1;

// A map of game mode names --> game mode IDs
var gamemodeIDs = {
	"All Pick": 1,
	"Captain's Mode": 2,
	"Random Draft": 3,
	"Single Draft": 4,
	"All Random": 5,
	"Heroes for Beginners": 6,
	"Diretide": 7,
	"Reverse Captain's Mode": 8,
	"The Greeviling": 9,
    "Tutorial": 10,
	"Mid Only": 11,
	"Least Played": 12,
    "New Player Pool": 13,
    "Compendium": 14,
    "Custom": 15,
	"Captins Draft": 16,
	"Auto Draft": 17
}

// A map of game modes that need custom maps
var maps = {
	"The Greeviling": 'dota_winter',
	"Diretide": 'dota_diretide_12'
}

// Have we changed the map?
var changedMap = false;

// The ID of the gamemode we want to play
var gamemodeID = 1;

// The Map required for this gamemode
var requiredMap = 'dota';

// Sets the correct game mode
function setCorrectGamemode() {
	// Roshan timers
	if(gamemodeID == 7) {
		console.findConVar("dota_roshan_halloween_spawn_time").setInt(roshanTimerA);
		console.findConVar("dota_roshan_halloween_phase2_start_time").setInt(roshanTimerA + roshanTimerB);
	}

	// Change the game mode to the one specified
	console.findConVar("dota_force_gamemode").setInt(gamemodeID);
}

function friendlyTimeToSeconds(input) {
	// Split into two parts
    var parts = input.split(':');

	// Grab minutes and seconds
    var minutes = parseInt(parts[0]);
    var seconds = parseInt(parts[1]);

	// Return seconds
    return (minutes * 60 + seconds);
}

// Load in the lobby settings
plugin.get('LobbyManager', function(obj){
	// Attempt to grab options, make sure it exists
	var options = obj.getOptionsForPlugin(pluginID);
	if(!options) return;

	// Roshan Spawn Timers
	var roshA = options['Diretide Part 1 Timer'];
	if(roshA) {
		roshanTimerA = friendlyTimeToSeconds(roshA.replace('Diretide ', '').replace(' Part 1', ''));
	}

	var roshB = options['Diretide Part 2 Timer'];
	if(roshB) {
		roshanTimerB = friendlyTimeToSeconds(roshB.replace('Diretide ', '').replace(' Part 2', ''));
	}

	switch(options['Diretide Roshan Scaler']) {
		case 'Diretide Roshan 1.5x HP (Hard)':
			roshanScaler = 1.5;
		break;

		case 'Diretide Roshan 0.5x HP (Much Easier)':
			roshanScaler = 0.5;
		break;

		case 'Diretide Roshan 0.1x HP (Very Easy)':
			roshanScaler = 0.1;
		break;

		case 'Diretide Roshan 0.01x HP (Instant Kill)':
			roshanScaler = 0.01;
		break;

		default:
			roshanScaler = 1;
		break;
	}

	// Grab the name of the game mode they want to play
	var gameModeName = options['Game Mode'];

	// Check if we need to change the game mode ID
	var newID = gamemodeIDs[gameModeName];
	if(newID != null) {
		// Change the gamemode ID
		gamemodeID = newID;

		// Set the correct gamemode
		setCorrectGamemode();
	}

	// Check if we need a custom map for this game mode
	var newMapID = maps[gameModeName];
	if(newMapID != null) {
		// Change the name of the map we want to play
		requiredMap = newMapID;
	}
});

game.hook('OnMapStart', function() {
	// Precache mega greevil
	game.precacheModel('models/creeps/mega_greevil/mega_greevil.mdl', true);
});

// Change the map if required
game.hook('OnGameFrame',function() {
	if(changedMap) return;

	// Check if we are on the wrong map
	if(server.getMap() != requiredMap && requiredMap != 'dota') {
		// Change to the correct map
		server.changeMap(requiredMap, 'This map is required for this gamemode to work.');

		// Change to the correct gamemode
		setCorrectGamemode();

		// We've changed the map
		changedMap = true;
	}
});

game.hook('Dota_OnUnitParsed', function(unit, keyvalues) {
	// Roshan hp scaler
	if(gamemodeID == 7) {
		if(unit && unit.isValid() && unit.getClassname() == 'npc_dota_roshan_halloween') {
			keyvalues['StatusHealth'] = keyvalues['StatusHealth'] * roshanScaler;
			keyvalues['StatusHealthRegen'] = keyvalues['StatusHealthRegen'] * roshanScaler;
		}
	}
});

