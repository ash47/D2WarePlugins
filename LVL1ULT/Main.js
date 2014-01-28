var timers = require('timers');

game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hookEvent("dota_player_gained_level", onPlayerGainedLevel);

var basefile = keyvalue.parseKVFile('omg_base.kv');

// Max amount of times to level the ult
var maxLevel = 1;
var giveScepter = 0;
var waitForUlts = false;

// Stores everyone who has gotten their scepter
var gottenScepter = {};

plugin.get('LobbyManager', function(obj){
	// Grab options
	var options = obj.getOptionsForPlugin("LVL1ULT");
	if(!options) return;

	// Grab level option
	var level = options['Level'];
	switch(level) {
		case 'Level 1':
			maxLevel = 1;
		break;

		case 'Level 2':
			maxLevel = 2;
		break;

		case 'Level 3':
			maxLevel = 3;
		break;
	}

	// Grab scepter option
	var scepter = options['Scepter'];
	switch(scepter) {
		case 'No Free Scepter':
			giveScepter = 0;
		break;

		case 'Level 4 Free Scepter':
			giveScepter = 4;
		break;

		case 'Level 3 Free Scepter':
			giveScepter = 3;
		break;

		case 'Level 2 Free Scepter':
			giveScepter = 2;
		break;

		case 'Level 1 Free Scepter':
			giveScepter = 1;
		break;
	}

	// Grab wait option
	var wait = options['Force Ult Points'];
	switch(wait) {
		case 'Force Ult Points':
			waitForUlts = false;
		break;

		case 'Wait 15 Seconds For Ults':
			waitForUlts = true;
		break;
	}
});

// Build list of ults
var ults = [];

for(var i in basefile.Heroes){
	var h = basefile.Heroes[i];

	if(h.Ult) ults.push(h.Ult);
	if(h.VolatileUlt) ults.push(h.VolatileUlt);
}

function onHeroSpawn(hero) {
	// Some ults wont work if we apply instantly, so apply next frame
	timers.setTimeout(function() {
		levelSkills(hero);
	}, 1);
}

function onPlayerGainedLevel(event) {
	// Grab all heroes
	var heroes = game.findEntitiesByClassname('npc_dota_hero_*');

	// Loop over heroes
	for(var hh=0; hh<heroes.length; hh++) {
		// Try to level this hero's skills
		levelSkills(heroes[hh]);
	}
}

function waitToSkill(hero, ab) {
	// Wait before skilling ult
	timers.setTimeout(function() {
		// Validate hero
		if(!hero || !hero.isValid() || !hero.isHero() || !ab || !ab.isValid()) return;

		// Make sure we still have the skill point
		if(hero.netprops.m_iAbilityPoints <= 0) return;

		// Upgrade ult
		dota.upgradeAbility(ab);

		// Remove skillpoint
		hero.netprops.m_iAbilityPoints -= 1;
	}, 15 * 1000);
}

function levelSkills(hero) {
	// Validate hero
	if(!hero || !hero.isValid() || !hero.isHero()) return;

	// No illusions
	if(dota.hasModifier(hero, 'modifier_illusion')) return;

	for(var i=0; i<16; i++) {
		var ab = hero.netprops.m_hAbilities[i];
		if(!ab || !ab.isValid()) continue;

		// Make sure they have skill points to spend
		if(hero.netprops.m_iAbilityPoints <= 0) break;

		// Check if this ability is an ult
		if(ults.indexOf(ab.getClassname()) != -1) {
			if(ab.netprops.m_iLevel < maxLevel) {
				// Should we wait before skilling the ults?
				if(waitForUlts) {
					waitToSkill(hero, ab);
				} else {
					// Upgrade ult
					dota.upgradeAbility(ab);

					// Remove skillpoint
					hero.netprops.m_iAbilityPoints -= 1;
				}
			}
		}
	}

	// Check if we should give free scepters
	if(giveScepter) {
		if(hero.netprops.m_iCurrentLevel >= giveScepter) {
			// Make sure they have a scepter modifier
			if(!hero.scepter) {
				hero.scepter = dota.createAbility(hero, 'item_ultimate_scepter');
			}

			// Remove all old scepters
			while(dota.hasModifier(hero, 'modifier_item_ultimate_scepter')) {
				dota.removeModifier(hero, 'modifier_item_ultimate_scepter');
			}

			// Apply it
			dota.addNewModifier(hero, hero.scepter, 'modifier_item_ultimate_scepter', 'item_ultimate_scepter', {}, hero);
		}
	}
}