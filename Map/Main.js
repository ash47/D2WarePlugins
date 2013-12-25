// The unique ID on d2ware for this plugin
var pluginID = 'ChangeMap';

// Allow our the map to change
console.findConVar('sv_hibernate_when_empty').setBool(false);

// A map of game modes that need custom maps
var maps = {
	"Winter Map": 'dota_winter',
	"Autumn Map": 'dota_autumn'
}

// Have we changed the map?
var changedMap = false;

// The Map required for this gamemode
var requiredMap = 'dota_winter';

// Load in the lobby settings
plugin.get('LobbyManager', function(obj){
	// Attempt to grab options, make sure it exists
	var options = obj.getOptionsForPlugin(pluginID);
	if(!options) return;
	
	// Grab the name of the map they want
	var mapID = options['Map'];
	
	// Check if we need a custom map for this game mode
	var newMapID = maps[mapID];
	if(newMapID != null) {
		// Change the name of the map we want to play
		requiredMap = newMapID;
	}
});

// Change the map if required
game.hook('OnGameFrame',function() {
	if(changedMap) return;
	
	// Check if we are on the wrong map
	if(server.getMap() != requiredMap) {
		// Change to the correct map
		server.changeMap(requiredMap, 'This map is required for this gamemode to work.');
		
		// We've changed the map
		changedMap = true;
	}
});
