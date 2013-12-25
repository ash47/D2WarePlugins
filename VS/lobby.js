// Hook functions
game.hook("OnMapStart", onMapStart);

// Grab convars (from no creeps)
var cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning");

// A map of heros mostly from Mid Only by M28
var heroMap = keyvalue.parseKVFile('heroMap.kv');

// Read in which hero was selected etc
var titanHero = 'npc_dota_hero_pudge';

// Read in which gamemode we are playing
var gamemode = settings.GAMEMODE_WAVES;

/*
Hook functions
*/

// Block selected hero from being selected
function onMapStart() {
	// Grab d2ware name
	var d2wareName = titanHero.replace('npc_dota_', '').toUpperCase();
	
	// Grab heroid
	var heroID = dota[d2wareName];
	
	// Check if it was a valid hero, if so, block it
	if(heroID && heroID > 0) {
		dota.setHeroAvailable(heroID, false);
	}
	
	// Block necolyte
	dota.setHeroAvailable(36, false);
}

// Stop creeps from spawning
function OnGameFrame(){
	cvCreepsNoSpawning.setInt(1);
}

/*plugin.get('LobbyManager', function(obj){
	lobbyManager = obj;
	optionHero = lobbyManager.getOptionsForPlugin('MidOnly')['Hero'] || 'Any Hero';
});*/

// Store exports
exports.titanHero = titanHero;
exports.gamemode = gamemode;

// Stop creeps spawning, depending on the gamemode
if(settings.stopCreepsSpawning[gamemode]) {
	game.hook("OnGameFrame", OnGameFrame);
}
