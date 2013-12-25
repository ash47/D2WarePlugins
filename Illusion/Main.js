var timers = require('timers');

game.hook("Dota_OnHeroSpawn", function(hero) {
	timers.setTimeout(function() {
		if(dota.hasModifier(hero, 'modifier_illusion')) {
			server.print('FOUND AN ILLUSION!');
			//dota.removeModifier(hero, 'modifier_illusion');
		} else {
			dota.addNewModifier(hero, hero, 'modifier_invulnerable', 'modifier_invulnerable', {}, hero);
			//dota.addNewModifier(hero, hero, 'modifier_illusion', 'modifier_illusion', {}, hero);
			//dota.removeModifier(hero, 'modifier_illusion');
		}
	}, 1);
});
