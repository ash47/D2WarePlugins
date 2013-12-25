// Hook functions
game.hook('OnMapStart', onMapStart);

function onMapStart() {
	// Grab the player manager
	playerManager = game.findEntityByClassname(-1, "dota_player_manager");
	
	if(playerManager == null) {
		server.print(lang.noPlayerManager);
	}
}
