// Returns the xy distance between two vectors
exports.vecDist = function(vec1, vec2) {
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

// List of hex modifiers
var hexList = new Array(
	'modifier_lion_voodoo',
	'modifier_sheepstick_debuff',
	'modifier_shadow_shaman_voodoo'
);

function addShell(unit) {
	// Add a shell
	if(!unit.modifierShell) {
		unit.modifierShell = dota.createAbility(unit, "tidehunter_kraken_shell");
	}
	
	// Add the modifier for the shell
	dota.addNewModifier(unit, unit.modifierShell, "modifier_tidehunter_kraken_shell", "tidehunter_kraken_shell", {"duration":5, "damage_cleanse": 0});
}

// Removes hex from a unit
exports.removeHex = function(unit) {
	// Validate unit
	if(!unit) return;
	
	// Remove all hex modifiers
	for(var i=0;i<hexList.length;i++) {
		dota.removeModifier(unit, hexList[i]);
	}
	
	// Add a kraken shell
	addShell(unit);
}

// List of stun modifiers
var stunList = new Array(
	'modifier_alchemist_unstable_concoction',
	'modifier_ancientapparition_coldfeet_freeze',
	'modifier_antimage_mana_void',
	'modifier_batrider_flamebreak',
	'modifier_beastmaster_primal_roar',
	'modifier_beastmaster_primal_roar_slow',
	'modifier_beastmaster_primal_roar_stun',
	'modifier_brewmaster_earth_hurl_boulder',
	'modifier_centaur_stomp',
	'modifier_chaos_knight_chaos_bolt',
	'modifier_rattletrap_hookshot',
	'modifier_dazzle_poison_touch',
	'modifier_dragon_knight_dragon_tail',
	'modifier_earthshaker_aftershock',
	'modifier_earthshaker_fissure_stun',
	'modifier_enigma_malefice',
	'modifier_faceless_void_timelock_freeze',
	'modifier_gyrocopter_homing_missile',
	'modifier_invoker_cold_snap',
	'modifier_invoker_cold_snap_freeze',
	'modifier_invoker_deafening_blast_knockback',
	'modifier_invoker_deafening_blast_disarm',
	'modifier_wisp_tether',
	'modifier_jakiro_ice_path',
	'modifier_jakiro_ice_path_stun',
	'modifier_keeper_of_the_light_mana_leak',
	'modifier_kunkka_ghost_ship',
	'modifier_kunkka_torrent',
	'modifier_leshrac_split_earth',
	'modifier_leshrac_split_earth_thinker',
	'modifier_lina_light_strike_array',
	'modifier_lion_impale',
	'modifier_luna_lucent_beam',
	'modifier_magnataur_reverse_polarity',
	'modifier_medusa_stone_gaze',
	'modifier_mirana_sacred_arrow',
	'modifier_morphling_adaptive_strike',
	'modifier_necrolyte_reapers_scythe',
	'modifier_necrolyte_heartstopper_aura_effect',
	'modifier_nyx_assassin_impal',
	'modifier_nyx_assassin_spiked_carapace',
	'modifier_ogre_magi_fireblast',
	'modifier_ogre_magi_unrefined_fireblast',
	'modifier_ogre_magi_fireblast_multicast',
	'modifier_ogre_magi_ignite',
	'modifier_puck_coiled',
	'modifier_dream_coil_thinker',
	'modifier_rubick_telekinesis',
	'modifier_sandking_burrowstrike',
	'modifier_skeleton_king_hellfire_blast',
	'modifier_slardar_bash',
	'modifier_slithereen_crush',
	'modifier_spirit_breaker_greater_bash',
	'modifier_spirit_breaker_charge_of_darkness_debuff',
	'modifier_spirit_breaker_nether_strike',
	'modifier_sven_storm_hammer',
	'modifier_tidehunter_ravage',
	'modifier_tiny_avalanche_stun',
	'modifier_tiny_craggy_exterior',
	'modifier_troll_warlord_berserkers_rage',
	'modifier_tusk_snowball_movement',
	'modifier_vengefulspirit_magic_missile',
	'modifier_visage_fanukuar_stone_form',
	'modifier_warlock_chaotic_offering',
	'modifier_windrunner_shackle_shot',
	'modifier_witch_doctor_paralzing_cask',
	'modifier_shadow_shaman_shackles',
	'modifier_item_cranium_basher_debuff'
);

// Removes stun from a unit
exports.removeStun = function(unit) {
	// Validate unit
	if(!unit) return;
	
	// Remove all hex modifiers
	for(var i=0;i<stunList.length;i++) {
		dota.removeModifier(unit, stunList[i]);
		dota.removeModifier(unit, stunList[i]+'_stun');
	}
	
	// Add a kraken shell
	addShell(unit);
}

// A vector (0, 0, 0)
exports.pos0 = {
	x:0,
	y:0,
	z:0
}
