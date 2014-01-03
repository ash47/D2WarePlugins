var timers = require('timers');

game.hook("OnGameFrame", onGameFrame);
game.hook("OnMapStart", onMapStart);
game.hook("Dota_OnHeroPicked", onHeroPicked);

var cvForceGameMode = console.findConVar("dota_force_gamemode");

var playermanager = null;
// Two players cannot pick meepo in the same match, or else it'll bug the game
var hasMeepoAlready = false;

var optionHero = 'Any Hero';
var lobbyManager;

var blueHero;
var pinkHero;

do {
	blueHero = dota.heroes[Math.floor(Math.random() * dota.heroes.length)];
} while (blueHero == 'npc_dota_hero_meepo');

do {
	pinkHero = dota.heroes[Math.floor(Math.random() * dota.heroes.length)];
} while (pinkHero == 'npc_dota_hero_meepo');

var heroMap = {
	"Anti-Mage": "npc_dota_hero_antimage",
	"Axe": "npc_dota_hero_axe",
	"Bane": "npc_dota_hero_bane",
	"Bloodseeker": "npc_dota_hero_bloodseeker",
	"Crystal Maiden": "npc_dota_hero_crystal_maiden",
	"Drow Ranger": "npc_dota_hero_drow_ranger",
	"Earthshaker": "npc_dota_hero_earthshaker",
	"Juggernaut": "npc_dota_hero_juggernaut",
	"Mirana": "npc_dota_hero_mirana",
	"Morphling": "npc_dota_hero_morphling",
	"Shadow Fiend": "npc_dota_hero_nevermore",
	"Phantom Lancer": "npc_dota_hero_phantom_lancer",
	"Puck": "npc_dota_hero_puck",
	"Pudge": "npc_dota_hero_pudge",
	"Razor": "npc_dota_hero_razor",
	"Sand King": "npc_dota_hero_sand_king",
	"Storm Spirit": "npc_dota_hero_storm_spirit",
	"Sven": "npc_dota_hero_sven",
	"Tiny": "npc_dota_hero_tiny",
	"Vengeful Spirit": "npc_dota_hero_vengefulspirit",
	"Windrunner": "npc_dota_hero_windrunner",
	"Zeus": "npc_dota_hero_zuus",
	"Kunkka": "npc_dota_hero_kunkka",
	"Lina": "npc_dota_hero_lina",
	"Lion": "npc_dota_hero_lion",
	"Shadow Shaman": "npc_dota_hero_shadow_shaman",
	"Slardar": "npc_dota_hero_slardar",
	"Tidehunter": "npc_dota_hero_tidehunter",
	"Witch Doctor": "npc_dota_hero_witch_doctor",
	"Lich": "npc_dota_hero_lich",
	"Riki": "npc_dota_hero_riki",
	"Enigma": "npc_dota_hero_enigma",
	"Tinker": "npc_dota_hero_tinker",
	"Sniper": "npc_dota_hero_sniper",
	"Necrolyte": "npc_dota_hero_necrolyte",
	"Warlock": "npc_dota_hero_warlock",
	"Beastmaster": "npc_dota_hero_beastmaster",
	"Queen of Pain": "npc_dota_hero_queenofpain",
	"Venomancer": "npc_dota_hero_venomancer",
	"Faceless Void": "npc_dota_hero_faceless_void",
	"Skeleton King": "npc_dota_hero_skeleton_king",
	"Death Prophet": "npc_dota_hero_death_prophet",
	"Phantom Assassin": "npc_dota_hero_phantom_assassin",
	"Pugna": "npc_dota_hero_pugna",
	"Templar Assassin": "npc_dota_hero_templar_assassin",
	"Viper": "npc_dota_hero_viper",
	"Luna": "npc_dota_hero_luna",
	"Dragon Knight": "npc_dota_hero_dragon_knight",
	"Dazzle": "npc_dota_hero_dazzle",
	"Clockwerk": "npc_dota_hero_rattletrap",
	"Leshrac": "npc_dota_hero_leshrac",
	"Furion": "npc_dota_hero_furion",
	"Nature's Prophet": "npc_dota_hero_furion",
	"Lifestealer": "npc_dota_hero_life_stealer",
	"Dark Seer": "npc_dota_hero_dark_seer",
	"Clinkz": "npc_dota_hero_clinkz",
	"Omniknight": "npc_dota_hero_omniknight",
	"Enchantress": "npc_dota_hero_enchantress",
	"Huskar": "npc_dota_hero_huskar",
	"Night Stalker": "npc_dota_hero_night_stalker",
	"Broodmother": "npc_dota_hero_broodmother",
	"Bounty Hunter": "npc_dota_hero_bounty_hunter",
	"Weaver": "npc_dota_hero_weaver",
	"Jakiro": "npc_dota_hero_jakiro",
	"Batrider": "npc_dota_hero_batrider",
	"Chen": "npc_dota_hero_chen",
	"Spectre": "npc_dota_hero_spectre",
	"Ancient Apparition": "npc_dota_hero_ancient_apparition",
	"Doom": "npc_dota_hero_doom_bringer",
	"Ursa": "npc_dota_hero_ursa",
	"Spirit Breaker": "npc_dota_hero_spirit_breaker",
	"Gyrocopter": "npc_dota_hero_gyrocopter",
	"Alchemist": "npc_dota_hero_alchemist",
	"Invoker": "npc_dota_hero_invoker",
	"Silencer": "npc_dota_hero_silencer",
	"Outworld Devourer": "npc_dota_hero_obsidian_destroyer",
	"Lycan": "npc_dota_hero_lycan",
	"Brewmaster": "npc_dota_hero_brewmaster",
	"Shadow Demon": "npc_dota_hero_shadow_demon",
	"Lone Druid": "npc_dota_hero_lone_druid",
	"Chaos Knight": "npc_dota_hero_chaos_knight",
	"Treant Protector": "npc_dota_hero_treant",
	"Ogre Magi": "npc_dota_hero_ogre_magi",
	"Undying": "npc_dota_hero_undying",
	"Rubick": "npc_dota_hero_rubick",
	"Disruptor": "npc_dota_hero_disruptor",
	"Nyx Assassin": "npc_dota_hero_nyx_assassin",
	"Naga Siren": "npc_dota_hero_naga_siren",
	"Keeper of the Light": "npc_dota_hero_keeper_of_the_light",
	"Wisp": "npc_dota_hero_wisp",
	"Visage": "npc_dota_hero_visage",
	"Slark": "npc_dota_hero_slark",
	"Medusa": "npc_dota_hero_medusa",
	"Troll Warlord": "npc_dota_hero_troll",
	"Centaur Warchief": "npc_dota_hero_centaur",
	"Magnus": "npc_dota_hero_magnataur",
	"Timbersaw": "npc_dota_hero_shredder",
	"Bristleback": "npc_dota_hero_bristleback",
	"Tusk": "npc_dota_hero_tusk",
	"Skywrath Mage": "npc_dota_hero_skywrath_mage",
	"Elder Titan": "npc_dota_hero_elder_titan",
    "Legion Commander": "npc_dota_hero_legion_commander",
    "Ember Spirit": "npc_dota_hero_ember_spirit",
    "Earth Spirit": "npc_dota_hero_earth_spirit"
};

