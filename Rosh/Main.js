var offsetSpawnRosh = game.getPropOffset("CBaseEntity", "m_iTeamNum") + 476;

console.addClientCommand('r', function() {
	var spawner = game.findEntityByClassname(-1, 'npc_dota_roshan_spawner');
	spawner.setData(offsetSpawnRosh, 4, 1232348160);
});