// Hook functions
game.hook('OnMapStart', onMapStart);

var lang = require('language.js');

var vars = {
	playerManager: null,
	data_dire: null,
	data_radiant: null
}

function onMapStart() {
	// Grab the player manager
	vars.playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	vars.data_dire = game.findEntityByClassname(-1, "dota_data_dire");
	vars.data_radiant = game.findEntityByClassname(-1, "dota_data_radiant");
	
	if(vars.playerManager == null) {
		server.print(lang.noPlayerManager);
	}
}

exports.s = vars;
