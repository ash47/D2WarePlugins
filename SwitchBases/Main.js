var timers = require('timers')

var middle = {
	x: -415,
	y: -155,
	z: 256
}

game.hook('OnMapStart', function() {
	// Cleanup the map
	dota.removeAll("ent_dota_fountain*");
	dota.removeAll("ent_dota_halloffame*");
});

game.hook("Dota_OnHeroSpawn", function(hero) {
	timers.setTimeout(function() {
		if(!hero || !hero.isValid()) return;
		
		// Make sure they can actually move
		dota.findClearSpaceForUnit(hero, hero.netprops.m_vecOrigin);
	}, 1);
});

var zero = {
	x:0,
	y:0,
	z:0
}

// Reveal everyone
game.hook("Dota_OnUnitThink", function(unit){
	var name = unit.getClassname();
	
	// Reveal buildings of we need to
	if(	name.indexOf('building' != -1) ||
		name.indexOf('tower') != -1 ||
		name.indexOf('fountain') != -1) {
			dota.setUnitState(unit, dota.UNIT_STATE_REVEALED, true);
	}
});

function moveShit() {
	var ents = game.findEntitiesByClassname('*');
	
	for(var i=0;i<ents.length;i++) {
		// Grab an ent
		var ent = ents[i];
		
		var name = ent.getClassname();
		
		// Make sure it's something valid
		if(name.indexOf('trigger') != -1) continue;
		if(name.indexOf('backdoor') != -1) continue;
		if(name.indexOf('tree') != -1) continue;
		if(name.indexOf('shop') != -1) continue;
		if(name.indexOf('rosh') != -1) continue;
		if(ent.netprops == null) continue;
		
		// Stop stuckness
		if(	name.indexOf('neutral') != -1 ||
			name.indexOf('hero') != -1 ||
			name.indexOf('creep') != -1) {
				//dota.findClearSpaceForUnit(ent, ent.netprops.m_vecOrigin);
				continue;
		}
		
		// Grab it's position
		var pos = ent.netprops.m_vecOrigin;
		if(pos == null) continue;
		
		// Grab stuff needed to rotate it
		var dist = vecDist(pos, middle);
		var ang = Math.atan2(pos.y-middle.y, pos.x-middle.x);
		
		// Rotate half a circle
		ang += Math.PI/6000;
		
		// Update position
		pos.x = middle.x + Math.cos(ang) * dist;
		pos.y = middle.y + Math.sin(ang) * dist;
		
		// Store where to TP tp
		var tpTo = {
			x: pos.x+1,
			y: pos.y,
			z: pos.z
		}
		
		ent.teleport(tpTo);
	}
}

function vecDist(vec1, vec2) {
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

console.addClientCommand('move', moveShit);

// Destroy all the trees
timers.setInterval(function(){
	dota.destroyTreesAroundPoint(0, 0, 0, 50000, false);
}, 100);

timers.setInterval(function() {
	var gameState = game.rules.props.m_nGameState;
	
	// Check if the game has started
	if(gameState == dota.STATE_GAME_IN_PROGRESS) {
		moveShit();
	}
}, 100);
