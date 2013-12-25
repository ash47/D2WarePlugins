// Stores if we have changed the map or not yet
var changedMap = false;

// The map we need to be on for this to work
var theMap = 'dota_diretide_12';

// Set the gamemode
setCorrectGamemode();

// Allow our the map to change
console.findConVar('sv_hibernate_when_empty').setBool(false);

game.hook('OnGameFrame',function() {
	if(changedMap) return;
	
	// Check if we are on the wrong map
	if(server.getMap() != theMap) {
		// Change to the correct map
		server.changeMap(theMap, 'This map is required for this gamemode to work.');
		
		// Change to the correct gamemode
		setCorrectGamemode();
		
		// We've changed the map
		changedMap = true;
	}
});

function setCorrectGamemode() {
	console.findConVar("dota_force_gamemode").setInt(7);
}