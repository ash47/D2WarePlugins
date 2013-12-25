var timers = require('timers')

// How long you have to survive, in seconds
var surviveTime = 60 * 5;

// Force MID ONLY
console.findConVar("dota_force_gamemode").setInt(11);

// Stores who is an invoker
var invokers = {};

// Stores the sun strike abilities
var sunStrikeAbility = {};

// Colors
var C_RED = '\x12';
var C_LGREEN = '\x15';

// Stores everyone who has already turned into an invoker
var turnIntoInvoker = {};

game.hookEvent("dota_player_gained_level", function(event) {
	// Grab all heroes
	var heroes = game.findEntitiesByClassname('npc_dota_hero_*');

	// Loop over heroes
	for(var hh=0; hh<heroes.length; hh++) {
		// Grab a hero
		var hero = heroes[hh];
		
		// Validate hero
		if(!hero || !hero.isValid() || !hero.isHero()) continue;
		
		// No illusions
		if(dota.hasModifier(hero, 'modifier_illusion')) continue;
		
		// Remove skill points
		hero.netprops.m_iAbilityPoints = 0;
	}
});

game.hookEvent("entity_killed", function(event) {
	var killed = game.getEntityByIndex(event.getInt('entindex_killed'));
	if(killed == null || !killed.isValid()) return;
	
	// Check if it was a hero killed
	if(killed.isHero()) {
		var playerID = killed.netprops.m_iPlayerID;
		if(playerID < 0 || playerID > 9) return;
		
		// Become an invoker
		invokers[playerID] = true;
		becomeInvoker(killed);
	}
});

game.hook('OnMapStart', function() {
	// Stop invoker from being picked
	dota.setHeroAvailable(74 , false);
	
	// Cleanup the map
	dota.removeAll('npc_dota_tower*');
	dota.removeAll('npc_dota_building*');
	dota.removeAll('npc_dota_barracks*');
	dota.removeAll("npc_dota_creep*");
	dota.removeAll("npc_dota_neutral_spawner*");
	dota.removeAll("npc_dota_roshan_spawner*");
	dota.removeAll("npc_dota_scripted_spawner*");
	dota.removeAll("npc_dota_spawner*");
	dota.removeAll("npc_dota_roshan*");
	dota.removeAll("dota_fountain*");
	dota.removeAll("ent_dota_fountain*");
	dota.removeAll("ent_dota_shop*");
});

// When to do the next check
var nextCheck = 0;

// Is the game over?
var gameOver = false;

// Has the game started?
var gameStarted = false;

// Have we picked our invoker?
var pickedInvoker = false;

game.hook("OnGameFrame", function() {
	// If the game is over, don't do anything
	if(gameOver) return;
	
	// Grab the current time
	var gameTime = game.rules.props.m_fGameTime;
	
	// Only check once every 0.1 seconds
	if(gameTime < nextCheck) return;
	nextCheck = gameTime + 0.1;
	
	// Grab the game state
	var gameState = game.rules.props.m_nGameState;
	
	if(!pickedInvoker) {
		// Check if it's hero selection time
		if(gameState == dota.STATE_HERO_SELECTION) {
			// Build a list of possible invokers
			var possible = [];
			
			for (var i = 0; i < server.clients.length; ++i) {
				var client = server.clients[i];
				if (!client || !client.isInGame()) continue;
				
				var playerID = client.netprops.m_iPlayerID;
				if(playerID < 0 || playerID > 9) continue;
				
				// Store this client as a possible invoker
				possible.push(playerID);
			}
			
			// Check if we found any invokers
			if(possible.length > 0) {
				// Pick the invoker
				invokerID = possible[Math.floor((Math.random()*possible.length))];
				
				// This player is the new invoker
				invokers[invokerID] = true;
				
				// Store that we've picked an invoker
				pickedInvoker = true;
			}
		}
	}
	
	// Make sure the game has started
	if(gameState != dota.STATE_GAME_IN_PROGRESS) return;
	
	// Check if the game has started
	if(!gameStarted) {
		// Store that the game has started
		gameStarted = true;
		
		// Create a timer to end the game
		timers.setTimeout(function() {
			// Check if the game has ended
			if(!gameOver) {
				// End the game
				gameOver = true;
				dota.forceWin(2);
			}
		}, surviveTime * 1000);
		
		// Tell everyone how to play
		for (var i = 0; i < server.clients.length; ++i) {
			var client = server.clients[i];
			if (!client || !client.isInGame()) continue;
			
			var playerID = client.netprops.m_iPlayerID;
			if(playerID < 0 || playerID > 9) continue;
			
			if(invokers[playerID]) {
				client.printToChat(C_LGREEN+'Use your sun strike to kill all the other players!');
				
				// Check if they have a hero
				var hero = client.netprops.m_hAssignedHero;
				if(hero && hero.isValid()) {
					becomeInvoker(hero);
				}
			} else {
				client.printToChat(C_LGREEN+'Survive for '+C_RED+surviveTime+C_LGREEN+' seconds to win the game! If you die, you will turn into an invoker!');
			}
		}
	}
	
	// Default the game to finished
	var finished = true;
	
	for (var i = 0; i < server.clients.length; ++i) {
		var client = server.clients[i];
		if (!client || !client.isInGame()) continue;
		
		var playerID = client.netprops.m_iPlayerID;
		if(playerID < 0 || playerID > 9) continue;
		
		if(invokers[playerID]) {
			/*// Auto select sun strike
			if(client.netprops.m_iSpectatorClickBehavior != 3) {
				// Grab sunstrike ability
				var ab = sunStrikeAbility[playerID];
				if(ab == null) continue;
				
				// Check if the ability has been cooled down
				if(gameTime > ab.netprops.m_fCooldown) {
					// Get sunstrike out
					client.fakeCommand("dota_ability_execute 3");
				}
			}*/
		} else {
			// Someone still alive
			finished = false;
		}
	}
	
	// If the game is over
	if(finished) {
		// End the game
		gameOver = true;
		dota.forceWin(3);
	}
});

