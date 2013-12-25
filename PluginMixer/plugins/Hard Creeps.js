// Hooks
game.hook('OnGameFrame', onGameFrame);
game.hook('Dota_OnUnitParsed', onUnitParsed);
game.hook('Dota_OnHeroPicked', onHeroPicked);

var cvEasyMode = console.findConVar("dota_easy_mode");

function onUnitParsed(ent, keyvalues){
	var clsname = ent.getClassname();
	if(clsname == 'npc_dota_creep_lane'){
		keyvalues['StatusHealthRegen'] = 60;
		keyvalues['ModelScale'] = 1.4;
		keyvalues['HealthBarOffset'] = (+keyvalues['HealthBarOffset']) * 1.5;
	}else if(clsname == 'npc_dota_creep_siege'){
		keyvalues['ModelScale'] = 1.3;
		keyvalues['Level'] = 10;
		keyvalues['StatusHealth'] = 2500;
		keyvalues['AttackDamageMin'] = 350;
		keyvalues['AttackDamageMax'] = 460;
		keyvalues['AttackRate'] = 1.35;
	}
}

function onGameFrame(){
	cvEasyMode.setInt(1);
}

function onHeroPicked(client, hero){
	if(hero == 'npc_dota_hero_keeper_of_the_light') return null;
}
