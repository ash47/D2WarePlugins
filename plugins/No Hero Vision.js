// Hooks
game.hook("Dota_OnUnitThink", onUnitThink);

function onUnitThink(unit){
	if(unit.isHero()){
		dota.setUnitState(unit, dota.UNIT_STATE_NO_VISION, true);
	}
}