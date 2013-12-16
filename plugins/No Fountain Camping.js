// Hooks
game.hook('OnMapStart', onMapStart);

function onMapStart() {
	// Find all fountains
	var fountains = game.findEntitiesByClassname('ent_dota_fountain');
	
	for(i=0; i<fountains.length; i++) {
		var fountain = fountains[i];
		
		// Give this fountain a MKB
		var truestrike = dota.createAbility(fountain, "item_monkey_king_bar");
		dota.addNewModifier(fountain, truestrike, "modifier_item_monkey_king_bar", "item_monkey_king_bar", {}, fountain);
		
		// Give this fountain ursa's fury swipes
		var swipes = dota.createAbility(fountain, 'ursa_fury_swipes');
		swipes.netprops.m_iLevel = 4;
		dota.addNewModifier(fountain, swipes, "modifier_ursa_fury_swipes", "ursa_fury_swipes", {}, fountain);
		
		// Give this fountain SB's knock back
		var bash = dota.createAbility(fountain, 'spirit_breaker_greater_bash');
		bash.netprops.m_iLevel = 4;
		dota.addNewModifier(fountain, bash, "modifier_spirit_breaker_greater_bash", "spirit_breaker_greater_bash", {}, fountain);
	}
	
	// Preload ursa's particles
	dota.loadParticleFile('particles/units/heroes/hero_ursa.pcf');
	server.print('done')
}
