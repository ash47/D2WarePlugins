console.addClientCommand('t', function(client, args) {
	var hero = client.netprops.m_hAssignedHero;
	
	//var truce = dota.createAbility(hero, 'halloween_truce');
	//dota.addNewModifier(hero, hero, 'modifier_halloween_truce', "halloween_truce", {}, hero);
	
	var ab = dota.createAbility(hero, 'techies_land_mines');
	
	dota.upgradeAbility(ab);
	
	dota.addNewModifier(hero, ab, 'modifier_techies_land_mine', "techies_land_mines", {}, hero);
});
