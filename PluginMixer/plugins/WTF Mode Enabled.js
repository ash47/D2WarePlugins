// Hooks
game.hook("Dota_OnHeroPicked", onHeroPicked);
game.hook("OnGameFrame", onGameFrame);

var cvAbilityDebug = console.findConVar("dota_ability_debug");

function onGameFrame(){
	cvAbilityDebug.setInt(1);
}

function onHeroPicked(client, hero){
	switch(hero){
		case "npc_dota_hero_zuus":
		case "npc_dota_hero_gyrocopter":
		case "npc_dota_hero_silencer":
		case "npc_dota_hero_invoker":
		case "npc_dota_hero_spectre":
		case "npc_dota_hero_furion":
			return null;
	}
}