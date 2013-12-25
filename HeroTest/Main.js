console.addClientCommand('h', function(client, args) {
	// Disable all heroes except the chosen one
	for(var i=0;i<128;i++) {
		// Grab the name of this hero
		var heroName = dota.heroIdToClassname(i);
		
		if(heroName == (args[0] || 'npc_dota_hero_drow_ranger')) {
			dota.setHeroAvailable(i, true);
		} else {
			dota.setHeroAvailable(i, false);
		}
	}
	
	dota.changeToRandomHero(client);
});

function onHeroPicked(client, heroName) {
	server.print(heroName);
}

