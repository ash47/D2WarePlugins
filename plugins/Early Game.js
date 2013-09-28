// Hooks
game.hook('OnGameFrame', onGameFrame);
game.hook('Dota_OnBuyItem', onBuyItem);

var maxLevel = 11;

var allowedItems = [
	"item_branches",
	"item_blades_of_attack",
	"item_chainmail",
	"item_quelling_blade",
	"item_ring_of_protection",
	"item_stout_shield",
	"item_gauntlets",
	"item_slippers",
	"item_mantle",
	"item_belt_of_strength",
	"item_boots_of_elves",
	"item_robe",
	"item_circlet",
	"item_gloves",
	"item_ring_of_regen",
	"item_sobi_mask",
	"item_boots",
	"item_gem",
	"item_cloak",
	"item_magic_stick",
	"item_recipe_magic_wand",
	"item_magic_wand",
	"item_clarity",
	"item_flask",
	"item_dust",
	"item_bottle",
	"item_ward_observer",
	"item_ward_sentry",
	"item_tango",
	"item_courier",
	"item_tpscroll",
	"item_recipe_phase_boots",
	"item_phase_boots",
	"item_ring_of_health",
	"item_void_stone",
	"item_energy_booster",
	"item_recipe_power_treads",
	"item_power_treads",
	"item_recipe_hand_of_midas",
	"item_hand_of_midas",
	"item_recipe_pers",
	"item_pers",
	"item_recipe_poor_mans_shield",
	"item_poor_mans_shield",
	"item_recipe_bracer",
	"item_bracer",
	"item_recipe_wraith_band",
	"item_wraith_band",
	"item_recipe_null_talisman",
	"item_null_talisman",
	"item_flying_courier",
	"item_recipe_ring_of_basilius",
	"item_ring_of_basilius",
	"item_recipe_urn_of_shadows",
	"item_urn_of_shadows",
	"item_recipe_headdress",
	"item_headdress",
	"item_recipe_soul_ring",
	"item_soul_ring",
	"item_recipe_arcane_boots",
	"item_arcane_boots",
	"item_orb_of_venom",
	"item_recipe_ancient_janggo",
	"item_ancient_janggo",
	"item_recipe_medallion_of_courage",
	"item_medallion_of_courage",
	"item_smoke_of_deceit",
	"item_recipe_ring_of_aquila",
	"item_ring_of_aquila",
	"item_recipe_tranquil_boots",
	"item_tranquil_boots",
	"item_blink",
	"item_broadsword"
	
];

allowedItems.sort();

var frames = 0;

function onGameFrame(){
	++frames;
	if(frames != 5) return;
	frames = 0;
	
	for(var i = 0; i < server.clients.length; ++i){
		var client = server.clients[i];
		if(client == null || !client.isInGame()) continue;
		
		var heroes = client.getHeroes();
		for(var j = 0; j < heroes.length; ++j){
			var hero = heroes[j];
			
			if(hero.netprops.m_iCurrentLevel >= maxLevel){
				dota.setHeroLevel(hero, maxLevel);
				hero.netprops.m_iCurrentXP = dota.getTotalExpRequiredForLevel(maxLevel);
			}
		}
	}
}

function onBuyItem(unit, item, playerID, unknown){
	if(allowedItems.indexOf(item) == -1){
		var client = dota.findClientByPlayerID(playerID);
		if(client != null){
			client.printToChat("This item is not allowed");
		}
		
		return false;
	}else{
		return true;
	}
}