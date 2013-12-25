// Hook functions
game.hook('OnMapStart', onMapStart);

function onMapStart() {
	// Grab the player manager
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	data_dire = game.findEntityByClassname(-1, "dota_data_dire");
	data_radiant = game.findEntityByClassname(-1, "dota_data_radiant");
	
	if(playerManager == null) {
		server.print(lang.noPlayerManager);
	}
}
