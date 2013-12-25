// Hooks
game.hook("OnGameFrame", onGameFrame);

// The frame count is so it doesn't run every frame
// which would cost way too much cpu power for a simple
// plugin like this

var frameCount = 0;
function onGameFrame(){
	if(frameCount == 0){
		game.findEntitiesByClassname('npc_dota_creep_lane').forEach(function(ent){
			if(ent.netprops.m_iHealth == ent.netprops.m_iMaxHealth) return;
			
			
			ent.netprops.m_iTeamNum = 4;
		});
	}
	
	++frameCount;
	frameCount %= 10;
}