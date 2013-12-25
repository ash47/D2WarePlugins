var rtd = require('rtd.js');
var goldManager = require('goldManager.js');
var util = require('util.js');

// Free gold
rtd.add({
	name: 'Free gold',
	des: 'Win between 50 and 500 gold.',
	type: {
		good: 1,
		gold: 1
	},
	callback: function(playerID) {
		// Grab random amount of gold
		var gold = util.randomFromInterval(50, 500);
		
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Add gold
		goldManager.addGold(client, {
			// No reliable gold
			r: 0,
			
			// Add the unreliable gold
			u: gold
		});
		
		// Return prize
		return '{0} has won '+gold+'g';
	}
});

// Lose gold
rtd.add({
	name: 'Lose gold',
	des: 'Lose between 10 and 200 gold.',
	type: {
		bad: 1,
		gold: 1
	},
	callback: function(playerID) {
		// Grab random amount of gold
		var gold = util.randomFromInterval(10, 200);
		
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Add gold
		goldManager.addGold(client, {
			// No reliable gold
			r: 0,
			
			// Add the unreliable gold
			u: -gold
		});
		
		// Return prize
		return '{0} has lost '+gold+'g';
	}
});

// Win full heal
rtd.add({
	name: 'Full Heal',
	des: 'Fully restore your health.',
	type: {
		good: 1,
		general: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Give it full HP
			hero.netprops.m_iHealth = hero.netprops.m_iMaxHealth;
		}
		
		// Return prize
		return 'All of {0}\'s heroes have been fully healed!';
	}
});

// Win full mana
rtd.add({
	name: 'Full Mana',
	des: 'Fully restore your mana.',
	type: {
		good: 1,
		general: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Give it full HP
			hero.netprops.m_flMana = hero.netprops.m_flMaxMana;
		}
		
		// Return prize
		return 'All of {0}\'s heroes now have full Mana!';
	}
});

// Lose all but X hp
rtd.add({
	name: 'Lose Health',
	des: 'Lose all but one HP',
	type: {
		terrible: 1,
		genereal: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		var newHP = util.randomFromInterval(1, hero.netprops.m_iMaxHealth);
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Change it's hp
			hero.netprops.m_iHealth = newHP;
		}
		
		// Return prize
		return 'All of {0}\'s heroes now only have '+newHP+'hp!';
	}
});

// Lose all but X mana
rtd.add({
	name: 'Lose Mana',
	des: 'Lose all of your Mana',
	type: {
		terrible: 1,
		general: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		var newMana = util.randomFromInterval(0, hero.netprops.m_flMaxMana);
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Give it full HP
			hero.netprops.m_flMana = newMana;
		}
		
		// Return prize
		return 'All of {0}\'s heroes now only have '+newMana+' mana!';
	}
});

// Win stats
rtd.add({
	name: 'Extra Stats',
	des: 'Gives you +1 to all three stats.',
	type: {
		good: 1,
		stats: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Add stats
			hero.netprops.m_flStrength += 1;
			hero.netprops.m_flAgility += 1;
			hero.netprops.m_flIntellect += 1;
		}
		
		// Return prize
		return '{0} has won extra stat points!';
	}
});

var modifiers = [];

function addModifier(options) {
	modifiers.push(options);
}