// Reveal everyone
game.hook("Dota_OnUnitThink", function(unit){
	if(unit.isHero()){
		dota.setUnitState(unit, dota.UNIT_STATE_REVEALED, true);
		dota.setUnitState(unit, dota.UNIT_STATE_INVISIBLE, false);
		
		// Check if the game has started
		if(game.rules.props.m_nGameState == dota.STATE_GAME_IN_PROGRESS) {
			var playerID = unit.netprops.m_iPlayerID;
			if(playerID < 0 || playerID > 9) return;
			
			// Check if they are an invoker
			if(invokers[playerID]) {
				// Invoker can't die
				dota.setUnitState(unit, dota.UNIT_STATE_INVULNERABLE, true);
			} else {
				// Everyone else can die
				dota.setUnitState(unit, dota.UNIT_STATE_INVULNERABLE, false);
			}
		} else {
			// No one can die
			dota.setUnitState(unit, dota.UNIT_STATE_INVULNERABLE, true);
		}
	}
});

// No buying
game.hook("Dota_OnBuyItem", function(unit, item, playerID, unknown){
	return false;
});

function becomeInvoker(hero) {
	// Grab playerID
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID < 0 || playerID > 9) return;
	
	// Grab client
	var client = dota.findClientByPlayerID(playerID);
	if(!client || !client.isInGame()) return;
	
	// Check if this player is an invoker
	if(invokers[playerID]) {
		// Set their team
		hero.netprops.m_iTeamNum = dota.TEAM_DIRE;
		client.netprops.m_iTeamNum = dota.TEAM_DIRE;
		
		// Check if they are invoker
		if(hero.getClassname() != 'npc_dota_hero_invoker') {
			// Stop crashage
			if(client.dontChange) return;
			client.dontChange = true;
			timers.setTimeout(function(){
				client.dontChange = false;
			}, 5000);
			
			timers.setTimeout(function() {
				// Validate hero
				if(!hero || !hero.isValid()) return;
				if(!client || !client.isInGame()) return;
				
				// Check if they are invoker
				if(hero.getClassname() != 'npc_dota_hero_invoker') {
					// Change them to invoker
					changeToSpecificHero(client, 'npc_dota_hero_invoker');
				}
			}, 1);
		} else {
			var skills = {};
			
			for(var i=0; i<16; i++) {
				var ab = hero.netprops.m_hAbilities[i];
				if(ab != null && ab.isValid()) {
					var name = ab.getClassname();
					// Store the skill
					skills[name] = ab;
					
					// Max out exort
					if(name == 'invoker_exort') {
						while(ab.netprops.m_iLevel < 7) {
							dota.upgradeAbility(ab);
						}
					}
					
					// Max out invoke
					if(name == 'invoker_invoke') {
						while(ab.netprops.m_iLevel < 4) {
							dota.upgradeAbility(ab);
						}
					}
					
					// Hook suntrike
					if(name == 'invoker_sun_strike') {
						hookCooldown(ab);
					}
				}
			}
			
			// Grab exort
			var exort = skills['invoker_exort'];
			var invoke = skills['invoker_invoke'];
			var sunStrike = skills['invoker_sun_strike'];
			
			if(exort == null) {
				server.print('\n\nFAILED TO FIND EXORT!!!\n\n');
				return;
			}
			
			if(invoke == null) {
				server.print('\n\nFAILED TO FIND INVOKE!!!\n\n');
				return;
			}
			
			if(sunStrike == null) {
				server.print('\n\nFAILED TO FIND INVOKE!!!\n\n');
				return;
			}
			
			// Load sun strike
			timers.setTimeout(function() {
				// Validate our skills
				if(hero && hero.isValid() && exort && exort.isValid() && invoke && invoke.isValid() && sunStrike && sunStrike.isValid()) {
					for(var i=0; i<3; i++) {
						dota.executeOrders(playerID, dota.ORDER_TYPE_CAST_ABILITY_NO_TARGET, [hero], null, exort, true, {x:0, y:0, z:0});
					}
					
					dota.executeOrders(playerID, dota.ORDER_TYPE_CAST_ABILITY_NO_TARGET, [hero], null, invoke, true, {x:0, y:0, z:0});
					
					// Store the sunstrike ability
					sunStrikeAbility[playerID] = sunStrike;
				}
			}, 1000);
		}
	} else {
		// Set their team
		hero.netprops.m_iTeamNum = dota.TEAM_RADIANT;
		client.netprops.m_iTeamNum = dota.TEAM_RADIANT;
		
		// Give level 3 of all skills
		for(var i=0; i<16; i++) {
			var ab = hero.netprops.m_hAbilities[i];
			if(ab != null && ab.isValid()) {
				while(ab.netprops.m_iLevel < 3) {
					dota.upgradeAbility(ab);
				}
			}
		}
	}
}

