// Stores who has gotten a flute
var gottenWhistle = {};

// Load KVs
var abilitiesDependencies = keyvalue.parseKVFile('abilities_dependencies.kv');

game.hook('OnMapStart', function() {
	// Precache particles
	dota.loadParticleFile('particles/greevil_fx.pcf');
	
	// Creep greevil abilities
	loadDeps('bane_nightmare');
	loadDeps('bane_brain_sap');
	loadDeps('ancient_apparition_cold_feet');
	loadDeps('ancient_apparition_ice_vortex');
	loadDeps('ursa_earthshock');
	loadDeps('ursa_overpower');
	loadDeps('dark_seer_ion_shell');
	loadDeps('dark_seer_surge');
	loadDeps('omniknight_purification');
	loadDeps('omniknight_degen_aura');
	loadDeps('treant_living_armor');
	loadDeps('treant_overgrowth');
	loadDeps('lina_dragon_slave');
	loadDeps('lina_light_strike_array');
	loadDeps('venomancer_plague_ward');
	loadDeps('venomancer_venomous_gale');
	
	// Hero Greevil abilities
	loadDeps('pudge_rot');
	loadDeps('pugna_decrepify');
	loadDeps('witch_doctor_maledict');
	loadDeps('pudge_meat_hook');
	loadDeps('vengefulspirit_magic_missile');
	loadDeps('treant_leech_seed');
	loadDeps('dazzle_shadow_wave');
	loadDeps('faceless_void_time_lock');
	loadDeps('phantom_assassin_phantom_strike');
	loadDeps('juggernaut_blade_fury');
	loadDeps('warlock_fatal_bonds');
	
	// Hero Greevil ults
	loadDeps('enigma_black_hole');
	loadDeps('lina_laguna_blade');
	loadDeps('earthshaker_echo_slam');
	loadDeps('ogre_magi_bloodlust');
	loadDeps('venomancer_poison_nova');
	loadDeps('undying_flesh_golem');
	
	// Precache mega greevil
	game.precacheModel('models/creeps/mega_greevil/mega_greevil.mdl', true);
	
	// Invoker particles
	dota.loadParticleFile('particles/units/heroes/hero_invoker.pcf');
});

game.hook("Dota_OnHeroSpawn", function(hero) {
	if(!hero || !hero.isValid()) return;
	
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID < 0) return;
	
	// Make sure they haven't already gotten one
	if(gottenWhistle[playerID]) return;
	
	// Check for space
	var hasSpace = false;
	for(var i=0; i<12; i++) {
		if(hero.netprops.m_hItems[i] == null) {
			hasSpace = true;
			break;
		}
	}
	
	// If they have space
	if(hasSpace) {
		// Store that we gave them one
		gottenWhistle[playerID] = true;
		
		// Give a whistle
		var item = dota.giveItemToHero('item_greevil_whistle_toggle', hero);
	}
});

function loadDeps(skill) {
	var dependencies = abilitiesDependencies[skill];
	if(dependencies){
		if(dependencies.Particles){
			for(var k=0;k<dependencies.Particles.length;++k){
				dota.loadParticleFile(dependencies.Particles[k]);
			}
		}
		
		if(dependencies.Models){
			for(var k=0;k<dependencies.Models.length;++k){
				game.precacheModel(dependencies.Models[k], true);
			}
		}
	}else{
		print("Couldn't find dependencies for ability: " + skill);
	}
}