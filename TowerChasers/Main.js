game.hook('Dota_OnUnitParsed', onUnitParsed);

function onUnitParsed(ent, keys) {
	//server.print(ent.getClassname());
	if(ent.getClassname() == 'npc_dota_tower'){
		// Make tower follow you
		keys['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_GROUND';
		keys['MovementSpeed'] = 250;
		
		// Change range
		keys['AttackAcquisitionRange'] = 1300;
		keys['AttackRange'] = 700;
	}
}