game.hook("Dota_OnHeroSpawn", function(hero) {
	// Remove skill points
	hero.netprops.m_iAbilityPoints = 0;
	
	// Grab the current gamestate
	var gameState = game.rules.props.m_nGameState;
	
	// Check if the game has started
	if(gameState == dota.STATE_GAME_IN_PROGRESS) {
		// Become an invoker if possible
		becomeInvoker(hero);
	} else {
		// Give level 3 of all skills
		for(var i=0; i<16; i++) {
			var ab = hero.netprops.m_hAbilities[i];
			if(ab != null && ab.isValid()) {
				while(ab.netprops.m_iLevel < 3) {
					dota.upgradeAbility(ab);
				}
			}
		}
		
		// Grab client
		var client = dota.findClientByPlayerID(hero.netprops.m_iPlayerID);
		if(!client || !client.isInGame()) return;
		
		// Just become radiant
		hero.netprops.m_iTeamNum = dota.TEAM_RADIANT;
		client.netprops.m_iTeamNum = dota.TEAM_RADIANT;
	}
});

function changeToSpecificHero(client, hName) {
	// Disable all heroes except the chosen one
	for(var i=0;i<128;i++) {
		// Grab the name of this hero
		var heroName = dota.heroIdToClassname(i);
		
		if(heroName == hName) {
			dota.setHeroAvailable(i, true);
		} else {
			dota.setHeroAvailable(i, false);
		}
	}
	
	// Force them to that hero
	dota.changeToRandomHero(client);
	
	// Re enable all other heroes
	for(var i=0;i<128;i++) {
		dota.setHeroAvailable(i, true);
	}
	
	// Stop invoker from being picked
	dota.setHeroAvailable(74 , false);
}

// Caches which are stored
var hookedSkills = {};

function hookCooldown(ent) {
	// Grab the name of this ability
	var name = ent.getClassname();
	
	// Check if this one is already hooked
	if(hookedSkills[ent.index] == name) {
		return;
	}
	
	// Hook the cooldown
	game.hookEnt(ent, dota.ENT_HOOK_GET_COOLDOWN, function(ab) {
		return 0.5;
	});
	
	// Hook the manacost
	game.hookEnt(ent, dota.ENT_HOOK_GET_MANA_COST, function(ab) {
		return 0;
	});
	
	// Store that this ent has been hooked
	hookedSkills[ent.index] = name;
}

game.hook("Dota_OnUnitParsed", function(unit, keyvalues) {
	// Check if it was an invoker
	if(unit.getClassname() == 'npc_dota_hero_invoker') {
		// Remvoe movement
		keyvalues['MovementCapabilities'] = 'DOTA_UNIT_CAP_MOVE_NONE';
	} else {
		// Max out movement speed
		keyvalues['MovementSpeed'] = '522';
	}
	
	// Give mana
	keyvalues['StatusMana'] = 1000;
	keyvalues['StatusManaRegen'] = 15;
});
