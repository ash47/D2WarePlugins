//var timers = require('timers');

/*game.hook("Dota_OnHeroSpawn", onHeroSpawn);
game.hook('Dota_OnUnitThink', onUnitThink);*/
game.hook("Dota_OnUnitParsed", onUnitParsed);
game.hook("Dota_OnHeroSpawn", onHeroSpawn);

/*var roshArray = {};

function onHeroSpawn(hero) {
	timers.setTimeout(function() {
		// Grab playerID
		var playerID = hero.netprops.m_iPlayerID;
		
		// Only one roshan for you
		if(roshArray[playerID]) return;
		
		// Grab client
		var client = dota.findClientByPlayerID(playerID);
		if(!client) return;
		
		var rosh = dota.createUnit('npc_dota_roshan', client.netprops.m_iTeamNum);
		dota.findClearSpaceForUnit(rosh, hero.netprops.m_vecOrigin);
		
		// Make roshan controllable by that player
		rosh.netprops.m_iIsControllableByPlayer = (1 << playerID);
		
		// Store the rosh
		roshArray[playerID] = rosh;
		
		// Make the player's hero not controllable anymore
		//hero.netprops.m_iIsControllableByPlayer = 0;
		hero.netprops.m_flStrength = 999.0;
		if (hero.netprops.m_iTeamNum == dota.TEAM_DIRE) {
			hero.teleport(-50000.0, 50000.0, 0.0);
		} else {
			hero.teleport(50000.0, -50000.0, 0.0);
		}
	}, 1000);
}

function onUnitThink(unit) {
	// Grab this unit's playerID
	var playerID = unit.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client) return;
	
	//server.print(client.netprops.m_hViewEntity);
	
	// Make sure the player always can select it's roshan
	if(client.netprops.m_hViewEntity == null) {
		client.netprops.m_hViewEntity = roshArray[playerID];
	}
	
	//server.print(client.netprops.m_hViewEntity);
}*/

function onHeroSpawn(hero) {
	// Stop this hero from getting skills twice
	if(hero.hasSkills) return;
	
	// Remove all old skills
	for(var i=0;i<16;i++) {
		var ab = hero.netprops.m_hAbilities[i];
		
		if(ab != null) {
			dota.remove(ab);
			hero.netprops.m_hAbilities[i] = null;
		}
		
	}
	
	// Add rosh skills
	hero.roshan_spell_block = dota.createAbility(hero, 'roshan_spell_block');
	dota.setAbilityByIndex(hero, hero.roshan_spell_block, 0);
	
	hero.roshan_bash = dota.createAbility(hero, 'roshan_bash');
	dota.setAbilityByIndex(hero, hero.roshan_bash, 1);
	
	hero.roshan_slam = dota.createAbility(hero, 'roshan_slam');
	dota.setAbilityByIndex(hero, hero.roshan_slam, 2);
	
	hero.roshan_inherent_buffs = dota.createAbility(hero, 'roshan_inherent_buffs');
	dota.setAbilityByIndex(hero, hero.roshan_inherent_buffs, 3);
	
	// Add atribute skill
	hero.attribute_bonus = dota.createAbility(hero, 'attribute_bonus');
	dota.setAbilityByIndex(hero, hero.attribute_bonus, 4);
}

function onUnitParsed(unit, keyvalues){
	
	if(keyvalues['BaseClass'] == 'npc_dota_hero') {
		
		//keyvalues['BaseClass'] = 'npc_dota_roshan';
		keyvalues['Model'] = 'models/creeps/roshan/roshan.mdl';
		keyvalues['SoundSet'] = 'Roshan';
		//keyvalues['ModelScale'] = '1';
		
		// Abilities
		/*keyvalues['Ability1'] = 'roshan_spell_block';
		keyvalues['Ability2'] = 'roshan_bash';
		keyvalues['Ability3'] = 'roshan_slam';
		keyvalues['Ability4'] = 'roshan_inherent_buffs';
		keyvalues['Ability5'] = 'roshan_devotion';*/
		
		// Armor
		keyvalues['ArmorPhysical'] = '3';
		keyvalues['MagicalResistance'] = '75';
		
		// Attack
		keyvalues['AttackCapabilities'] = 'DOTA_UNIT_CAP_MELEE_ATTACK';
		keyvalues['AttackDamageMin'] = '65';
		keyvalues['AttackDamageMax'] = '65';
		keyvalues['AttackDamageType'] = 'DAMAGE_TYPE_ArmorPhysical';
		keyvalues['AttackRate'] = '1';
		keyvalues['AttackAnimationPoint'] = '0.3';
		keyvalues['AttackAcquisitionRange'] = '150';
		keyvalues['AttackRange'] = '128';
		keyvalues['ProjectileModel'] = 'ranged_goodguy';
		keyvalues['ProjectileSpeed'] = '1000';
		
		// Movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_GROUND';
		keyvalues['MovementSpeed'] = '300';
		keyvalues['MovementTurnRate'] = '1.0';
		
		// Health
		keyvalues['StatusHealth'] = '1000';
		keyvalues['StatusHealthRegen'] = '1';
		keyvalues['StatusMana'] = '500';
		keyvalues['StatusManaRegen'] = '1';
		
		// Vision
		keyvalues['VisionDaytimeRange'] = '1400';
		keyvalues['VisionNighttimeRange'] = '1400';
	}
}
