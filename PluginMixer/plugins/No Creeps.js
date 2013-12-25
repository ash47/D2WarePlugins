// Hooks
game.hook('OnGameFrame', onGameFrame);

var cvCreepsNoSpawning = console.findConVar("dota_creeps_no_spawning");

function onGameFrame(){
	cvCreepsNoSpawning.setInt(1);
}