plugin.get('LobbyManager', function(obj){
	lobbyManager = obj;
	optionHero = lobbyManager.getOptionsForPlugin('MidOnlyFixed')['Hero'] || 'Any Hero';
});

cvForceGameMode.setInt(11);

function onMapStart(){
	hasMeepoAlready = false;
	playermanager = game.findEntityByClassname(-1, "dota_player_manager");
	cvForceGameMode.setInt(11);
}

function onGameFrame(){
	cvForceGameMode.setInt(11);
}

function onHeroPicked(client, clsname){
	if(clsname == 'npc_dota_hero_meepo'){
		if(hasMeepoAlready){
			return null;
		}else{
			hasMeepoAlready = true;
		}
	}

	if(optionHero == "Any Hero") return;
	if(optionHero == "All Random") return "random";
	if(optionHero == "Same Hero") return blueHero;
	if(optionHero == "Blue vs Pink"){
		if(client.netprops.m_iTeamNum == dota.TEAM_RADIANT){
			return blueHero;
		}else{
			return pinkHero;
		}
	}

	return heroMap[optionHero];
}

/*timers.setInterval(function(){
	if(game.rules.props.m_nGameState != 5) return;

	for(var i = 0; i < server.clients.length; ++i){
		var client = server.clients[i];
		if(client == null || !client.isInGame()) continue;

		var hero = client.netprops.m_hAssignedHero;
		if(hero == null) continue;

		//dota.giveExperienceToHero(hero, 1);
		// Disabled for now
		//playermanager.netprops.m_iReliableGold[client.netprops.m_iPlayerID] += 1;
	}
}, 250);*/