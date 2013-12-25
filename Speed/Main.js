game.hook('OnMapStart', function() {
	dota.loadParticleFile('particles/units/heroes/hero_bloodseeker.pcf');
});

game.hook("Dota_OnHeroSpawn", function(hero) {
	dota.addNewModifier(hero, hero, 'modifier_bloodseeker_thirst_speed', "bloodseeker_thirst", {"bonus_movement_speed":100, "bloodthirst": 1}, hero);
});