// Firefly
addModifier({
	name: 'Firefly',
	des: '{2} has won level {1} Firefly for 60 seconds.',
	base: 'batrider_firefly',
	modifier: 'modifier_batrider_firefly',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Speed Boost
addModifier({
	name: 'Speed Boost',
	des: '{2} has won a level {1} speed boost for 60 seconds.',
	base: 'dark_seer_surge',
	modifier: 'modifier_dark_seer_surge',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// ionshell
addModifier({
	name: 'Ionshell',
	des: '{2} has won a level {1} Ionshell for 60 seconds.',
	base: 'dark_seer_ion_shell',
	modifier: 'modifier_dark_seer_ion_shell',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// brawler
addModifier({
	name: 'Brawler',
	des: '{2} has won a level {1} Brawler for 60 seconds.',
	base: 'brewmaster_drunken_brawler',
	modifier: 'modifier_brewmaster_drunken_brawler',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Empower
addModifier({
	name: 'Brawler',
	des: '{2} has won a level {1} Empower for 60 seconds.',
	base: 'magnataur_empower',
	modifier: 'modifier_magnataur_empower',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Unholy Strength
addModifier({
	name: 'Unholy Strength',
	des: '{2} has won a Unholy Strength for 60 seconds.',
	base: 'item_armlet',
	modifier: 'modifier_item_armlet_unholy_strength',
	maxLevel: 1,
	options: {
		duration: 60
	}
});

// Enrage
addModifier({
	name: 'Enrage',
	des: '{2} has won a level {1} Enrage for 60 seconds.',
	base: 'ursa_enrage',
	modifier: 'modifier_ursa_enrage',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Backtrack
addModifier({
	name: 'Backtrack',
	des: '{2} has won a level {1} Backtrack for 60 seconds.',
	base: 'faceless_void_backtrack',
	modifier: 'modifier_faceless_void_backtrack',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Vitality
addModifier({
	name: 'Vitality',
	des: '{2} has won a level {1} Vitality for 60 seconds.',
	base: 'huskar_inner_vitality',
	modifier: 'modifier_huskar_inner_vitality',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Manashield
addModifier({
	name: 'Vitality',
	des: '{2} has won a level {1} Mana Shield for 60 seconds.',
	base: 'medusa_mana_shield',
	modifier: 'modifier_medusa_mana_shield',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Bloodlust
addModifier({
	name: 'Bloodlust',
	des: '{2} has won a level {1} Bloodlust for 60 seconds.',
	base: 'ogre_magi_bloodlust',
	modifier: 'modifier_ogre_magi_bloodlust',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Spell Shield
addModifier({
	name: 'Spell Shield',
	des: '{2} has won a level {1} Spell Shield for 60 seconds.',
	base: 'antimage_spell_shield',
	modifier: 'modifier_antimage_spell_shield',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Sprite
addModifier({
	name: 'Sprite',
	des: '{2} has won a level {1} Sprite for 60 seconds.',
	base: 'enchantress_natures_attendants',
	modifier: 'modifier_enchantress_natures_attendants',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Invis
addModifier({
	name: 'Invis',
	des: '{2} has won a level {1} Invis for 60 seconds.',
	base: 'riki_permanent_invisibility',
	modifier: 'modifier_riki_permanent_invisibility',
	maxLevel: 3,
	options: {
		duration: 60
	}
});

// Warcry
addModifier({
	name: 'Warcry',
	des: '{2} has won a level {1} Warcry for 60 seconds.',
	base: 'sven_warcry',
	modifier: 'modifier_sven_warcry',
	maxLevel: 4,
	options: {
		duration: 60
	}
});

// Modifiers
rtd.add({
	name: 'Modifiers',
	des: 'Applies random modifiers',
	type: {
		good: 1,
		modifier: 1
	},
	callback: function(playerID) {
		// Attempt to grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client || !client.isValid()) return '{0} got nothing';
		
		// Pick a random modifier
		var mod = util.randomFromArray(modifiers);
		
		// Preload stuff
		util.preloadSkill(mod.base);
		
		var level = util.randomFromInterval(1, mod.maxLevel);
		
		// Loop over all heroes owned by this player
		var heroes = client.getHeroes();
		for(var hh=0; hh<heroes.length; hh++) {
			var hero = heroes[hh];
			if(!hero) continue;
			
			// Create speed ability
			var ab = dota.createAbility(hero, mod.base);
			ab.netprops.m_iLevel = level;
			
			// Apply speed modifier
			dota.addNewModifier(hero, ab, mod.modifier, mod.base, mod.options);
		}
		
		// Return prize
		return util.format(mod.des, ['', level, '{0}']);
	}
});
