// Libraries
var timers = require('timers');

// Options
var capSkills = true;
var scaleBuildings = true;
var scaleCreeps = true;
var fountainCamping = false;

// Free courier
var freeCourier = false;
var flyingCourier = false;

game.hook("Dota_OnGetAbilityValue", function(ability, abilityName, field, values) {
	var fullName = abilityName + "." + field;

	if (typeof replacedName[fullName] != "undefined")
		return;
	replacedName[fullName] = true;

	var newValues = onGetAbilityValue(ability, abilityName, field, values) || values;

	/*
		LIMITS
	*/

	if(capSkills) {
		// Ionshell
		if(abilityName.indexOf('dark_seer_ion_shell') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 500) {
						return 500;
					}
					return val;
				});
			}
		}

		// Edict
		if(abilityName.indexOf('leshrac_diabolic_edict') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 500) {
						return 500;
					}
					return val;
				});
			}
			if(field.indexOf('num_explosions') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 32) {
						return 32;
					}
					return val;
				});
			}
		}

		// Shrapnel
		if(abilityName.indexOf('sniper_shrapnel') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 400) {
						return 400;
					}
					return val;
				});
			}
			if(field.indexOf('slow_movement_speed') != -1) {
				newValues = newValues.map(function(val) {
					if(val < -30) {
						return -30;
					}
					return val;
				});
			}
		}

		// Enigma
		if(abilityName.indexOf('enigma_midnight_pulse') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 400) {
						return 400;
					}
					return val;
				});
			}
			if(field.indexOf('damage_percent') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 7) {
						return 7;
					}
					return val;
				});
			}
			if(field.indexOf('duration') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 8) {
						return 8;
					}
					return val;
				});
			}
		}

		// Cogs
		if(abilityName.indexOf('rattletrap_power_cogs') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 190) {
						return 190;
					}
					return val;
				});
			}

			if(field.indexOf('duration') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 8) {
						return 8;
					}
					return val;
				});
			}

			if(field.indexOf('drain_amount') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 200) {
						return 200;
					}
					return val;
				});
			}

			if(field.indexOf('attacks_to_destroy') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 3) {
						return 3;
					}
					return val;
				});
			}

			if(field.indexOf('push_length') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 252) {
						return 252;
					}
					return val;
				});
			}

			if(field.indexOf('push_speed') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 300) {
						return 300;
					}
					return val;
				});
			}

			if(field.indexOf('spacing') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 160) {
						return 160;
					}
					return val;
				});
			}
		}

		// Magic Resistance
		if(field.indexOf('bonus_spell_resist') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 30*3) {
					return 30*3;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_magical_armor') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 15*3) {
					return 15*3;
				}
				return val;
			});
		}

		// Max images is 3 from naga >_>
		if(field.indexOf('images_count') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 3) {
					return 3;
				}
				return val;
			});
		}

		// Thirst
		if(field.indexOf('visibility_threshold_pct') != -1) {
			newValues = newValues.map(function(val) {
				return 50;
			});
		}
		if(field.indexOf('invis_threshold_pct') != -1) {
			newValues = newValues.map(function(val) {
				return 25;
			});
		}

		// Treants
		if(field.indexOf('max_treants') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 5) {
					return 5;
				}
				return val;
			});
		}

		// Treants
		if(field.indexOf('ward_count') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 10) {
					return 10;
				}
				return val;
			});
		}

		// Stuns
		if(field.indexOf('stun') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 2) {
					return 2;
				}
				return val;
			});
		}

		// Radius
		if(field.indexOf('radius') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 2000) {
					return 2000;
				}
				return val;
			});
		}

		// Range
		if(field.indexOf('range') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 2000) {
					return 2000;
				}
				return val;
			});
		}

		// Heart Stopper
		if(abilityName.indexOf('necrolyte_heartstopper_aura') != -1) {
			if(field.indexOf('aura_damage') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 1.5) {
						return 1.5;
					}
					return val;
				});
			}
		}

		// Evasion
		if(field.indexOf('evasion') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 40) {
					return 40;
				}
				return val;
			});
		}

		// Dodge
		if(field.indexOf('dodge') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 25) {
					return 25;
				}
				return val;
			});
		}

		// Bonus Attack Range
		if(field.indexOf('bonus_attack_range') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 372) {
					return 372;
				}
				return val;
			});
		}

		// Duration
		if(field.indexOf('duration') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 60) {
					return 60;
				}
				return val;
			});
		}

		// Chance
		if(field.indexOf('chance') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 75) {
					return 75;
				}
				return val;
			});
		}

		// Static Field
		if(field.indexOf('damage_health_pct') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 11) {
					return 11;
				}
				return val;
			});
		}
		// March of the machines
		if(field.indexOf('machines_per_sec') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 24*5) {
					return 24*5;
				}
				return val;
			});
		}
		// Range
		if(field.indexOf('range') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 2000) {
					return 2000;
				}
				return val;
			});
		}
		// Wisps
		if(field.indexOf('wisp_count') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 9) {
					return 9;
				}
				return val;
			});
		}
		// Generic Count
		if(field.indexOf('count') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 20) {
					return 20;
				}
				return val;
			});
		}
		// Excorcism
		if(field.indexOf('extra_spirits') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 6) {
					return 6;
				}
				return val;
			});
		}
		// Juxtapose
		if(field.indexOf('max_illusions') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 10) {
					return 10;
				}
				return val;
			});
		}
		if(field.indexOf('illusion_duration') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 60) {
					return 60;
				}
				return val;
			});
		}
		// Spirit Breaker
		if(field.indexOf('bash_radius') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 500) {
					return 500;
				}
				return val;
			});
		}
		// Dispersion
		if(abilityName.indexOf('spectre_dispersion') != -1) {
			if(field.indexOf('min_radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 300) {
						return 300;
					}
					return val;
				});
			}
			if(field.indexOf('max_radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 1000) {
						return 1000;
					}
					return val;
				});
			}
			if(field.indexOf('damage_reflection_pct') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 22) {
						return 22;
					}
					return val;
				});
			}
		}
		// Bristleback
		if(field.indexOf('side_damage_reduction') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 20) {
					return 20;
				}
				return val;
			});
		}
		if(field.indexOf('back_damage_reduction') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 40) {
					return 40;
				}
				return val;
			});
		}
		// Greater Bash
		if(abilityName.indexOf('spirit_breaker_greater_bash') != -1) {
			if(field.indexOf('knockback_duration') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 0.5) {
						return 0.5;
					}
					return val;
				});
			}
			if(field.indexOf('knockback_distance') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 162) {
						return 162;
					}
					return val;
				});
			}
		}
		// Aegis
		if(field.indexOf('reincarnate_time') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 5) {
					return 5;
				}
				return val;
			});
		}
		if(field.indexOf('disappear_time') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 360) {
					return 360;
				}
				return val;
			});
		}
		// Evasion
		if(field.indexOf('bonus_evasion') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 35) {
					return 35;
				}
				return val;
			});
		}
		// Stampede
		if(abilityName.indexOf('centaur_stampede') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 105) {
						return 105;
					}
					return val;
				});
			}
		}
		// Wrath of Nature
		if(abilityName.indexOf('furion_wrath_of_nature') != -1) {
			if(field.indexOf('damage_percent_add') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 7) {
						return 7;
					}
					return val;
				});
			}
		}
		// Impetus
		if(abilityName.indexOf('enchantress_impetus') != -1) {
			if(field.indexOf('distance_damage_pct') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 25) {
						return 25;
					}
					return val;
				});
			}
		}
		// Bonuses
		if(field.indexOf('bonus_strength') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 400) {
					return 400;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_agility') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 400) {
					return 400;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_intellect') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 400) {
					return 400;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_all_stats') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 400) {
					return 400;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_health') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 5000) {
					return 5000;
				}
				return val;
			});
		}
		if(field.indexOf('bonus_mana') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 4000) {
					return 4000;
				}
				return val;
			});
		}
		if(field.indexOf('health_regen_rate') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 2) {
					return 2;
				}
				return val;
			});
		}
		if(field.indexOf('damage_aura') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 150) {
					return 150;
				}
				return val;
			});
		}
		if(field.indexOf('armor_aura') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 50) {
					return 50;
				}
				return val;
			});
		}

		if(field.indexOf('aoe') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 1000) {
					return 1000;
				}
				return val;
			});
		}
		if(field.indexOf('hp_regen') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 20) {
					return 20;
				}
				return val;
			});
		}
		if(field.indexOf('mana_regen_aura') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 20) {
					return 20;
				}
				return val;
			});
		}
		if(field.indexOf('mana_regen') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 500) {
					return 500;
				}
				return val;
			});
		}
		if(field.indexOf('aura_health_regen') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 40) {
					return 40;
				}
				return val;
			});
		}
		// Purification
		if(abilityName.indexOf('omniknight_purification') != -1) {
			if(field.indexOf('radius') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 500) {
						return 500;
					}
					return val;
				});
			}
		}
		// Cleave
		if(field.indexOf('cleave_radius') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 400) {
					return 400;
				}
				return val;
			});
		}
		// Shredder whirling shit
		if(field.indexOf('whirling_radius') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 300) {
					return 300;
				}
				return val;
			});
		}
		// Aftershock
		if(field.indexOf('aftershock_range') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 300) {
					return 300;
				}
				return val;
			});
		}
		// Malefice
		if(abilityName.indexOf('enigma_malefice') != -1) {
			if(field.indexOf('stun_duration') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 1) {
						return 1;
					}
					return val;
				});
			}
			if(field.indexOf('damage') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 650) {
						return 650;
					}
					return val;
				});
			}
			if(field.indexOf('duration') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 4) {
						return 4;
					}
					return val;
				});
			}
		}
		// Bonus HP
		if(field.indexOf('bonus_hp') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 10000) {
					return 10000;
				}
				return val;
			});
		}
		// Bonus Gold Caps
		if(field.indexOf('bonus_gold_cap') != -1) {
			newValues = newValues.map(function(val) {
				if(val > 300) {
					return 300;
				}
				return val;
			});
		}
		// Midas
		if(abilityName.indexOf('item_hand_of_midas') != -1) {
			if(field.indexOf('bonus_gold') != -1) {
				newValues = newValues.map(function(val) {
					if(val > 190) {
						return 190;
					}
					return val;
				});
			}
		}
		// Healing stuff
		if(abilityName.indexOf('witch_doctor_voodoo_restoration') != -1) {
			if(field.indexOf('heal_interval') != -1) {
				newValues = newValues.map(function(val) {
					return 0.33;
				});
			}
		} else {
			if(field.indexOf('heal_interval') != -1) {
				newValues = newValues.map(function(val) {
					return 1;
				});
			}
		}
		// Stop crazy intervals
		if(field.indexOf('interval') != -1) {
            newValues = newValues.map(function(val) {
                if(val < 0.1) {
                    return 0.1;
                }
                return val;
            });
        }
        // Abaddon's ult
       if(abilityName.indexOf('abaddon_borrowed_time') != -1) {
            if(field.indexOf('hp_threshold') != -1) {
                newValues = newValues.map(function(val) {
                    return 400;
                });
            }
            if(field.indexOf('duration') != -1) {
                newValues = newValues.map(function(val) {
                    if(val > 5) {
                        return 5;
                    }
                    return val;
                });
            }
            if(field.indexOf('duration_scepter') != -1) {
                newValues = newValues.map(function(val) {
                    if(val > 7) {
                        return 7;
                    }
                    return val
                });
            }
        }
	}

	return newValues;
});
game.hook("Dota_OnUnitParsed", onUnitParsed);
game.hook("OnGameFrame", onGameFrame);

//game.hookEvent("dota_player_learned_ability", onPlayerLearnedAbility);

console.addClientCommand("abinf", abilityInfo);
console.addClientCommand("itinf", itemInfo);

var g_Mult = 3.0;
var g_Spells = true, g_Items = true, g_Heroes = false, g_SpecText = "Spells & Items";
var replacedName = [], replaceValue = [];

function onGetAbilityValue(ability, abilityName, field, values)
{
	var fullName = abilityName + "." + field;

    if (abilityName.indexOf("item_") != -1)
    {
        if (!g_Items)
            return;
    }
    else
    {
        if (!g_Spells)
            return;
    }

	// Radius Patch
	if(field.indexOf('radius') != -1) {
		values = values.map(function(v) {
			return v * Math.sqrt(g_Mult);
		});
		return values;
	}

	values = correctArray(values);
	var oldValues = values;

	for (var i in changeParam)
	{
		if (changeParam[i][0] == fullName)
		{
			var flags = changeParam[i][1];
			var increase = flags.indexOf("inc") != -1;
			var decrease = flags.indexOf("dec") != -1;
			var chance = flags.indexOf("chance") != -1;
			var mr = flags.indexOf("mr") != -1;
			var stun = flags.indexOf("stun") != -1;
			var step = flags.indexOf("step") != -1;

			if (chance || mr)
			{
				values = chanceMult();
				values = correctArray(values);
				replaceValue[fullName] = oldValues + " => " + values;
				return values;
			}

			if (step)
			{
				values = stepMult();
				values = correctArray(values);
				replaceValue[fullName] = oldValues + " => " + values;
				return values;
			}

			values = values.map(function(v) {return boostParam(v);});
			values = correctArray(values);

			if (stun)
			{
				values = values.map(function(v) {return v * 0.75;});
				values = values.map(function(v) {return Math.min(v, 2 * g_Mult);});
				values = correctArray(values);
				replaceValue[fullName] = oldValues + " => " + values;
				return values;
			}
		}
	}

	replaceValue[fullName] = oldValues + " => " + values;

	return values;

	function chanceMult()
	{
		var cur_chance, chance;
		var count = Math.floor(g_Mult / 1) - 1, residue = (g_Mult % 1).toFixed(2);

		return values.map(function(v)
		{
			cur_chance = chance = Math.sqrt(v * v) / 100;

			for (var i = 0; i < count; i++)
				cur_chance = (cur_chance + (1 - cur_chance) * chance);

			if (residue != 0)
				cur_chance = (cur_chance + (1 - cur_chance) * (chance * residue));

			cur_chance *= 100;

			if (v < 0) cur_chance * -1;

			return cur_chance;
		});
	}

	function stepMult()
	{
		var fv = 1488, pv, rv, av;
		return values.map(function(v)
		{
			if (fv == 1488)
			{
				rv = pv = v;
				av = fv = boostParam(rv);
				return fv;
			}

			rv = v - pv;
			pv = v;
			av += rv;

			return av;
		});
	}

	function boostParam(v)
	{
		if (increase)
			v *= g_Mult;

		if (decrease)
			v /= g_Mult;

		if (v % 1 == 0)
			v = Math.round(v);
		else
			v = v.toFixed(2);

		return v;
	}

	function correctArray(arr)
	{
		return arr.map(function(v)
		{
			if (typeof v != "number")
			{
				v = parseFloat(v);

				if (typeof v != "number")
					return v;
			}

			if (v % 1 == 0)
				return Math.round(v);
			else
				return v.toFixed(2);
		});
	}
}

function onUnitParsed(unit, keyvalues)
{
	if (!unit || !unit.isValid()) return;

	// There needs to be caps
	var uScaler = g_Mult;
	if(capSkills) {
		uScaler = Math.min(g_Mult, 10);
	}

	var name = unit.getClassname();
	var modelPath = "type: string " + keyvalues["Model"];

	if (g_Spells)
	{
		for (var i in spellSummoned)
		{
			if (modelPath.indexOf(spellSummoned[i]) != -1)
			{
				keyvalues["ArmorPhysical"] *= g_Mult;
				keyvalues["AttackDamageMin"] *= g_Mult;
				keyvalues["AttackDamageMax"] *= g_Mult;
				//keyvalues["AttackRate"] -= (0.20 * g_Mult);
				//keyvalues["MovementSpeed"] += (20 * g_Mult);
				keyvalues["StatusHealth"] *= uScaler;
				keyvalues["StatusHealthRegen"] *= uScaler;
				keyvalues["StatusMana"] *= uScaler;
				keyvalues["StatusManaRegen"] *= uScaler;

				return;
			}
		}
	}

	if (g_Items)
	{
		for (var i in itemSummoned)
		{
			if (modelPath.indexOf(spellSummoned[i]) != -1)
			{
				keyvalues["ArmorPhysical"] *= g_Mult;
				keyvalues["AttackDamageMin"] *= g_Mult;
				keyvalues["AttackDamageMax"] *= g_Mult;
				//keyvalues["AttackRate"] -= (0.20 * g_Mult);
				//keyvalues["MovementSpeed"] += (20 * g_Mult);
				keyvalues["StatusHealth"] *= uScaler;
				keyvalues["StatusHealthRegen"] *= uScaler;
				keyvalues["StatusMana"] *= uScaler;
				keyvalues["StatusManaRegen"] *= uScaler;

				return;
			}
		}
	}

	if (g_Heroes)
	{
		if (name.indexOf("npc_dota_hero") != -1)
		{
			keyvalues["AttributeBaseStrength"] *= uScaler;
			keyvalues["AttributeBaseAgility"] *= uScaler;
			keyvalues["AttributeBaseIntelligence"] *= uScaler;

			keyvalues["AttributeStrengthGain"] *= uScaler;
			keyvalues["AttributeAgilityGain"] *= uScaler;
			keyvalues["AttributeIntelligenceGain"] *= uScaler;

			return;
		}
	}

	if(scaleBuildings) {
		// Scale units
		if(name.indexOf('building') != -1 || name.indexOf('tower') != -1 || name.indexOf('fort') != -1) {
			keyvalues["AttackDamageMin"] *= g_Mult;
			keyvalues["AttackDamageMax"] *= g_Mult;
			keyvalues["StatusHealth"] *= g_Mult;
			return;
		}
	}

	if(scaleCreeps) {
		// Scale units
		if(name.indexOf('creep') != -1 || name.indexOf('siege') != -1 || name.indexOf('neutral') != -1 || name.indexOf('roshan') != -1) {
			keyvalues["AttackDamageMin"] *= g_Mult;
			keyvalues["AttackDamageMax"] *= g_Mult;
			keyvalues["StatusHealth"] *= g_Mult;
			return;
		}
	}
}

function abilityInfo(client, args)
{
	var hero = client.netprops.m_hAssignedHero;
	if (!hero)
		return;

	if (args.length != 1)
	{
		client.printToChat("Wrong format, use \"-abinf #\".");
		return;
	}

	var slot = parseInt(args[0]);
	if (isNaN(slot))
	{
		client.printToChat("Wrong format, \"#\" should be a number.");
		return;
	}

	slot--;
	if (slot < 0 || slot > 3)
	{
		client.printToChat("Wrong format, use a value between 1 and 4.");
		return;
	}

	var ability = hero.netprops.m_hAbilities[slot];
	if (!ability)
		return;

	var abilityName = ability.getClassname();
	client.printToChat(abilityName + ":");

	var paramCount = 0;
	for (var i in replaceValue)
	{
		if (i.indexOf(abilityName) != -1)
		{
			client.printToChat(i.substr(i.indexOf(".") + 1) + " " + replaceValue[i]);
			paramCount++;
		}
	}

	client.printToChat(" ");

	if (paramCount == 0)
		client.printToChat("You need to use the ability of at least one time to get the information.");
	else
		client.printToChat("Think should be different? SAY! All info in plugin page.");
}

function itemInfo(client, args)
{
	var hero = client.netprops.m_hAssignedHero;
	if (!hero)
		return;

	if (args.length != 1)
	{
		client.printToChat("Wrong format, use \"-itinf #\".");
		return;
	}

	var slot = Number(args[0]);
	if (isNaN(slot))
	{
		client.printToChat("Wrong format, \"#\" should be a number.");
		return;
	}

	slot--;
	if (slot < 0 || slot > 5)
	{
		client.printToChat("Wrong format, use a value between 1 and 6.");
		return;
	}

	var item = hero.netprops.m_hItems[slot];
	if (!item)
	{
		client.printToChat("In this slot nothing.");
		return;
	}

	var itemName = item.getClassname();
	client.printToChat(itemName + ":");

	client.printToChat(" ");

	for (var i in replaceValue)
	{
		if (i.indexOf(itemName) != -1)
			client.printToChat(i.substr(i.indexOf(".") + 1) + " " + replaceValue[i]);
	}
}

plugin.get("LobbyManager", function(lobbyManager)
{
	var options = lobbyManager.getOptionsForPlugin("CustomSpellPower");

	// Validate options, SIGH
	if(!options || !options["Multiplier"] || !options["Spec"] || !options['Skill Caps'] || !options['Scale Shit']) {
		return;
	}

	g_Mult = parseFloat(options["Multiplier"].replace('x', ''));

	g_SpecText = options["Spec"];

	g_Spells = g_SpecText.indexOf("Spells") != -1;
	g_Items = g_SpecText.indexOf("Items") != -1;
	g_Heroes = g_SpecText.indexOf("Heroes") != -1;

	switch(options['Skill Caps']) {
		case 'Don\'t Cap Skills':
			capSkills = false;
		break;

		default:
			capSkills = true;
		break;
	}

	// Grab Courier option
	switch(options['Starting Courier']) {
		case 'Free Flying Courier':
			freeCourier = true;
			flyingCourier = true;
		break;

		case 'Free Waking Courier':
			freeCourier = true;
			flyingCourier = false;
		break;

		case 'No Free Courier':
			freeCourier = false;
			flyingCourier = false;
		break;
	}

	// Scaling of other shit
	switch(options['Scale Shit']) {
		case 'Scale Buildings & Creeps':
			scaleBuildings = true;
			scaleCreeps = true;
		break;

		case 'Scale Buildings':
			scaleBuildings = true;
			scaleCreeps = false;
		break;

		case 'Scale Creeps':
			scaleBuildings = false;
			scaleCreeps = true;
		break;

		case 'Don\'t Scale Buildings or Creeps':
			scaleBuildings = false;
			scaleCreeps = false;
		break;
	}

	// Disable Fountain Camping
	switch(options['Fountain Camping']) {
		case 'Disable Fountain Camping':
			fountainCamping = false;
		break;

		case 'Enable Fountain Camping':
			fountainCamping = true;
		break;
	}
});

// Check if fountain camping os iff
if(!fountainCamping) {
	game.hook('OnMapStart', function() {
		// Find all fountains
		var fountains = game.findEntitiesByClassname('ent_dota_fountain');

		for(i=0; i<fountains.length; i++) {
			var fountain = fountains[i];

			// Give this fountain a MKB
			var truestrike = dota.createAbility(fountain, "item_monkey_king_bar");
			dota.addNewModifier(fountain, truestrike, "modifier_item_monkey_king_bar", "item_monkey_king_bar", {}, fountain);

			// Give this fountain ursa's fury swipes
			var swipes = dota.createAbility(fountain, 'ursa_fury_swipes');
			for(j=0;j<4;j++) dota.upgradeAbility(swipes);
			dota.addNewModifier(fountain, swipes, "modifier_ursa_fury_swipes", "ursa_fury_swipes", {}, fountain);

			// Give this fountain SB's knock back
			var bash = dota.createAbility(fountain, 'spirit_breaker_greater_bash');
			for(j=0;j<4;j++) dota.upgradeAbility(bash);
			dota.addNewModifier(fountain, bash, "modifier_spirit_breaker_greater_bash", "spirit_breaker_greater_bash", {}, fountain);

			// Give this PSI Blades
			var blades = dota.createAbility(fountain, 'templar_assassin_psi_blades');
			for(j=0;j<4;j++) dota.upgradeAbility(blades);
			dota.addNewModifier(fountain, blades, "modifier_templar_assassin_psi_blades", "templar_assassin_psi_blades", {}, fountain);
		}

		// Preload ursa's particles
		dota.loadParticleFile('particles/units/heroes/hero_ursa.pcf');
		dota.loadParticleFile('particles/units/heroes/hero_spirit_breaker.pcf');
		dota.loadParticleFile('particles/units/heroes/hero_templar_assassin.pcf');
	});
}

// Free couriers
var gottenCouriers = {};
game.hook("Dota_OnHeroSpawn", function(hero) {
	// Check if players should get a free courier
	if(freeCourier) {
		// We have to wait a moment before giving the courier
		timers.setTimeout(function() {
			// Check if the hero is valid
			if(!hero || !hero.isValid()) return;

			// Check if we've already gotten a courier
			if(gottenCouriers[hero.netprops.m_iTeamNum]) return;

			// Check if this hero has space
			var hasSpace = false;
			for(var i=0; i<6; i++) {
				if(hero.netprops.m_hItems[i] == null) {
					hasSpace = true;
					break;
				}
			}

			// Only a hero with space can do this
			if(!hasSpace) return;

			// Spawn a courier
			var item = dota.giveItemToHero('item_courier', hero);

			dota.executeOrders(hero.netprops.m_iPlayerID, dota.ORDER_TYPE_CAST_ABILITY_NO_TARGET, [hero], null, item, false, {x:0, y:0, z:0});

			// Stop sellage
			item.netprops.m_bSellable = 0;

			// Upgrade it
			if(flyingCourier) {
				item = dota.giveItemToHero('item_flying_courier', hero);
				item.netprops.m_bSellable = 0;
			}

			// Store that this team now has a courier
			gottenCouriers[hero.netprops.m_iTeamNum] = true;
		}, 1000);
	}
});

var msgPrinted = false;
function onGameFrame()
{
	if (msgPrinted)
		return;

	if (game.rules.props.m_nGameState == dota.STATE_GAME_IN_PROGRESS)
	{
		printToAll("[CSP] Custom Spell Power by \x0CSkino\x06.");
		printToAll("[CSP] Found bug? Write in feedback page.");
		printToAll("[CSP] Type \"-abinf #\" or \"-itinf #\" to get power info.");
		printToAll("[CSP] Modes: Multiplier(\x12x" + g_Mult + "\x06), Spec(\x12" + g_SpecText + "\x06).");

		msgPrinted = true;
	}
}

function printToAll(string)
{
	var clients = getClients();
	for (var i = 0; i < clients.length; i++)
		clients[i].printToChat(string);
}

function getClients()
{
	playing = [];

	for (var i = 0; i < server.clients.length; i++)
	{
		var client = server.clients[i];
		if (!client)
			continue;

		if (!client.isInGame())
			continue;

		if (client.netprops.m_iplayerID == -1)
			continue;

		playing.push(client);
	}

	return playing;
}

var spellSummoned =
[
	"spirit_bear",
	"visage_familiar",
	"summon_wolves",
	"venomancer_ward",
	"shadowshaman_totem",
	"pugna_ward",
	"undying_tower",
	"warlock_demon",
	"spiderling",
	"treant",
	"lanaya_trap_crystal_invis",
	"rattletrap_cog",
	"weaver_bug",
	"gyro_missile",
	"beastmaster_bird",
	"beastmaster_beast",
	"witchdoctor_ward",
	"undying_minion",
	"eidelon"
]

var itemSummoned =
[
	"necro_warrior",
	"necro_archer"
]

var changeParam =
[
	["attribute_bonus.attribute_bonus_per_level", "inc"],
	["antimage_mana_break.damage_per_burn", "inc, dmg"],
	["antimage_blink.blink_range", "inc, dst"],
	//["antimage_blink.min_blink_range", "inc, dst"],
	["antimage_spell_shield.spell_shield_resistance", "inc, mr"],
	["antimage_mana_void.mana_void_damage_per_mana", "inc, dmg"],
	["antimage_mana_void.mana_void_ministun", "inc, stun, dur"],
	["antimage_mana_void.mana_void_aoe_radius", "inc, dst"],
	["axe_berserkers_call.radius", "inc, dst"],
	["axe_berserkers_call.bonus_armor", "inc"],
	["axe_berserkers_call.duration", "inc, dur"],
	["axe_battle_hunger.duration", "inc, dur"],
	["axe_battle_hunger.slow", "inc"],
	["axe_battle_hunger.speed_bonus", "inc"],
	["axe_counter_helix.radius", "inc, dst"],
	["axe_culling_blade.kill_threshold", "inc"],
	["axe_culling_blade.damage", "inc, dmg"],
	["axe_culling_blade.speed_bonus", "inc"],
	["axe_culling_blade.speed_duration", "inc, dur"],
	["axe_culling_blade.speed_aoe", "inc, dst"],
	["bane_enfeeble.enfeeble_attack_reduction", "inc"],
	["bane_fiends_grip.fiend_grip_duration", "inc, dur"],
	["bane_fiends_grip.fiend_grip_damage", "inc, dmg"],
	["bane_fiends_grip.fiend_grip_duration_scepter", "inc, dur"],
	["bane_fiends_grip.fiend_grip_damage_scepter", "inc, dmg"],
	["bane_nightmare.duration", "inc, dur"],
	["bloodseeker_bloodrage.duration", "inc, dur"],
	["bloodseeker_bloodrage.damage_increase_pct", "inc, dmg"],
	["bloodseeker_blood_bath.health_bonus_pct", "inc"],
	["bloodseeker_blood_bath.health_bonus_creep_pct", "inc"],
	["bloodseeker_blood_bath.damage_assist_factor", "inc, dmg"],
	["bloodseeker_blood_bath.damage_assist_aoe", "inc, dst"],
	["bloodseeker_thirst.radius", "inc, dst"],
	["bloodseeker_thirst.visibility_threshold_pct", "inc"],
	["bloodseeker_thirst.bonus_movement_speed", "inc"],
	["bloodseeker_thirst.invis_threshold_pct", "inc"],
	["bloodseeker_thirst.armor_bonus", "inc"],
	["bloodseeker_rupture.duration", "inc, dur"],
	["bloodseeker_rupture.movement_damage_pct", "inc, dmg"],
	["bloodseeker_rupture.damage_cap_amount", "inc, dmg"],
	["drow_ranger_frost_arrows.frost_arrows_creep_duration", "inc, dur"],
	["drow_ranger_silence.silence_radius", "inc, dst"],
	["drow_ranger_silence.duration", "inc, dur"],
	["drow_ranger_trueshot.trueshot_ranged_damage", "inc, dst"],
	["drow_ranger_marksmanship.marksmanship_agility_bonus", "inc"],
	//["drow_ranger_marksmanship.radius", "inc, dst"],
	["earthshaker_fissure.fissure_duration", "inc, dur"],
	["earthshaker_fissure.fissure_radius", "inc, dst"],
	["earthshaker_fissure.stun_duration", "inc, stun, dur"],
	["earthshaker_enchant_totem.totem_damage_percentage", "inc, dmg"],
	["earthshaker_aftershock.aftershock_range", "inc, dst"],
	["earthshaker_echo_slam.echo_slam_damage_range", "inc, dst"],
	["earthshaker_echo_slam.echo_slam_echo_search_range", "inc, dst"],
	["earthshaker_echo_slam.echo_slam_echo_range", "inc, dst"],
	["earthshaker_echo_slam.echo_slam_echo_damage", "inc, dmg"],
	["juggernaut_blade_fury.blade_fury_damage_tick", "inc, dmg"],
	["juggernaut_blade_fury.blade_fury_radius", "inc, dst"],
	["juggernaut_healing_ward.healing_ward_heal_amount", "inc"],
	["juggernaut_healing_ward.healing_ward_aura_radius", "inc, dst"],
	["juggernaut_omni_slash.omni_slash_damage", "inc, dmg"],
	["juggernaut_omni_slash.omni_slash_jumps", "inc"],
	["juggernaut_omni_slash.omni_slash_jumps_scepter", "inc"],
	["juggernaut_omni_slash.omni_slash_radius", "inc, dst"],
	["kunkka_torrent.radius", "inc, dst"],
	["kunkka_torrent.movespeed_bonus", "inc"],
	["kunkka_torrent.slow_duration", "inc, dur"],
	["kunkka_torrent.stun_duration", "inc, stun, dur"],
	["kunkka_tidebringer.radius", "inc, dst"],
	["kunkka_tidebringer.damage_bonus", "inc, dmg"],
	["kunkka_x_marks_the_spot.duration", "inc, dur"],
	//["kunkka_ghostship.ghostship_distance", "inc, dst"],
	["kunkka_ghostship.stun_duration", "inc, stun, dur"],
	["kunkka_ghostship.movespeed_bonus", "inc"],
	["kunkka_ghostship.buff_duration", "inc, dur"],
	//["kunkka_ghostship.ghostship_width", "inc, dst"],
	["lina_dragon_slave.dragon_slave_distance", "inc, dst"],
	["lina_light_strike_array.light_strike_array_aoe", "inc, dst"],
	["lina_light_strike_array.light_strike_array_stun_duration", "inc, stun, dur"],
	["lina_fiery_soul.fiery_soul_attack_speed_bonus", "inc"],
	["lina_fiery_soul.fiery_soul_move_speed_bonus", "inc"],
	["lina_fiery_soul.fiery_soul_max_stacks", "inc"],
	["lina_laguna_blade.damage", "inc, dmg"],
	["lina_laguna_blade.damage_scepter", "inc, dmg"],
	["lina_laguna_blade.cast_range_scepter", "inc, dst"],
	["lion_impale.duration", "inc, dur"],
	["lion_voodoo.duration", "inc, dur"],
	["lion_mana_drain.duration", "inc, dur"],
	["lion_mana_drain.break_distance", "inc, dst"],
	["lion_finger_of_death.damage", "inc, dmg"],
	["lion_finger_of_death.damage_scepter", "inc, dmg"],
	["mirana_arrow.arrow_range", "inc, dst"],
	["mirana_arrow.arrow_max_stunrange", "inc, stun, dur"],
	["mirana_arrow.arrow_min_stun", "inc, stun, dur"],
	["mirana_arrow.arrow_max_stun", "inc, stun, dur"],
	["mirana_arrow.arrow_bonus_damage", "inc, dmg"],
	["mirana_invis.fade_delay", "dec"],
	["mirana_invis.duration", "inc, dur"],
	["mirana_leap.leap_distance", "inc, dst"],
	["mirana_leap.leap_radius", "inc, dst"],
	["mirana_leap.leap_speedbonus", "inc"],
	["mirana_starfall.starfall_radius", "inc, dst"],
	["mirana_starfall.starfall_secondary_radius", "inc, dst"],
	["morphling_adaptive_strike.stun_min", "inc, stun, dur"],
	["morphling_adaptive_strike.stun_max", "inc, stun, dur"],
	["morphling_adaptive_strike.damage_min", "inc, dmg"],
	["morphling_adaptive_strike.damage_max", "inc, dmg"],
	["morphling_adaptive_strike.knockback_min", "inc"],
	["morphling_adaptive_strike.knockback_max", "inc"],
	["morphling_adaptive_strike.damage_base", "inc, dmg"],
	["morphling_morph.bonus_attributes", "inc"],
	["morphling_morph_agi.points_per_tick", "inc"],
	["morphling_morph_agi.bonus_attributes", "inc"],
	["morphling_morph_str.points_per_tick", "inc"],
	["morphling_morph_str.bonus_attributes", "inc"],
	["morphling_replicate.duration", "inc, dur"],
	["nevermore_shadowraze1.shadowraze_radius", "inc, dst"],
	["nevermore_shadowraze1.shadowraze_range", "inc, dst"],
	["nevermore_shadowraze2.shadowraze_radius", "inc, dst"],
	["nevermore_shadowraze2.shadowraze_range", "inc, dst"],
	["nevermore_shadowraze3.shadowraze_radius", "inc, dst"],
	["nevermore_shadowraze3.shadowraze_range", "inc, dst"],
	["nevermore_necromastery.necromastery_damage_per_soul", "inc, dmg"],
	["nevermore_necromastery.necromastery_max_souls", "inc"],
	["nevermore_necromastery.necromastery_souls_hero_bonus", "inc"],
	["nevermore_dark_lord.presence_armor_reduction", "inc"],
	["nevermore_dark_lord.presence_radius", "inc, dst"],
	["nevermore_requiem.requiem_radius", "inc, dst"],
	["nevermore_requiem.requiem_reduction_ms", "inc"],
	["nevermore_requiem.requiem_reduction_damage", "inc, dmg"],
	["nevermore_requiem.requiem_reduction_radius", "inc, dst"],
	["phantom_lancer_spirit_lance.duration", "inc, dur"],
	["phantom_lancer_spirit_lance.illusion_duration", "inc, dur"],
	["phantom_lancer_spirit_lance.fake_lance_distance", "inc, dst"],
	["phantom_lancer_doppelwalk.duration", "inc, dur"],
	["phantom_lancer_doppelwalk.illusion_duration", "inc, dur"],
	["phantom_lancer_juxtapose.max_illusions", "inc"],
	["phantom_lancer_juxtapose.illusion_duration", "inc, dur"],
	["phantom_lancer_phantom_edge.magic_resistance_pct", "inc, mr"],
	["phantom_lancer_phantom_edge.juxtapose_bonus", "inc"],
	["puck_illusory_orb.radius", "inc, dst"],
	["puck_illusory_orb.max_distance", "inc, dst"],
	["puck_waning_rift.radius", "inc, dst"],
	["puck_waning_rift.silence_duration", "inc, dur"],
	["puck_phase_shift.duration", "inc, dur"],
	["puck_dream_coil.stun_duration", "inc, stun, dur"],
	["puck_dream_coil.coil_stun_duration", "inc, stun, dur"],
	["puck_dream_coil.coil_radius", "inc, dst"],
	["puck_dream_coil.coil_break_radius", "inc, dst"],
	["puck_dream_coil.coil_duration", "inc, dur"],
	["puck_dream_coil.coil_break_damage", "inc, dmg"],
	["puck_dream_coil.coil_duration_scepter", "inc, dur"],
	["puck_dream_coil.coil_break_damage_scepter", "inc, dmg"],
	["pudge_flesh_heap.flesh_heap_strength_buff_amount", "inc"],
	["pudge_flesh_heap.flesh_heap_range", "inc, dst"],
	["pudge_meat_hook.hook_distance", "inc, dst"],
	["pudge_rot.rot_radius", "inc, dst"],
	["pudge_rot.rot_slow", "inc"],
	["pudge_dismember.dismember_damage", "inc, dmg"],
	["pudge_dismember.strength_damage_scepter", "inc, dmg"],
	["shadow_shaman_ether_shock.start_radius", "inc, dst"],
	["shadow_shaman_ether_shock.end_radius", "inc, dst"],
	["shadow_shaman_ether_shock.end_distance", "inc, dst"],
	["shadow_shaman_voodoo.duration", "inc, dur"],
	["shadow_shaman_shackles.total_damage", "inc, dmg"],
	["shadow_shaman_mass_serpent_ward.ward_count", "inc"],
	["shadow_shaman_mass_serpent_ward.full_splash_radius", "inc, dst"],
	["shadow_shaman_mass_serpent_ward.mid_splash_radius", "inc, dst"],
	["shadow_shaman_mass_serpent_ward.min_splash_radius", "inc, dst"],
	["shadow_shaman_mass_serpent_ward.damage_min", "inc, dmg"],
	["shadow_shaman_mass_serpent_ward.damage_max", "inc, dmg"],
	["shadow_shaman_mass_serpent_ward.duration", "inc, dur"],
	["shadow_shaman_mass_serpent_ward.damage_min_scepter", "inc, dmg"],
	["shadow_shaman_mass_serpent_ward.damage_max_scepter", "inc, dmg"],
	["razor_plasma_field.damage_min", "inc, dmg"],
	["razor_plasma_field.damage_max", "inc, dmg"],
	["razor_plasma_field.radius", "inc, dst"],
	["razor_static_link.drain_duration", "inc, dur"],
	["razor_static_link.drain_range", "inc, dst"],
	["razor_static_link.radius", "inc, dst"],
	["razor_unstable_current.slow_duration", "inc, dur"],
	["razor_unstable_current.pause_duration", "inc, dur"],
	["razor_unstable_current.slow_amount", "inc"],
	["razor_eye_of_the_storm.radius", "inc, dst"],
	["razor_eye_of_the_storm.duration", "inc, dur"],
	["razor_eye_of_the_storm.armor_reduction", "inc"],
	["razor_eye_of_the_storm.damage", "inc, dmg"],
	["skeleton_king_hellfire_blast.blast_stun_duration", "inc, stun, dur"],
	["skeleton_king_hellfire_blast.blast_slow", "inc"],
	["skeleton_king_hellfire_blast.blast_dot_duration", "inc, dur"],
	["skeleton_king_hellfire_blast.blast_dot_damage", "inc, dmg"],
	["skeleton_king_vampiric_aura.vampiric_aura_radius", "inc, dst"],
	["skeleton_king_mortal_strike.hp_drain", "inc"],
	["skeleton_king_mortal_strike.drain_duration", "inc, dur"],
	["skeleton_king_reincarnation.slow_radius", "inc, dst"],
	["skeleton_king_reincarnation.slow_duration", "inc, dur"],
	["death_prophet_carrion_swarm.start_radius", "inc, dst"],
	["death_prophet_carrion_swarm.end_radius", "inc, dst"],
	["death_prophet_carrion_swarm.range", "inc, dst"],
	["death_prophet_silence.radius", "inc, dst"],
	["death_prophet_silence.duration", "inc, dur"],
	["death_prophet_witchcraft.bonus_movement_speed", "inc"],
	["death_prophet_witchcraft.exorcism_1_extra_spirits", "inc"],
	["death_prophet_witchcraft.exorcism_2_extra_spirits", "inc"],
	["death_prophet_witchcraft.exorcism_3_extra_spirits", "inc"],
	["death_prophet_exorcism.radius", "inc, dst"],
	["death_prophet_exorcism.spirits", "inc"],
	["death_prophet_exorcism.max_distance", "inc, dst"],
	["death_prophet_exorcism.give_up_distance", "inc, dst"],
	["death_prophet_exorcism.min_damage", "inc, dmg"],
	["death_prophet_exorcism.max_damage", "inc, dmg"],
	["death_prophet_exorcism.heal_percent", "inc"],
	["death_prophet_exorcism.average_damage", "inc, dmg"],
	["sven_storm_bolt.bolt_stun_duration", "inc, stun, dur"],
	["sven_storm_bolt.bolt_aoe", "inc, dst"],
	["sven_great_cleave.great_cleave_radius", "inc, dst"],
	["sven_great_cleave.great_cleave_damage", "inc, dmg"],
	["sven_warcry.warcry_armor", "inc"],
	["sven_warcry.warcry_radius", "inc, dst"],
	["sven_gods_strength.gods_strength_damage", "inc, dmg"],
	["storm_spirit_static_remnant.static_remnant_radius", "inc, dst"],
	["storm_spirit_static_remnant.static_remnant_damage_radius", "inc, dst"],
	["storm_spirit_electric_vortex.electric_vortex_pull_tether_range", "inc, dst"],
	["storm_spirit_electric_vortex.electric_vortex_self_slow", "dec"],
	["storm_spirit_electric_vortex.electric_vortex_self_slow_duration", "dec, dur"],
	["storm_spirit_electric_vortex.duration", "inc, dur"],
	["storm_spirit_overload.overload_aoe", "inc, dst"],
	["storm_spirit_overload.overload_move_slow", "inc"],
	["storm_spirit_overload.overload_attack_slow", "inc"],
	["storm_spirit_ball_lightning.ball_lightning_aoe", "inc, dst"],
	["sandking_burrowstrike.burrow_duration", "inc, dur"],
	["sandking_sand_storm.sand_storm_radius", "inc, dst"],
	["sandking_caustic_finale.caustic_finale_radius", "inc, dst"],
	["sandking_caustic_finale.caustic_finale_damage", "inc, dmg"],
	["sandking_caustic_finale.caustic_finale_duration", "inc, dur"],
	["sandking_epicenter.epicenter_radius", "inc, dst"],
	["sandking_epicenter.epicenter_damage", "inc, dmg"],
	["sandking_epicenter.epicenter_slow", "inc"],
	["tiny_avalanche.radius", "inc, dst"],
	["tiny_avalanche.stun_duration", "inc, stun, dur"],
	["tiny_avalanche.projectile_duration", "inc, dur"],
	["tiny_toss.duration", "inc, dur"],
	["tiny_toss.grab_radius", "inc, dst"],
	["tiny_toss.radius", "inc, dst"],
	["tiny_toss.bonus_damage_pct", "inc, dmg"],
	["tiny_toss.grow_bonus_damage_pct", "inc, dmg"],
	["tiny_toss.toss_damage", "inc, dmg"],
	["tiny_craggy_exterior.stun_chance", "inc, chance"],
	["tiny_craggy_exterior.stun_duration", "inc, stun, dur"],
	["tiny_craggy_exterior.bonus_armor", "inc"],
	["tiny_craggy_exterior.radius", "inc, dst"],
	["tiny_grow.bonus_damage", "inc, dmg, step"],
	//["tiny_grow.bonus_attack_speed", "inc, step"],
	//["tiny_grow.bonus_movement_speed", "inc"],
	//["tiny_grow.grow_bonus_damage_pct", "inc, dmg"],
	//["tiny_grow.bonus_range_scepter", "inc, dst"],
	//["tiny_grow.bonus_cleave_radius_scepter", "inc, dst"],
	//["tiny_grow.bonus_cleave_damage_scepter", "inc, dmg"],
	//["tiny_grow.bonus_building_damage_scepter", "inc, dmg"],
	//["tiny_grow.grow_bonus_damage_pct_scepter", "inc, dmg"],
	["zuus_arc_lightning.radius", "inc, dst"],
	["zuus_arc_lightning.jump_count", "inc"],
	["zuus_lightning_bolt.true_sight_radius", "inc, dst"],
	["zuus_lightning_bolt.sight_radius_day", "inc, dst"],
	["zuus_lightning_bolt.sight_radius_night", "inc, dst"],
	["zuus_lightning_bolt.sight_duration", "inc, dur"],
	["zuus_static_field.radius", "inc, dst"],
	["zuus_static_field.damage_health_pct", "inc, dmg"],
	["zuus_thundergods_wrath.true_sight_radius", "inc, dst"],
	["zuus_thundergods_wrath.sight_radius_day", "inc, dst"],
	["zuus_thundergods_wrath.sight_radius_night", "inc, dst"],
	["zuus_thundergods_wrath.sight_duration", "inc, dur"],
	["zuus_thundergods_wrath.damage", "inc, dmg"],
	["zuus_thundergods_wrath.damage_scepter", "inc, dmg"],
	["slardar_sprint.bonus_damage", "inc, dmg"],
	["slardar_sprint.bonus_speed", "inc"],
	["slardar_sprint.duration", "inc, dur"],
	["slardar_slithereen_crush.crush_radius", "inc, dst"],
	["slardar_slithereen_crush.crush_extra_slow", "inc"],
	["slardar_slithereen_crush.crush_extra_slow_duration", "inc, dur"],
	["slardar_slithereen_crush.stun_duration", "inc, stun, dur"],
	["slardar_bash.bonus_damage", "inc, dmg"],
	["slardar_bash.duration", "inc, dur"],
	["slardar_bash.duration_creep", "inc, dur"],
	["slardar_amplify_damage.armor_reduction", "inc"],
	["slardar_amplify_damage.duration", "inc, dur"],
	["tidehunter_gush.armor_bonus", "inc"],
	["tidehunter_kraken_shell.damage_reduction", "inc, dmg"],
	["tidehunter_kraken_shell.damage_cleanse", "inc, dmg"],
	["tidehunter_anchor_smash.damage_reduction", "inc, dmg"],
	["tidehunter_anchor_smash.reduction_duration", "inc, dur"],
	["tidehunter_anchor_smash.radius", "inc, dst"],
	["tidehunter_ravage.radius", "inc, dst"],
	["tidehunter_ravage.duration", "inc, dur"],
	["vengefulspirit_command_aura.aura_radius", "inc, dst"],
	["vengefulspirit_command_aura.bonus_damage_pct", "inc, dmg"],
	["vengefulspirit_wave_of_terror.armor_reduction", "inc"],
	["crystal_maiden_crystal_nova.duration", "inc, dur"],
	["crystal_maiden_crystal_nova.radius", "inc, dst"],
	["crystal_maiden_crystal_nova.movespeed_slow", "inc"],
	["crystal_maiden_crystal_nova.attackspeed_slow", "inc"],
	["crystal_maiden_frostbite.duration", "inc, dur"],
	["crystal_maiden_frostbite.creep_duration", "inc, dur"],
	["crystal_maiden_frostbite.creep_duration", "inc, dur"],
	["crystal_maiden_brilliance_aura.mana_regen", "inc"],
	["crystal_maiden_freezing_field.radius", "inc, dst"],
	["crystal_maiden_freezing_field.explosion_radius", "inc, dst"],
	["crystal_maiden_freezing_field.movespeed_slow", "inc"],
	["crystal_maiden_freezing_field.attack_slow", "inc"],
	["crystal_maiden_freezing_field.slow_duration", "inc, dur"],
	["crystal_maiden_freezing_field.explosion_min_dist", "inc"],
	["crystal_maiden_freezing_field.explosion_max_dist", "inc"],
	["crystal_maiden_freezing_field.damage", "inc, dmg"],
	["crystal_maiden_freezing_field.damage_scepter", "inc, dmg"],
	["crystal_maiden_freezing_field.attack_slow_scepter", "inc"],
	["windrunner_shackleshot.fail_stun_duration", "inc, stun, dur"],
	["windrunner_shackleshot.stun_duration", "inc, stun, dur"],
	["windrunner_shackleshot.shackle_distance", "inc, dst"],
	["windrunner_powershot.damage_reduction", "inc, dmg"],
	["windrunner_powershot.speed_reduction", "inc"],
	["windrunner_powershot.arrow_range", "inc, dst"],
	["windrunner_windrun.movespeed_bonus_pct", "inc"],
	["windrunner_windrun.enemy_movespeed_bonus_pct", "inc"],
	["windrunner_windrun.radius", "inc, dst"],
	["windrunner_windrun.duration", "inc, dur"],
	["windrunner_focusfire.focusfire_damage_reduction", "inc, dmg"],
	["lich_frost_nova.aoe_damage", "inc, dst"],
	["lich_frost_nova.radius", "inc, dst"],
	["lich_frost_nova.slow_movement_speed", "inc"],
	["lich_frost_nova.slow_attack_speed", "inc"],
	["lich_frost_armor.armor_bonus", "inc"],
	["lich_frost_armor.slow_duration", "inc, dur"],
	["lich_frost_armor.slow_movement_speed", "inc"],
	["lich_frost_armor.slow_attack_speed", "inc"],
	["lich_dark_ritual.health_conversion", "inc"],
	["lich_chain_frost.slow_duration", "inc, dur"],
	["lich_chain_frost.slow_movement_speed", "inc"],
	["lich_chain_frost.slow_attack_speed", "inc"],
	["lich_chain_frost.jump_range", "inc, dst"],
	["lich_chain_frost.damage", "inc, dmg"],
	["lich_chain_frost.damage_scepter", "inc, dmg"],
	["lich_chain_frost.cast_range_scepter", "inc, dst"],
	["witch_doctor_paralyzing_cask.hero_duration", "inc, dur"],
	["witch_doctor_paralyzing_cask.creep_duration", "inc, dur"],
	["witch_doctor_paralyzing_cask.hero_damage", "inc, dmg"],
	["witch_doctor_paralyzing_cask.bounce_range", "inc, dst"],
	["witch_doctor_voodoo_restoration.radius", "inc, dst"],
	["witch_doctor_voodoo_restoration.heal", "inc"],
	["witch_doctor_maledict.bonus_damage", "inc, dmg"],
	["witch_doctor_maledict.bonus_damage_threshold", "inc, dmg"],
	["witch_doctor_maledict.radius", "inc, dst"],
	["witch_doctor_death_ward.damage", "inc, dmg"],
	["witch_doctor_death_ward.damage_scepter", "inc, dmg"],
	["witch_doctor_death_ward.bounce_radius", "inc, dst"],
	["riki_smoke_screen.radius", "inc, dst"],
	["riki_smoke_screen.movement_speed_reduction", "inc"],
	["riki_smoke_screen.attack_speed_reduction", "inc"],
	["riki_backstab.damage_multiplier", "inc, dmg"],
	["riki_permanent_invisibility.fade_time", "dec"],
	["riki_permanent_invisibility.fade_delay", "dec"],
	["enigma_malefice.stun_duration", "inc, stun, dur"],
	["enigma_malefice.damage", "inc, dmg"],
	["enigma_malefice.duration", "inc, dur"],
	["enigma_demonic_conversion.spawn_count", "inc"],
	["enigma_demonic_conversion.split_attack_count", "inc"],
	["enigma_midnight_pulse.radius", "inc, dst"],
	["enigma_midnight_pulse.damage_percent", "inc, dmg"],
	["enigma_midnight_pulse.duration", "inc, dur"],
	["enigma_black_hole.pull_radius", "inc, dst"],
	["enigma_black_hole.far_radius", "inc, dst"],
	["enigma_black_hole.near_radius", "inc, dst"],
	["enigma_black_hole.far_damage", "inc, dmg"],
	["enigma_black_hole.near_damage", "inc, dmg"],
	["enigma_black_hole.duration", "inc, dur"],
	["tinker_laser.duration_hero", "inc, dur"],
	["tinker_laser.duration_creep", "inc, dur"],
	["tinker_heat_seeking_missile.radius", "inc, dst"],
	["tinker_march_of_the_machines.radius", "inc, dst"],
	["tinker_march_of_the_machines.collision_radius", "inc, dst"],
	["tinker_march_of_the_machines.splash_radius", "inc, dst"],
	["tinker_march_of_the_machines.duration", "inc, dur"],
	["sniper_shrapnel.slow_movement_speed", "inc"],
	["sniper_shrapnel.radius", "inc, dst"],
	["sniper_shrapnel.building_damage", "inc, dmg"],
	["sniper_shrapnel.duration", "inc, dur"],
	["sniper_shrapnel.slow_duration", "inc, dur"],
	["sniper_headshot.stun_duration", "inc, stun, dur"],
	["sniper_take_aim.bonus_attack_range", "inc, dst"],
	["necrolyte_death_pulse.area_of_effect", "inc, dst"],
	["necrolyte_death_pulse.heal", "inc"],
	["necrolyte_heartstopper_aura.aura_radius", "inc, dst"],
	["necrolyte_heartstopper_aura.aura_damage", "inc, dmg"],
	["necrolyte_sadist.mana_regen", "inc"],
	["necrolyte_sadist.health_regen", "inc"],
	["necrolyte_sadist.regen_duration", "inc, dur"],
	["necrolyte_reapers_scythe.damage_per_health", "inc, dmg"],
	["necrolyte_reapers_scythe.stun_duration", "inc, stun, dur"],
	["necrolyte_reapers_scythe.damage_per_health_scepter", "inc, dmg"],
	["warlock_fatal_bonds.count", "inc"],
	["warlock_fatal_bonds.damage_share_percentage", "inc, dmg"],
	["warlock_fatal_bonds.duration", "inc, dur"],
	["warlock_fatal_bonds.search_aoe", "inc, dst"],
	["warlock_shadow_word.duration", "inc, dur"],
	["warlock_upheaval.aoe", "inc, dst"],
	["warlock_upheaval.slow_rate", "inc"],
	["warlock_upheaval.duration", "inc, dur"],
	["warlock_upheaval.max_slow", "inc"],
	["warlock_rain_of_chaos.golem_duration", "inc, dur"],
	["warlock_rain_of_chaos.stun_duration", "inc, stun, dur"],
	["warlock_rain_of_chaos.aoe", "inc, dst"],
	["warlock_rain_of_chaos.damage", "inc, dmg"],
	["warlock_rain_of_chaos.hp_dmg_reduction_scepter", "inc"],
	["warlock_rain_of_chaos.bounty_reduction_scepter", "inc"],
	["warlock_golem_flaming_fists.damage", "inc, dmg"],
	["warlock_golem_flaming_fists.radius", "inc, dst"],
	["warlock_golem_permanent_immolation.aura_radius", "inc, dst"],
	["warlock_golem_permanent_immolation.aura_damage", "inc, dmg"],
	["beastmaster_wild_axes.radius", "inc, dst"],
	["beastmaster_wild_axes.range", "inc, dst"],
	["beastmaster_call_of_the_wild.hawk_duration", "inc, dur"],
	["beastmaster_call_of_the_wild.boar_duration", "inc, dur"],
	["beastmaster_hawk_invisibility.fade_time", "dec"],
	["beastmaster_boar_poison.duration", "inc, dur"],
	["beastmaster_greater_boar_poison.duration", "inc, dur"],
	["beastmaster_inner_beast.radius", "inc, dst"],
	["beastmaster_inner_beast.bonus_attack_speed", "inc"],
	["beastmaster_primal_roar.duration", "inc, dur"],
	["beastmaster_primal_roar.damage", "inc, dmg"],
	["beastmaster_primal_roar.side_damage", "inc, dmg"],
	["beastmaster_primal_roar.damage_radius", "inc, dst"],
	["beastmaster_primal_roar.slow_movement_speed_pct", "inc"],
	["beastmaster_primal_roar.slow_attack_speed_pct", "inc"],
	["beastmaster_primal_roar.push_distance", "inc, dst"],
	["beastmaster_primal_roar.push_duration", "inc, dur"],
	["beastmaster_primal_roar.slow_duration", "inc, dur"],
	["beastmaster_primal_roar.cast_range_scepter", "inc, dst"],
	["queenofpain_shadow_strike.strike_damage", "inc, dmg"],
	["queenofpain_shadow_strike.duration_damage", "inc, dur"],
	["queenofpain_shadow_strike.movement_slow", "inc"],
	["queenofpain_blink.blink_range", "inc, dst"],
	//["queenofpain_blink.min_blink_range", "inc, dst"],
	["queenofpain_scream_of_pain.area_of_effect", "inc, dst"],
	["queenofpain_sonic_wave.starting_aoe", "inc, dst"],
	["queenofpain_sonic_wave.distance", "inc, dst"],
	["queenofpain_sonic_wave.final_aoe", "inc, dst"],
	["queenofpain_sonic_wave.damage", "inc, dmg"],
	["queenofpain_sonic_wave.damage_scepter", "inc, dmg"],
	["venomancer_venomous_gale.duration", "inc, dur"],
	["venomancer_venomous_gale.strike_damage", "inc, dmg"],
	["venomancer_venomous_gale.tick_damage", "inc, dmg"],
	["venomancer_venomous_gale.movement_slow", "inc"],
	["venomancer_venomous_gale.radius", "inc, dst"],
	["venomancer_poison_sting.duration", "inc, dur"],
	["venomancer_poison_sting.damage", "inc, dmg"],
	["venomancer_plague_ward.duration", "inc, dur"],
	["venomancer_poison_nova.radius", "inc, dst"],
	["venomancer_poison_nova.start_radius", "inc, dst"],
	["venomancer_poison_nova.duration", "inc, dur"],
	["venomancer_poison_nova.damage", "inc, dmg"],
	["venomancer_poison_nova.duration_scepter", "inc, dur"],
	["venomancer_poison_nova.damage_scepter", "inc, dmg"],
	["faceless_void_time_walk.radius", "inc, dst"],
	["faceless_void_time_walk.duration", "inc, dur"],
	["faceless_void_time_lock.duration", "inc, dur"],
	["faceless_void_time_lock.duration_creep", "inc, dur"],
	["faceless_void_time_lock.bonus_damage", "inc, dmg"],
	["faceless_void_chronosphere.radius", "inc, dst"],
	["faceless_void_chronosphere.duration", "inc, dur"],
	["faceless_void_chronosphere.duration_scepter", "inc, dur"],
	["pugna_nether_blast.structure_damage_mod", "inc, dmg"],
	["pugna_nether_blast.radius", "inc, dst"],
	["pugna_decrepify.bonus_spell_damage_pct", "inc, dmg"],
	["pugna_decrepify.bonus_movement_speed", "inc"],
	["pugna_nether_ward.radius", "inc, dst"],
	["pugna_nether_ward.mana_regen", "inc"],
	["pugna_life_drain.health_drain", "inc"],
	["pugna_life_drain.health_drain_scepter", "inc"],
	["pugna_life_drain.bonus_range_scepter", "inc, dst"],
	["phantom_assassin_stifling_dagger.move_slow", "inc"],
	["phantom_assassin_stifling_dagger.duration", "inc, dur"],
	["phantom_assassin_phantom_strike.bonus_attack_speed", "inc"],
	["phantom_assassin_phantom_strike.bonus_max_attack_count", "inc"],
	["phantom_assassin_blur.bonus_evasion", "inc"],
	["phantom_assassin_blur.transparency_fade", "dec"],
	["phantom_assassin_blur.radius", "inc, dst"],
	["phantom_assassin_coup_de_grace.crit_bonus", "inc"],
	["templar_assassin_refraction.bonus_damage", "inc, dmg"],
	["templar_assassin_refraction.damage_threshold", "inc, dmg"],
	["templar_assassin_refraction.duration", "inc, dur"],
	["templar_assassin_meld.bonus_damage", "inc, dmg"],
	["templar_assassin_meld.bonus_armor", "inc"],
	["templar_assassin_psi_blades.bonus_attack_range", "inc, dst"],
	["templar_assassin_psi_blades.attack_spill_range", "inc, dst"],
	["templar_assassin_psionic_trap.max_traps", "inc"],
	["templar_assassin_psionic_trap.trap_fade_time", "dec"],
	["templar_assassin_trap.movement_speed_bonus", "inc"],
	["templar_assassin_trap.trap_radius", "inc, dst"],
	["templar_assassin_trap.trap_duration", "inc, dur"],
	["templar_assassin_trap.movement_speed_bonus_stage", "inc"],
	["templar_assassin_self_trap.movement_speed_bonus", "inc"],
	["templar_assassin_self_trap.trap_radius", "inc, dst"],
	["templar_assassin_self_trap.trap_duration", "inc, dur"],
	["templar_assassin_self_trap.movement_speed_bonus_stage", "inc"],
	["viper_poison_attack.duration", "inc, dur"],
	["viper_poison_attack.damage", "inc, dmg"],
	["viper_poison_attack.bonus_movement_speed", "inc"],
	["viper_poison_attack.bonus_attack_speed", "inc"],
	["viper_nethertoxin.bonus_damage", "inc, dmg"],
	["viper_nethertoxin.non_hero_damage_pct", "inc, dmg"],
	["viper_corrosive_skin.duration", "inc, dur"],
	["viper_corrosive_skin.bonus_movement_speed", "inc"],
	["viper_corrosive_skin.bonus_attack_speed", "inc"],
	["viper_corrosive_skin.bonus_magic_resistance", "inc, mr"],
	["viper_corrosive_skin.damage", "inc, dmg"],
	["viper_viper_strike.duration", "inc, dur"],
	["viper_viper_strike.damage", "inc, dmg"],
	["viper_viper_strike.bonus_movement_speed", "inc"],
	["viper_viper_strike.bonus_attack_speed", "inc"],
	["viper_viper_strike.cast_range_scepter", "inc, dst"],
	["luna_lucent_beam.stun_duration", "inc, stun, dur"],
	["luna_moon_glaive.range", "inc, dst"],
	["luna_moon_glaive.bounces", "inc"],
	["luna_moon_glaive.damage_reduction_percent", "dec, dmg"],
	["luna_lunar_blessing.radius", "inc, dst"],
	["luna_lunar_blessing.bonus_damage", "inc, dmg"],
	["luna_eclipse.radius", "inc, dst"],
	["luna_eclipse.hit_count", "inc"],
	["luna_eclipse.hit_count_scepter", "inc"],
	["dragon_knight_breathe_fire.start_radius", "inc, dst"],
	["dragon_knight_breathe_fire.end_radius", "inc, dst"],
	["dragon_knight_breathe_fire.range", "inc, dst"],
	["dragon_knight_dragon_tail.stun_duration", "inc, stun, dur"],
	["dragon_knight_dragon_tail.dragon_cast_range", "inc, dst"],
	["dragon_knight_dragon_blood.bonus_health_regen", "inc"],
	["dragon_knight_dragon_blood.bonus_armor", "inc"],
	["dragon_knight_elder_dragon_form.duration", "inc, dur"],
	["dragon_knight_elder_dragon_form.bonus_movement_speed", "inc"],
	["dragon_knight_elder_dragon_form.bonus_attack_range", "inc, dst"],
	["dragon_knight_elder_dragon_form.corrosive_breath_damage", "inc, dmg"],
	["dragon_knight_elder_dragon_form.corrosive_breath_duration", "inc, dur"],
	["dragon_knight_elder_dragon_form.splash_radius", "inc, dst"],
	["dragon_knight_elder_dragon_form.splash_damage_percent", "inc, dmg"],
	["dragon_knight_elder_dragon_form.frost_bonus_movement_speed", "inc"],
	["dragon_knight_elder_dragon_form.frost_bonus_attack_speed", "inc"],
	["dragon_knight_elder_dragon_form.frost_duration", "inc, dur"],
	["dragon_knight_elder_dragon_form.frost_aoe", "inc, dst"],
	["dragon_knight_frost_breath.bonus_movement_speed", "inc"],
	["dragon_knight_frost_breath.bonus_attack_speed", "inc"],
	["dragon_knight_frost_breath.duration", "inc, dur"],
	["dazzle_poison_touch.slow", "inc"],
	["dazzle_poison_touch.stun_duration", "inc, stun, dur"],
	["dazzle_shadow_wave.bounce_radius", "inc, dst"],
	["dazzle_shadow_wave.damage_radius", "inc, dst"],
	//["dazzle_shadow_wave.max_targets", "inc"],
	["dazzle_shadow_wave.damage", "inc, dmg"],
	["dazzle_weave.radius", "inc, dst"],
	["dazzle_weave.armor_per_second", "inc"],
	["dazzle_weave.duration", "inc, dur"],
	["dazzle_weave.radius_scepter", "inc, dst"],
	["dazzle_weave.duration_scepter", "inc, dur"],
	["rattletrap_battery_assault.radius", "inc, dst"],
	["rattletrap_battery_assault.duration", "inc, dur"],
	["rattletrap_power_cogs.radius", "inc, dst"],
	["rattletrap_power_cogs.duration", "inc, dur"],
	["rattletrap_power_cogs.drain_amount", "inc"],
	["rattletrap_rocket_flare.radius", "inc, dst"],
	["rattletrap_rocket_flare.duration", "inc, dur"],
	["rattletrap_hookshot.latch_radius", "inc, dst"],
	["rattletrap_hookshot.stun_radius", "inc, stun, dur"],
	["rattletrap_hookshot.duration", "inc, dur"],
	["rattletrap_hookshot.damage", "inc, dmg"],
	["leshrac_split_earth.radius", "inc, dst"],
	["leshrac_split_earth.duration", "inc, dur"],
	["leshrac_diabolic_edict.num_explosions", "inc"],
	["leshrac_diabolic_edict.radius", "inc, dst"],
	["leshrac_lightning_storm.jump_count", "inc"],
	["leshrac_lightning_storm.radius", "inc, dst"],
	["leshrac_pulse_nova.radius", "inc, dst"],
	["leshrac_pulse_nova.damage", "inc, dmg"],
	["leshrac_pulse_nova.damage_scepter", "inc, dmg"],
	["furion_sprout.duration", "inc, dur"],
	["furion_force_of_nature.area_of_effect", "inc, dst"],
	["furion_force_of_nature.max_treants", "inc"],
	["furion_force_of_nature.duration", "inc, dur"],
	["furion_wrath_of_nature.max_targets", "inc"],
	["furion_wrath_of_nature.damage", "inc, dmg"],
	["furion_wrath_of_nature.damage_percent_add", "inc, dmg"],
	["furion_wrath_of_nature.max_targets_scepter", "inc"],
	["furion_wrath_of_nature.damage_scepter", "inc, dmg"],
	["life_stealer_rage.attack_speed_bonus", "inc"],
	["life_stealer_rage.duration", "inc, dur"],
	["life_stealer_feast.hp_leech_percent", "inc"],
	["life_stealer_open_wounds.slow_steps", "inc"],
	["life_stealer_open_wounds.heal_percent", "inc"],
	["life_stealer_open_wounds.duration", "inc, dur"],
	["life_stealer_infest.radius", "inc, dst"],
	["life_stealer_infest.damage", "inc, dmg"],
	["dark_seer_vacuum.radius", "inc, dst"],
	["dark_seer_vacuum.duration", "inc, dur"],
	["dark_seer_vacuum.damage", "inc, dmg"],
	["dark_seer_vacuum.radius_tree", "inc, dst"],
	["dark_seer_ion_shell.radius", "inc, dst"],
	["dark_seer_ion_shell.damage_per_second", "inc, dmg"],
	["dark_seer_ion_shell.duration", "inc, dur"],
	["dark_seer_surge.duration", "inc, dur"],
	["dark_seer_wall_of_replica.duration", "inc, dur"],
	["dark_seer_wall_of_replica.damage", "inc, dmg"],
	["clinkz_strafe.duration", "inc, dur"],
	["clinkz_strafe.attack_speed_bonus_pct", "inc"],
	["clinkz_searing_arrows.damage_bonus", "inc, dmg"],
	["clinkz_wind_walk.duration", "inc, dur"],
	["clinkz_wind_walk.fade_time", "dec"],
	["clinkz_wind_walk.move_speed_bonus_pct", "inc"],
	["clinkz_death_pact.duration", "inc, dur"],
	["clinkz_death_pact.health_gain_pct", "inc"],
	["clinkz_death_pact.damage_gain_pct", "inc, dmg"],
	["omniknight_purification.heal", "inc"],
	["omniknight_purification.radius", "inc, dst"],
	["omniknight_repel.duration", "inc, dur"],
	["omniknight_degen_aura.speed_bonus", "inc"],
	["omniknight_degen_aura.radius", "inc, dst"],
	["omniknight_guardian_angel.duration", "inc, dur"],
	["omniknight_guardian_angel.health_regen", "inc"],
	["omniknight_guardian_angel.radius", "inc, dst"],
	["enchantress_untouchable.slow_attack_speed", "inc"],
	["enchantress_enchant.slow_movement_speed", "inc"],
	["enchantress_enchant.dominate_duration", "inc, dur"],
	["enchantress_natures_attendants.heal", "inc"],
	["enchantress_natures_attendants.radius", "inc, dst"],
	["enchantress_natures_attendants.wisp_count", "inc"],
	["enchantress_impetus.distance_damage_pct", "inc, dst"],
	["enchantress_impetus.distance_damage_cap", "inc, dst"],
	["enchantress_impetus.bonus_attack_range_scepter", "inc, dst"],
	["huskar_inner_vitality.heal", "inc"],
	["huskar_inner_vitality.attrib_bonus", "inc"],
	["huskar_inner_vitality.hurt_attrib_bonus", "inc"],
	["huskar_burning_spear.health_cost", "inc"],
	["huskar_berserkers_blood.attack_speed_bonus_per_stack", "inc"],
	["huskar_berserkers_blood.resistance_per_stack", "inc, mr"],
	["huskar_life_break.health_cost_percent", "dec"],
	["huskar_life_break.health_damage", "inc, dmg"],
	["huskar_life_break.health_damage_scepter", "inc, dmg"],
	["night_stalker_void.duration_day", "inc, dur"],
	["night_stalker_void.duration_night", "inc, dur"],
	["night_stalker_void.movespeed_slow", "inc"],
	["night_stalker_void.attackspeed_slow", "inc"],
	["night_stalker_crippling_fear.duration_day", "inc, dur"],
	["night_stalker_crippling_fear.duration_night", "inc, dur"],
	["night_stalker_hunter_in_the_night.bonus_movement_speed_pct_night", "inc"],
	["night_stalker_hunter_in_the_night.bonus_attack_speed_night", "inc"],
	["night_stalker_darkness.duration", "inc, dur"],
	["broodmother_spawn_spiderlings.buff_duration", "inc, dur"],
	["broodmother_spawn_spiderlings.spiderling_duration", "inc, dur"],
	["broodmother_spawn_spiderlings.damage", "inc, dmg"],
	["broodmother_spawn_spiderlings.count", "inc"],
	["broodmother_poison_sting.duration", "inc, dur"],
	["broodmother_poison_sting.duration_hero", "inc, dur"],
	["broodmother_poison_sting.damage_per_second", "inc, dmg"],
	["broodmother_spawn_spiderite.spiderite_duration", "inc, dur"],
	["broodmother_spawn_spiderite.buff_duration", "inc, dur"],
	["broodmother_spin_web.radius", "inc, dst"],
	["broodmother_spin_web.count", "inc"],
	["broodmother_spin_web.heath_regen", "inc"],
	["broodmother_spin_web.bonus_movespeed", "inc"],
	["broodmother_spin_web.fade_delay", "dec"],
	["broodmother_incapacitating_bite.bonus_movespeed", "inc"],
	["broodmother_incapacitating_bite.duration", "inc, dur"],
	["broodmother_insatiable_hunger.bonus_damage", "inc, dmg"],
	["broodmother_insatiable_hunger.duration", "inc, dur"],
	["bounty_hunter_shuriken_toss.bonus_damage", "inc, dmg"],
	["bounty_hunter_jinada.bonus_movespeed", "inc"],
	["bounty_hunter_jinada.bonus_attackspeed", "inc"],
	["bounty_hunter_jinada.duration", "inc, dur"],
	["bounty_hunter_wind_walk.duration", "inc, dur"],
	["bounty_hunter_wind_walk.fade_time", "dec"],
	["bounty_hunter_wind_walk.bonus_damage", "inc, dmg"],
	["bounty_hunter_track.aura_radius", "inc, dst"],
	["bounty_hunter_track.bonus_move_speed_pct", "inc"],
	["bounty_hunter_track.bonus_gold_radius", "inc, dst"],
	["bounty_hunter_track.bonus_gold_self", "inc"],
	["bounty_hunter_track.bonus_gold", "inc"],
	["bounty_hunter_track.duration", "inc, dur"],
	["weaver_the_swarm.damage", "inc, dmg"],
	["weaver_the_swarm.duration", "inc, dur"],
	["weaver_the_swarm.count", "inc"],
	["weaver_the_swarm.armor_reduction", "inc"],
	["weaver_the_swarm.radius", "inc, dst"],
	["weaver_the_swarm.spawn_radius", "inc, dst"],
	["weaver_shukuchi.damage", "inc, dmg"],
	["weaver_shukuchi.radius", "inc, dst"],
	["weaver_shukuchi.fade_time", "dec"],
	["weaver_shukuchi.duration", "inc, dur"],
	["jakiro_dual_breath.start_radius", "inc, dst"],
	["jakiro_dual_breath.end_radius", "inc, dst"],
	["jakiro_dual_breath.range", "inc, dst"],
	["jakiro_dual_breath.burn_damage", "inc, dmg"],
	["jakiro_dual_breath.slow_movement_speed_pct", "inc"],
	["jakiro_dual_breath.slow_attack_speed_pct", "inc"],
	["jakiro_ice_path.duration", "inc, dur"],
	["jakiro_ice_path.path_radius", "inc, dst"],
	["jakiro_ice_path.damage", "inc, dmg"],
	["jakiro_liquid_fire.slow_attack_speed_pct", "inc"],
	["jakiro_liquid_fire.radius", "inc, dst"],
	["jakiro_liquid_fire.damage", "inc, dmg"],
	["jakiro_macropyre.path_radius", "inc, dst"],
	["jakiro_macropyre.damage", "inc, dmg"],
	["jakiro_macropyre.damage_scepter", "inc, dmg"],
	["jakiro_macropyre.cast_range_scepter", "inc, dst"],
	["batrider_sticky_napalm.damage", "inc, dmg"],
	["batrider_sticky_napalm.radius", "inc, dst"],
	["batrider_sticky_napalm.duration", "inc, dur"],
	["batrider_sticky_napalm.max_stacks", "inc"],
	["batrider_flamebreak.damage", "inc, dmg"],
	["batrider_flamebreak.explosion_radius", "inc, dst"],
	["batrider_flamebreak.collision_radius", "inc, dst"],
	["batrider_flamebreak.stun_duration", "inc, stun, dur"],
	["batrider_flamebreak.knockback_max_distance", "inc, dst"],
	["batrider_flamebreak.knockback_duration", "inc, dur"],
	["batrider_firefly.damage_per_second", "inc, dmg"],
	["batrider_firefly.radius", "inc, dst"],
	["batrider_firefly.duration", "inc, dur"],
	["batrider_firefly.tree_radius", "inc, dst"],
	["batrider_flaming_lasso.duration", "inc, dur"],
	["batrider_flaming_lasso.drag_distance", "inc, dst"],
	["batrider_flaming_lasso.break_distance", "inc, dst"],
	["chen_penitence.duration", "inc, dur"],
	["chen_penitence.bonus_movement_speed", "inc"],
	["chen_penitence.bonus_damage_taken", "inc, dmg"],
	["chen_test_of_faith.damage_min", "inc, dmg"],
	["chen_test_of_faith.damage_max", "inc, dmg"],
	["chen_holy_persuasion.max_units", "inc"],
	["chen_holy_persuasion.health_bonus", "inc"],
	["chen_hand_of_god.heal_amount", "inc"],
	["spectre_spectral_dagger.damage", "inc, dmg"],
	["spectre_spectral_dagger.bonus_movespeed", "inc"],
	["spectre_spectral_dagger.dagger_path_duration", "inc, dur"],
	["spectre_spectral_dagger.hero_path_duration", "inc, dur"],
	["spectre_spectral_dagger.dagger_radius", "inc, dst"],
	["spectre_spectral_dagger.path_radius", "inc, dst"],
	["spectre_desolate.bonus_damage", "inc, dmg"],
	//["spectre_desolate.radius", "inc, dst"],
	//["spectre_dispersion.min_radius", "inc, dst"],
	["spectre_dispersion.max_radius", "inc, dst"],
	["spectre_dispersion.damage_reflection_pct", "inc, dmg, step"],
	["spectre_haunt.duration", "inc, dur"],
	["doom_bringer_devour.bonus_gold", "inc"],
	["doom_bringer_devour.health_per_second", "inc"],
	["doom_bringer_scorched_earth.damage_per_second", "inc, dmg"],
	["doom_bringer_scorched_earth.radius", "inc, dst"],
	["doom_bringer_scorched_earth.bonus_movement_speed_pct", "inc"],
	["doom_bringer_scorched_earth.duration", "inc, dur"],
	["doom_bringer_lvl_death.damage", "inc, dmg"],
	["doom_bringer_lvl_death.lvl_bonus_damage", "inc, dmg"],
	["doom_bringer_lvl_death.lvl_bonus_multiple", "inc"],
	["doom_bringer_doom.duration", "inc, dur"],
	["doom_bringer_doom.damage", "inc, dmg"],
	["doom_bringer_doom.duration_scepter", "inc, dur"],
	["doom_bringer_doom.damage_scepter", "inc, dmg"],
	["ancient_apparition_cold_feet.damage", "inc, dmg"],
	["ancient_apparition_cold_feet.break_distance", "inc, dst"],
	["ancient_apparition_cold_feet.stun_duration", "inc, stun, dur"],
	["ancient_apparition_ice_vortex.radius", "inc, dst"],
	["ancient_apparition_chilling_touch.radius", "inc, dst"],
	["ancient_apparition_chilling_touch.max_attacks", "inc"],
	["ancient_apparition_chilling_touch.bonus_damage", "inc, dmg"],
	//["ancient_apparition_ice_blast.radius_min", "inc, dst"],
	["ancient_apparition_ice_blast.radius_grow", "inc, dst"],
	["ancient_apparition_ice_blast.radius_max", "inc, dst"],
	["ancient_apparition_ice_blast.path_radius", "inc, dst"],
	["ancient_apparition_ice_blast.frostbite_duration", "inc, dur"],
	["ancient_apparition_ice_blast.dot_damage", "inc, dmg"],
	["ancient_apparition_ice_blast.target_sight_radius", "inc, dst"],
	["ancient_apparition_ice_blast.frostbite_duration_scepter", "inc, dur"],
	["spirit_breaker_charge_of_darkness.stun_duration", "inc, stun, dur"],
	["spirit_breaker_charge_of_darkness.debuff_range", "inc, dst"],
	["spirit_breaker_charge_of_darkness.bash_radius", "inc, dst"],
	["spirit_breaker_empowering_haste.bonus_movespeed_pct", "inc"],
	["spirit_breaker_empowering_haste.bonus_damage_pct", "inc, dmg"],
	["spirit_breaker_empowering_haste.aura_radius", "inc, dst"],
	["spirit_breaker_greater_bash.damage", "inc, dmg"],
	["spirit_breaker_greater_bash.duration", "inc, dur"],
	["spirit_breaker_greater_bash.knockback_duration", "inc, dur"],
	["spirit_breaker_greater_bash.knockback_distance", "inc, dst"],
	["spirit_breaker_greater_bash.bonus_movespeed_pct", "inc"],
	["spirit_breaker_greater_bash.movespeed_duration", "inc, dur"],
	["spirit_breaker_nether_strike.damage", "inc, dmg"],
	["spirit_breaker_nether_strike.fade_time", "dec"],
	["spirit_breaker_nether_strike.cast_range_scepter", "inc, dst"],
	["spirit_breaker_nether_strike.bash_radius_scepter", "inc, dst"],
	["ursa_earthshock.shock_radius", "inc, dst"],
	["ursa_earthshock.movement_slow", "inc"],
	["ursa_overpower.max_attacks", "inc"],
	["ursa_overpower.attack_speed_bonus_pct", "inc"],
	["ursa_fury_swipes.bonus_reset_time", "inc"],
	["ursa_fury_swipes.bonus_reset_time_roshan", "inc"],
	["ursa_fury_swipes.damage_per_stack", "inc, dmg"],
	["ursa_enrage.life_damage_bonus_percent", "inc, dmg"],
	["gyrocopter_rocket_barrage.radius", "inc, dst"],
	["gyrocopter_homing_missile.stun_duration", "inc, stun, dur"],
	["gyrocopter_homing_missile.attack_speed_bonus_pct", "inc"],
	["gyrocopter_homing_missile.min_damage", "inc, dmg"],
	["gyrocopter_homing_missile.max_distance", "inc, dst"],
	["gyrocopter_homing_missile.hero_damage", "inc, dmg"],
	["gyrocopter_flak_cannon.radius", "inc, dst"],
	["gyrocopter_flak_cannon.max_attacks", "inc"],
	["gyrocopter_call_down.slow_duration_first", "inc, dur"],
	["gyrocopter_call_down.slow_duration_second", "inc, dur"],
	["gyrocopter_call_down.damage_first", "inc, dmg"],
	["gyrocopter_call_down.damage_second", "inc, dmg"],
	["gyrocopter_call_down.slow_first", "inc"],
	["gyrocopter_call_down.slow_second", "inc"],
	["gyrocopter_call_down.radius", "inc, dst"],
	["gyrocopter_call_down.range_scepter", "inc, dst"],
	["gyrocopter_call_down.damage_second_scepter", "inc, dmg"],
	["alchemist_acid_spray.radius", "inc, dst"],
	["alchemist_acid_spray.duration", "inc, dur"],
	["alchemist_acid_spray.damage", "inc, dmg"],
	["alchemist_acid_spray.armor_reduction", "inc"],
	["alchemist_unstable_concoction.brew_explosion", "inc"],
	["alchemist_unstable_concoction.min_stun", "inc, stun, dur"],
	["alchemist_unstable_concoction.max_stun", "inc, stun, dur"],
	["alchemist_unstable_concoction.min_damage", "inc, dmg"],
	["alchemist_unstable_concoction.max_damage", "inc, dmg"],
	["alchemist_unstable_concoction.radius", "inc, dst"],
	["alchemist_unstable_concoction_throw.min_stun", "inc, stun, dur"],
	["alchemist_unstable_concoction_throw.max_stun", "inc, stun, dur"],
	["alchemist_unstable_concoction_throw.min_damage", "inc, dmg"],
	["alchemist_unstable_concoction_throw.max_damage", "inc, dmg"],
	["alchemist_unstable_concoction_throw.midair_explosion_radius", "inc, dst"],
	["alchemist_unstable_concoction_throw.brew_explosion", "inc"],
	["alchemist_goblins_greed.duration", "inc, dur"],
	["alchemist_goblins_greed.bonus_gold", "inc"],
	["alchemist_goblins_greed.bonus_bonus_gold", "inc"],
	["alchemist_goblins_greed.bonus_gold_cap", "inc"],
	["alchemist_chemical_rage.duration", "inc, dur"],
	["alchemist_chemical_rage.bonus_health", "inc"],
	["alchemist_chemical_rage.bonus_health_regen", "inc"],
	["alchemist_chemical_rage.bonus_mana_regen", "inc"],
	["alchemist_chemical_rage.bonus_movespeed", "inc"],
	["invoker_quas.health_regen_per_instance", "inc"],
	["invoker_quas.bonus_strength", "inc"],
	["invoker_wex.bonus_agility", "inc"],
	["invoker_exort.bonus_damage_per_instance", "inc, dmg"],
	["invoker_exort.bonus_intelligence", "inc"],
	["invoker_invoke.max_invoked_spells", "inc"],
	["invoker_cold_snap.duration", "inc, dur"],
	["invoker_cold_snap.initial_freeze_damage", "inc, dmg"],
	["invoker_cold_snap.freeze_duration", "inc, dur"],
	["invoker_cold_snap.freeze_damage", "inc, dmg"],
	["invoker_cold_snap.damage_trigger", "inc, dmg"],
	["invoker_ghost_walk.area_of_effect", "inc, dst"],
	["invoker_ghost_walk.enemy_slow", "inc"],
	["invoker_ghost_walk.self_slow", "inc"],
	["invoker_ghost_walk.duration", "inc, dur"],
	["invoker_ghost_walk.aura_fade_time", "dec"],
	["invoker_tornado.travel_distance", "inc, dst"],
	["invoker_tornado.area_of_effect", "inc, dst"],
	["invoker_tornado.lift_duration", "inc, dur"],
	["invoker_tornado.base_damage", "inc, dmg"],
	["invoker_tornado.quas_damage", "inc, dmg"],
	["invoker_tornado.wex_damage", "inc, dmg"],
	["invoker_emp.area_of_effect", "inc, dst"],
	["invoker_emp.damage_per_mana_pct", "inc, dmg"],
	["invoker_alacrity.bonus_attack_speed", "inc"],
	["invoker_alacrity.bonus_damage", "inc, dmg"],
	["invoker_alacrity.duration", "inc, dur"],
	["invoker_chaos_meteor.travel_distance", "inc, dst"],
	["invoker_chaos_meteor.area_of_effect", "inc, dst"],
	["invoker_chaos_meteor.main_damage", "inc, dmg"],
	["invoker_chaos_meteor.burn_duration", "inc, dur"],
	["invoker_sun_strike.area_of_effect", "inc, dst"],
	["invoker_sun_strike.damage", "inc, dmg"],
	["invoker_forge_spirit.spirit_damage", "inc, dmg"],
	["invoker_forge_spirit.spirit_hp", "inc"],
	["invoker_forge_spirit.spirit_armor", "inc"],
	["invoker_forge_spirit.spirit_attack_range", "inc, dst"],
	["invoker_forge_spirit.spirit_duration", "inc, dur"],
	["forged_spirit_melting_strike.armor_removed", "inc"],
	["forged_spirit_melting_strike.max_armor_removed", "inc"],
	["forged_spirit_melting_strike.duration", "inc, dur"],
	["invoker_ice_wall.duration", "inc, dur"],
	["invoker_ice_wall.slow", "inc"],
	["invoker_ice_wall.damage_per_second", "inc, dmg"],
	["invoker_ice_wall.wall_place_distance", "inc, dst"],
	["invoker_ice_wall.wall_element_radius", "inc, dst"],
	["invoker_ice_wall.slow_duration", "inc, dur"],
	["invoker_deafening_blast.travel_distance", "inc, dst"],
	["invoker_deafening_blast.radius_start", "inc, dst"],
	["invoker_deafening_blast.radius_end", "inc, dst"],
	["invoker_deafening_blast.damage", "inc, dmg"],
	["invoker_deafening_blast.knockback_duration", "inc, dur"],
	["invoker_deafening_blast.disarm_duration", "inc, dur"],
	["silencer_curse_of_the_silent.mana_damage", "inc, dmg"],
	["silencer_curse_of_the_silent.health_damage", "inc, dmg"],
	["silencer_curse_of_the_silent.radius", "inc, dst"],
	["silencer_glaives_of_wisdom.intellect_damage_pct", "inc, dmg"],
	["silencer_glaives_of_wisdom.steal_range", "inc, dst"],
	["silencer_last_word.duration", "inc, dur"],
	["silencer_last_word.debuff_duration", "inc, dur"],
	["silencer_last_word.damage", "inc, dmg"],
	["silencer_global_silence.duration_scepter", "inc, dur"],
	["obsidian_destroyer_arcane_orb.mana_pool_damage_pct", "inc, dmg"],
	["obsidian_destroyer_arcane_orb.illusion_damage", "inc, dmg"],
	["obsidian_destroyer_astral_imprisonment.steal_duration", "inc, dur"],
	["obsidian_destroyer_astral_imprisonment.prison_duration", "inc, dur"],
	["obsidian_destroyer_essence_aura.radius", "inc, dst"],
	["obsidian_destroyer_essence_aura.bonus_mana", "inc"],
	["obsidian_destroyer_sanity_eclipse.radius", "inc, dst"],
	["obsidian_destroyer_sanity_eclipse.cast_range", "inc, dst"],
	["obsidian_destroyer_sanity_eclipse.damage_multiplier", "inc, dmg"],
	["obsidian_destroyer_sanity_eclipse.int_threshold", "inc"],
	["obsidian_destroyer_sanity_eclipse.cast_range_scepter", "inc, dst"],
	["obsidian_destroyer_sanity_eclipse.damage_multiplier_scepter", "inc, dmg"],
	["lycan_summon_wolves.wolf_duration", "inc, dur"],
	["lycan_summon_wolves.wolf_damage", "inc, dmg"],
	["lycan_summon_wolves.wolf_hp", "inc"],
	["lycan_howl.howl_duration", "inc, dur"],
	["lycan_howl.hero_bonus_damage", "inc, dmg"],
	["lycan_howl.unit_bonus_damage", "inc, dmg"],
	["lycan_feral_impulse.radius", "inc, dst"],
	["lycan_feral_impulse.bonus_attack_speed", "inc"],
	["lycan_feral_impulse.bonus_damage", "inc, dmg"],
	["lycan_shapeshift.duration", "inc, dur"],
	["lycan_shapeshift.crit_damage", "inc, dmg"],
	["lycan_shapeshift.bonus_hp", "inc"],
	["lycan_shapeshift.bonus_armor", "inc"],
	["lycan_summon_wolves_critical_strike.crit_damage", "inc, dmg"],
	["lycan_summon_wolves_invisibility.fade_time", "dec"],
	["lycan_summon_wolves_invisibility.fade_delay", "dec"],
	["lone_druid_spirit_bear.bear_hp", "inc"],
	["lone_druid_spirit_bear.bear_armor", "inc"],
	["lone_druid_spirit_bear.backlash_damage", "dec, dmg"],
	["lone_druid_rabid.bonus_attack_speed", "inc"],
	["lone_druid_rabid.bonus_move_speed", "inc"],
	["lone_druid_rabid.rabid_duration", "inc, dur"],
	["lone_druid_synergy.bear_bonus_damage", "inc, dmg"],
	["lone_druid_synergy.bear_bonus_speed", "inc"],
	["lone_druid_synergy.rabid_duration_bonus", "inc, dur"],
	["lone_druid_synergy.true_form_hp_bonus", "inc"],
	["lone_druid_true_form.bonus_armor", "inc"],
	["lone_druid_true_form.bonus_hp", "inc"],
	["lone_druid_true_form_battle_cry.bonus_damage", "inc, dmg"],
	["lone_druid_true_form_battle_cry.bonus_armor", "inc"],
	["lone_druid_true_form_battle_cry.cry_duration", "inc, dur"],
	["lone_druid_true_form_battle_cry.range", "inc, dst"],
	["lone_druid_spirit_bear_entangle.hero_duration", "inc, dur"],
	["lone_druid_spirit_bear_entangle.creep_duration", "inc, dur"],
	["lone_druid_spirit_bear_demolish.spell_resistance", "inc, mr"],
	["lone_druid_spirit_bear_demolish.bonus_building_damage", "inc, dmg"],
	["brewmaster_thunder_clap.radius", "inc, dst"],
	["brewmaster_thunder_clap.duration", "inc, dur"],
	["brewmaster_thunder_clap.duration_creeps", "inc, dur"],
	["brewmaster_thunder_clap.damage", "inc, dmg"],
	["brewmaster_thunder_clap.movement_slow", "inc"],
	["brewmaster_thunder_clap.attack_speed_slow", "inc"],
	["brewmaster_drunken_haze.radius", "inc, dst"],
	["brewmaster_drunken_haze.duration", "inc, dur"],
	["brewmaster_drunken_haze.duration_creeps", "inc, dur"],
	["brewmaster_drunken_haze.movement_slow", "inc"],
	["brewmaster_primal_split.duration", "inc, dur"],
	["brewmaster_primal_split.split_duration", "inc, dur"],
	["brewmaster_primal_split.duration_scepter", "inc, dur"],
	["brewmaster_earth_hurl_boulder.damage", "inc, dmg"],
	["brewmaster_earth_hurl_boulder.duration", "inc, dur"],
	["brewmaster_earth_pulverize.damage_inner", "inc, dmg"],
	["brewmaster_earth_pulverize.radius_inner", "inc, dst"],
	["brewmaster_earth_pulverize.damage_outer", "inc, dmg"],
	["brewmaster_earth_pulverize.radius_outer", "inc, dst"],
	["brewmaster_storm_dispel_magic.damage", "inc, dmg"],
	["brewmaster_storm_dispel_magic.radius", "inc, dst"],
	["brewmaster_storm_cyclone.duration_hero", "inc, dur"],
	["brewmaster_storm_cyclone.duration_unit", "inc, dur"],
	["brewmaster_storm_wind_walk.bonus_damage", "inc, dmg"],
	["brewmaster_storm_wind_walk.bonus_movement_speeed", "inc"],
	["brewmaster_storm_wind_walk.duration", "inc, dur"],
	["brewmaster_storm_wind_walk.fade_time", "dec"],
	["brewmaster_fire_permanent_immolation.damage", "inc, dmg"],
	["brewmaster_fire_permanent_immolation.radius", "inc, dst"],
	["shadow_demon_disruption.illusion_duration", "inc, dur"],
	["shadow_demon_disruption.disruption_duration", "inc, dur"],
	["shadow_demon_soul_catcher.bonus_damage_taken", "inc, dmg"],
	["shadow_demon_soul_catcher.radius", "inc, dst"],
	["shadow_demon_shadow_poison.stack_damage", "inc, dmg"],
	["shadow_demon_shadow_poison.max_multiply_stacks", "inc"],
	["shadow_demon_shadow_poison.bonus_stack_damage", "inc, dmg"],
	["shadow_demon_shadow_poison.radius", "inc, dst"],
	["shadow_demon_demonic_purge.slow_rate", "inc"],
	["shadow_demon_demonic_purge.creep_root_duration", "inc, dur"],
	["chaos_knight_chaos_bolt.stun_min", "inc, stun, dur"],
	["chaos_knight_chaos_bolt.stun_max", "inc, stun, dur"],
	["chaos_knight_chaos_bolt.damage_min", "inc, dmg"],
	["chaos_knight_chaos_bolt.damage_max", "inc, dmg"],
	["chaos_knight_reality_rift.cast_range", "inc, dst"],
	["chaos_knight_reality_rift.bonus_damage", "inc, dmg"],
	["chaos_knight_reality_rift.bonus_duration", "inc, dur"],
	["chaos_knight_chaos_strike.crit_damage", "inc, dmg"],
	["chaos_knight_phantasm.illusion_duration", "inc, dur"],
	["chaos_knight_phantasm.images_count", "inc"],
	["meepo_earthbind.duration", "inc, dur"],
	["meepo_earthbind.radius", "inc, dst"],
	["meepo_poof.radius", "inc, dst"],
	["meepo_geostrike.slow", "inc"],
	["treant_natures_guise.duration", "inc, dur"],
	["treant_natures_guise.fade_time", "dec"],
	["treant_natures_guise.radius", "inc, dst"],
	["treant_natures_guise.bonus_move_speed", "inc"],
	["treant_leech_seed.leech_damage", "inc, dmg"],
	["treant_leech_seed.movement_slow", "inc"],
	["treant_leech_seed.radius", "inc, dst"],
	["treant_leech_seed.duration", "inc, dur"],
	["treant_living_armor.damage_count", "inc, dmg"],
	["treant_living_armor.health_regen", "inc"],
	["treant_living_armor.damage_block", "inc, dmg"],
	["treant_living_armor.duration", "inc, dur"],
	["treant_overgrowth.duration", "inc, dur"],
	["treant_overgrowth.radius", "inc, dst"],
	["ogre_magi_fireblast.stun_duration", "inc, stun, dur"],
	["ogre_magi_unrefined_fireblast.stun_duration", "inc, stun, dur"],
	["ogre_magi_ignite.duration", "inc, dur"],
	["ogre_magi_ignite.burn_damage", "inc, dmg"],
	["ogre_magi_ignite.slow_movement_speed_pct", "inc"],
	["ogre_magi_bloodlust.duration", "inc, dur"],
	["ogre_magi_bloodlust.bonus_movement_speed", "inc"],
	["ogre_magi_bloodlust.bonus_attack_speed", "inc"],
	["ogre_magi_multicast.ignite_aoe", "inc, dst"],
	["ogre_magi_multicast.bloodlust_aoe", "inc, dst"],
	["ogre_magi_multicast.ignite_cast_range", "inc, dst"],
	["undying_decay.decay_damage", "inc, dmg"],
	["undying_decay.radius", "inc, dst"],
	["undying_decay.decay_duration", "inc, dur"],
	["undying_soul_rip.damage_per_unit", "inc, dmg"],
	["undying_soul_rip.radius", "inc, dst"],
	["undying_soul_rip.max_units", "inc"],
	["undying_tombstone.duration", "inc, dur"],
	["undying_tombstone.radius", "inc, dst"],
	["undying_tombstone.health_threshold", "inc"],
	//["undying_tombstone_zombie_aura.radius", "inc, dst"],
	//["undying_tombstone_zombie_aura.health_threshold", "inc"],
	//["undying_tombstone_zombie_aura.bonus_speed", "inc"],
	//["undying_tombstone_zombie_deathstrike.slow", "inc"],
	//["undying_tombstone_zombie_deathstrike.health_threshold", "inc"],
	//["undying_tombstone_zombie_deathstrike.health_threshold_pct", "inc"],
	//["undying_tombstone_zombie_deathstrike.duration", "inc, dur"],
	//["undying_tombstone_zombie_deathstrike.bonus_speed", "inc"],
	["undying_flesh_golem.duration", "inc, dur"],
	["undying_flesh_golem.radius", "inc, dst"],
	["undying_flesh_golem.full_power_radius", "inc, dst"],
	["undying_flesh_golem.speed_slow", "inc"],
	["undying_flesh_golem.max_damage_amp", "inc, dmg"],
	["undying_flesh_golem.min_damage_amp", "inc, dmg"],
	["undying_flesh_golem.death_heal", "inc"],
	["undying_flesh_golem.death_heal_creep", "inc"],
	["undying_flesh_golem.max_damage_amp_scepter", "inc, dmg"],
	["undying_flesh_golem.min_damage_amp_scepter", "inc, dmg"],
	["undying_flesh_golem.death_heal_scepter", "inc"],
	["undying_flesh_golem.death_heal_creep_scepter", "inc"],
	["rubick_telekinesis.radius", "inc, dst"],
	["rubick_telekinesis.lift_duration", "inc, dur"],
	["rubick_telekinesis.stun_duration", "inc, stun, dur"],
	["rubick_telekinesis.max_land_distance", "inc, dst"],
	["rubick_telekinesis.fall_duration", "inc, dur"],
	["rubick_telekinesis_land.radius", "inc, dst"],
	["rubick_fade_bolt.radius", "inc, dst"],
	["rubick_fade_bolt.duration", "inc, dur"],
	["rubick_fade_bolt.damage", "inc, dmg"],
	["rubick_fade_bolt.jump_damage_reduction_pct", "inc, dmg"],
	["rubick_fade_bolt.hero_attack_damage_reduction", "inc, dmg"],
	["rubick_fade_bolt.creep_attack_damage_reduction", "inc, dmg"],
	["rubick_null_field.magic_damage_reduction_pct", "inc, dmg"],
	["rubick_null_field.radius", "inc, dst"],
	["rubick_spell_steal.duration", "inc, dur"],
	["disruptor_thunder_strike.radius", "inc, dst"],
	["disruptor_thunder_strike.duration", "inc, dur"],
	["disruptor_glimpse.cast_range", "inc, dst"],
	["disruptor_kinetic_field.radius", "inc, dst"],
	["disruptor_kinetic_field.duration", "inc, dur"],
	["disruptor_static_storm.radius", "inc, dst"],
	["disruptor_static_storm.damage_max", "inc, dmg"],
	["disruptor_static_storm.duration", "inc, dur"],
	["nyx_assassin_impale.duration", "inc, dur"],
	["nyx_assassin_spiked_carapace.reflect_duration", "inc, dur"],
	["nyx_assassin_spiked_carapace.stun_duration", "inc, stun, dur"],
	["nyx_assassin_vendetta.duration", "inc, dur"],
	["nyx_assassin_vendetta.fade_time", "dec"],
	["nyx_assassin_vendetta.bonus_damage", "inc, dmg"],
	["naga_siren_mirror_image.illusion_duration", "inc, dur"],
	["naga_siren_mirror_image.images_count", "inc"],
	["naga_siren_ensnare.duration", "inc, dur"],
	["naga_siren_ensnare.fake_ensnare_distance", "inc, dst"],
	["naga_siren_rip_tide.armor_reduction", "inc"],
	["naga_siren_rip_tide.radius", "inc, dst"],
	["naga_siren_rip_tide.duration", "inc, dur"],
	["naga_siren_song_of_the_siren.radius", "inc, dst"],
	["naga_siren_song_of_the_siren.duration", "inc, dur"],
	["keeper_of_the_light_illuminate.damage_per_second", "inc, dmg"],
	["keeper_of_the_light_illuminate.radius", "inc, dst"],
	["keeper_of_the_light_illuminate.range", "inc, dst"],
	["keeper_of_the_light_illuminate.max_channel_time", "inc"],
	["keeper_of_the_light_mana_leak.duration", "inc, dur"],
	["keeper_of_the_light_mana_leak.stun_duration", "inc, stun, dur"],
	["keeper_of_the_light_spirit_form.duration", "inc, dur"],
	["keeper_of_the_light_blinding_light.radius", "inc, dst"],
	["keeper_of_the_light_blinding_light.miss_duration", "inc, dur"],
	["keeper_of_the_light_blinding_light.knockback_distance", "inc, dst"],
	["keeper_of_the_light_blinding_light.knockback_duration", "inc, dur"],
	["keeper_of_the_light_spirit_form_illuminate.damage_per_second", "inc, dmg"],
	["keeper_of_the_light_spirit_form_illuminate.radius", "inc, dst"],
	["keeper_of_the_light_spirit_form_illuminate.range", "inc, dst"],
	["keeper_of_the_light_spirit_form_illuminate.max_channel_time", "inc"],
	["visage_grave_chill.chill_duration", "inc, dur"],
	["visage_grave_chill.movespeed_bonus", "inc"],
	["visage_grave_chill.attackspeed_bonus", "inc"],
	["visage_soul_assumption.soul_base_damage", "inc, dmg"],
	["visage_soul_assumption.soul_charge_damage", "inc, dmg"],
	["visage_soul_assumption.damage_limit", "inc, dmg"],
	["visage_soul_assumption.stack_duration", "inc, dur"],
	["visage_soul_assumption.radius", "inc, dst"],
	["visage_soul_assumption.damage_min", "inc, dmg"],
	["visage_soul_assumption.damage_max", "inc, dmg"],
	["visage_gravekeepers_cloak.bonus_armor", "inc"],
	["visage_gravekeepers_cloak.bonus_resist", "inc"],
	["visage_gravekeepers_cloak.max_layers", "inc"],
	["visage_summon_familiars.familiar_hp", "inc"],
	["visage_summon_familiars.familiar_armor", "inc"],
	["visage_summon_familiars.familiar_max_damage", "inc, dmg"],
	["visage_summon_familiars.damage_charge_time", "inc, dmg"],
	["visage_summon_familiars.damage_per_charge", "inc, dmg"],
	["visage_summon_familiars.max_damage_charges", "inc, dmg"],
	["visage_summon_familiars_stone_form.stun_radius", "inc, stun, dur"],
	["visage_summon_familiars_stone_form.stun_damage", "inc, stun, dur"],
	["visage_summon_familiars_stone_form.stun_duration", "inc, stun, dur"],
	["visage_summon_familiars_stone_form.stone_duration", "inc, dur"],
	["visage_summon_familiars_stone_form.hp_regen", "inc"],
	["visage_summon_familiars_stone_form.max_damage_charges", "inc, dmg"],
	["wisp_tether.radius", "inc, dst"],
	["wisp_tether.stun_duration", "inc, stun, dur"],
	["wisp_tether.latch_distance", "inc, dst"],
	["wisp_tether.tether_duration", "inc, dur"],
	["wisp_tether.tether_heal_amp", "inc"],
	["wisp_spirits.creep_damage", "inc, dmg"],
	["wisp_spirits.hero_damage", "inc, dmg"],
	["wisp_spirits.min_range", "inc, dst"],
	["wisp_spirits.max_range", "inc, dst"],
	["wisp_spirits.hero_hit_radius", "inc, dst"],
	["wisp_spirits.explode_radius", "inc, dst"],
	["wisp_spirits.hit_radius", "inc, dst"],
	["wisp_spirits.default_radius", "inc, dst"],
	["wisp_overcharge.bonus_attack_speed", "inc"],
	["wisp_overcharge.bonus_damage_pct", "inc, dmg, step"],
	["slark_dark_pact.pulse_duration", "inc, dur"],
	["slark_dark_pact.radius", "inc, dst"],
	["slark_dark_pact.total_damage", "inc, dmg"],
	["slark_pounce.pounce_distance", "inc, dst"],
	["slark_pounce.pounce_radius", "inc, dst"],
	["slark_pounce.pounce_damage", "inc, dmg"],
	["slark_pounce.leash_duration", "inc, dur"],
	["slark_pounce.leash_radius", "inc, dst"],
	["slark_essence_shift.duration", "inc, dur"],
	["slark_shadow_dance.duration", "inc, dur"],
	["slark_shadow_dance.fade_time", "dec"],
	["slark_shadow_dance.bonus_movement_speed", "inc"],
	["slark_shadow_dance.bonus_regen_pct", "inc"],
	["medusa_split_shot.damage_modifier", "dec, dmg, step"],
	["medusa_split_shot.arrow_count", "inc"],
	["medusa_split_shot.range", "inc, dst"],
	["medusa_mystic_snake.radius", "inc, dst"],
	["medusa_mystic_snake.snake_damage", "inc, dmg"],
	["medusa_mana_shield.damage_per_mana", "inc, dmg"],
	["medusa_stone_gaze.radius", "inc, dst"],
	["medusa_stone_gaze.duration", "inc, dur"],
	["medusa_stone_gaze.slow", "inc"],
	["medusa_stone_gaze.stone_duration", "inc, dur"],
	//["medusa_stone_gaze.face_duration", "inc, dur"],
	["medusa_stone_gaze.bonus_physical_damage", "inc, dmg, step"],
	["troll_warlord_berserkers_rage.bonus_damage", "inc, dmg"],
	["troll_warlord_berserkers_rage.bonus_move_speed", "inc"],
	//["troll_warlord_berserkers_rage.bonus_range", "inc, dst"],
	["troll_warlord_berserkers_rage.bonus_hp", "inc"],
	["troll_warlord_berserkers_rage.bonus_armor", "inc"],
	["troll_warlord_berserkers_rage.bash_chance", "inc, chance"],
	["troll_warlord_berserkers_rage.bash_duration", "inc, dur"],
	["troll_warlord_berserkers_rage.bash_damage", "inc, dmg"],
	["troll_warlord_whirling_axes_ranged.axe_range", "inc, dst"],
	["troll_warlord_whirling_axes_ranged.axe_damage", "inc, dmg"],
	["troll_warlord_whirling_axes_ranged.axe_slow_duration", "inc, dur"],
	["troll_warlord_whirling_axes_ranged.axe_count", "inc"],
	["troll_warlord_whirling_axes_melee.damage", "inc, dmg"],
	["troll_warlord_whirling_axes_melee.hit_radius", "inc, dst"],
	["troll_warlord_whirling_axes_melee.max_range", "inc, dst"],
	["troll_warlord_whirling_axes_melee.blind_duration", "inc, dur"],
	["troll_warlord_whirling_axes_melee.whirl_duration", "inc, dur"],
	["troll_warlord_fervor.max_stacks", "inc"],
	["troll_warlord_battle_trance.trance_duration", "inc, dur"],
	["centaur_hoof_stomp.radius", "inc, dst"],
	["centaur_hoof_stomp.stun_duration", "inc, stun, dur"],
	["centaur_hoof_stomp.stomp_damage", "inc, dmg"],
	["centaur_double_edge.edge_damage", "inc, dmg"],
	["centaur_double_edge.radius", "inc, dst"],
	["centaur_return.return_damage", "inc, dmg"],
	["centaur_stampede.duration", "inc, dur"],
	["centaur_stampede.base_damage", "inc, dmg"],
	["centaur_stampede.strength_damage", "inc, dmg"],
	["centaur_stampede.slow_duration", "inc, dur"],
	["centaur_stampede.radius", "inc, dst"],
	["centaur_stampede.slow_movement_speed", "inc"],
	["magnataur_shockwave.shock_distance", "inc, dst"],
	["magnataur_shockwave.shock_damage", "inc, dmg"],
	["magnataur_empower.empower_duration", "inc, dur"],
	["magnataur_empower.bonus_damage_pct", "inc, dmg"],
	["magnataur_empower.cleave_damage_pct", "inc, dmg"],
	["magnataur_empower.cleave_radius", "inc, dst"],
	["magnataur_skewer.skewer_radius", "inc, dst"],
	["magnataur_skewer.max_targets", "inc"],
	["magnataur_skewer.slow_duration", "inc, dur"],
	["magnataur_skewer.slow_pct", "inc"],
	["magnataur_skewer.skewer_damage", "inc, dmg"],
	["magnataur_skewer.range", "inc, dst"],
	["magnataur_skewer.tree_radius", "inc, dst"],
	["magnataur_reverse_polarity.pull_radius", "inc, dst"],
	["magnataur_reverse_polarity.polarity_damage", "inc, dmg"],
	["magnataur_reverse_polarity.hero_stun_duration", "inc, stun, dur"],
	["magnataur_reverse_polarity.creep_stun_duration", "inc, stun, dur"],
	["shredder_whirling_death.whirling_radius", "inc, dst"],
	["shredder_whirling_death.whirling_damage", "inc, dmg"],
	["shredder_whirling_death.duration", "inc, dur"],
	["shredder_timber_chain.chain_radius", "inc, dst"],
	["shredder_timber_chain.range", "inc, dst"],
	["shredder_timber_chain.damage_radius", "inc, dst"],
	["shredder_timber_chain.damage", "inc, dmg"],
	["shredder_reactive_armor.bonus_armor", "inc"],
	["shredder_reactive_armor.bonus_hp_regen", "inc"],
	["shredder_reactive_armor.stack_duration", "inc, dur"],
	["shredder_chakram.radius", "inc, dst"],
	["shredder_chakram.pass_damage", "inc, dmg"],
	["shredder_chakram.damage_per_second", "inc, dmg"],
	["shredder_chakram.slow", "inc"],
	["shredder_chakram.break_distance", "inc, dst"],
	["shredder_chakram.pass_slow_duration", "inc, dur"],
	["bristleback_viscous_nasal_goo.goo_duration", "inc, dur"],
	["bristleback_viscous_nasal_goo.armor_per_stack", "inc"],
	["bristleback_viscous_nasal_goo.base_move_slow", "inc"],
	["bristleback_viscous_nasal_goo.move_slow_per_stack", "inc"],
	["bristleback_viscous_nasal_goo.goo_duration_creep", "inc, dur"],
	["bristleback_quill_spray.radius", "inc, dst"],
	["bristleback_quill_spray.quill_base_damage", "inc, dmg"],
	["bristleback_quill_spray.quill_stack_damage", "inc, dmg"],
	["bristleback_quill_spray.quill_stack_duration", "inc, dur"],
	["bristleback_quill_spray.max_damage", "inc, dmg"],
	["bristleback_bristleback.side_damage_reduction", "inc, dmg"],
	["bristleback_bristleback.back_damage_reduction", "inc, dmg"],
	["bristleback_bristleback.quill_release_threshold", "inc"],
	["bristleback_warpath.base_damage", "inc, dmg"],
	["bristleback_warpath.damage_per_stack", "inc, dmg"],
	["bristleback_warpath.move_speed_per_stack", "inc"],
	["bristleback_warpath.stack_duration", "inc, dur"],
	["bristleback_warpath.max_stacks", "inc"],
	["tusk_ice_shards.shard_damage", "inc, dmg"],
	["tusk_ice_shards.shard_count", "inc"],
	["tusk_ice_shards.shard_duration", "inc, dur"],
	["tusk_ice_shards.shard_distance", "inc, dst"],
	["tusk_snowball.snowball_radius", "inc, dst"],
	["tusk_snowball.snowball_damage", "inc, dmg"],
	["tusk_snowball.stun_duration", "inc, stun, dur"],
	["tusk_snowball.bonus_damage", "inc, dmg"],
	["tusk_snowball.bonus_stun", "inc, stun, dur"],
	["tusk_snowball.snowball_duration", "inc, dur"],
	["tusk_snowball.snowball_range", "inc, dst"],
	["tusk_frozen_sigil.sigil_radius", "inc, dst"],
	["tusk_frozen_sigil.sigil_duration", "inc, dur"],
	["tusk_frozen_sigil.move_slow", "inc"],
	["tusk_frozen_sigil.attack_slow", "inc"],
	["tusk_walrus_punch.threshold_crit_multiplier", "inc"],
	["tusk_walrus_punch.hp_threshold", "inc"],
	["tusk_walrus_punch.slow_duration", "inc, dur"],
	["tusk_walrus_punch.move_slow", "inc"],
	["skywrath_mage_arcane_bolt.bolt_damage", "inc, dmg"],
	["skywrath_mage_concussive_shot.launch_radius", "inc, dst"],
	["skywrath_mage_concussive_shot.slow_radius", "inc, dst"],
	["skywrath_mage_concussive_shot.damage", "inc, dmg"],
	["skywrath_mage_concussive_shot.slow_duration", "inc, dur"],
	["skywrath_mage_ancient_seal.seal_duration", "inc, dur"],
	["skywrath_mage_mystic_flare.radius", "inc, dst"],
	["skywrath_mage_mystic_flare.duration", "inc, dur"],
	["skywrath_mage_mystic_flare.damage", "inc, dmg"],
	["abaddon_death_coil.self_damage", "inc, dmg"],
	["abaddon_death_coil.target_damage", "inc, dmg"],
	["abaddon_death_coil.heal_amount", "inc"],
	["abaddon_aphotic_shield.duration", "inc, dur"],
	["abaddon_aphotic_shield.damage_absorb", "inc, dmg"],
	["abaddon_aphotic_shield.radius", "inc, dst"],
	["abaddon_frostmourne.debuff_duration", "inc, dur"],
	["abaddon_frostmourne.buff_duration", "inc, dur"],
	["abaddon_frostmourne.slow_pct", "inc"],
	//["abaddon_borrowed_time.hp_threshold", "inc"],
	["abaddon_borrowed_time.duration", "inc, dur"],
	["abaddon_borrowed_time.duration_scepter", "inc, dur"],
	["elder_titan_echo_stomp.radius", "inc, dst"],
	["elder_titan_echo_stomp.sleep_duration", "inc, dur"],
	["elder_titan_echo_stomp.stomp_damage", "inc, dmg"],
	["elder_titan_echo_stomp.initial_stun_duration", "inc, stun, dur"],
	["elder_titan_echo_stomp_spirit.radius", "inc, dst"],
	["elder_titan_echo_stomp_spirit.sleep_duration", "inc, dur"],
	["elder_titan_echo_stomp_spirit.stomp_damage", "inc, dmg"],
	["elder_titan_ancestral_spirit.radius", "inc, dst"],
	["elder_titan_ancestral_spirit.pass_damage", "inc, dmg"],
	["elder_titan_ancestral_spirit.spirit_duration", "inc, dur"],
	["elder_titan_ancestral_spirit.buff_duration", "inc, dur"],
	["elder_titan_ancestral_spirit.damage_creeps", "inc, dmg"],
	["elder_titan_ancestral_spirit.damage_heroes", "inc, dmg"],
	["elder_titan_natural_order.radius", "inc, dst"],
	["elder_titan_natural_order.armor_reduction_pct", "inc"],
	["elder_titan_natural_order.magic_resistance_pct", "inc, mr"],
	["elder_titan_earth_splitter.crack_distance", "inc, dst"],
	["elder_titan_earth_splitter.slow_pct", "inc"],
	["elder_titan_earth_splitter.slow_duration", "inc, dur"],
	["elder_titan_earth_splitter.damage_pct", "inc, dmg"],
	["legion_commander_overwhelming_odds.radius", "inc, dst"],
	["legion_commander_overwhelming_odds.damage", "inc, dmg"],
	["legion_commander_overwhelming_odds.damage_per_unit", "inc, dmg"],
	["legion_commander_overwhelming_odds.duration", "inc, dur"],
	["legion_commander_overwhelming_odds.bonus_speed_creeps", "inc"],
	["legion_commander_overwhelming_odds.bonus_speed_heroes", "inc"],
	["legion_commander_press_the_attack.duration", "inc, dur"],
	["legion_commander_press_the_attack.hp_regen", "inc"],
	["legion_commander_moment_of_courage.buff_duration", "inc, dur"],
	["legion_commander_moment_of_courage.hp_leech_percent", "inc"],
	["legion_commander_duel.duration", "inc, dur"],
	["legion_commander_duel.reward_damage", "inc, dmg"],
	["backdoor_protection.radius", "inc, dst"],
	["backdoor_protection.regen_rate", "inc"],
	["backdoor_protection_in_base.regen_rate", "inc"],
	["necronomicon_warrior_last_will.explosion", "inc"],
	["necronomicon_warrior_sight.radius", "inc, dst"],
	["necronomicon_warrior_mana_burn.burn_amount", "inc"],
	["necronomicon_warrior_mana_burn.burn_damage_conversion", "inc, dmg"],
	["necronomicon_archer_mana_burn.burn_amount", "inc"],
	["necronomicon_archer_aoe.radius", "inc, dst"],
	["necronomicon_archer_aoe.speed_bonus", "inc"],
	["courier_transfer_items.handoff_distance", "inc, dst"],
	["courier_return_stash_items.handoff_distance", "inc, dst"],
	["courier_take_stash_items.stash_pickup_distance", "inc, dst"],
	["courier_shield.duration", "inc, dur"],
	["courier_burst.duration", "inc, dur"],
	["roshan_bash.bonus_damage", "inc, dmg"],
	["roshan_bash.stun_duration", "inc, stun, dur"],
	["roshan_slam.radius", "inc, dst"],
	["roshan_slam.slow_duration_hero", "inc, dur"],
	["roshan_slam.slow_duration_unit", "inc, dur"],
	["roshan_slam.slow_amount", "inc"],
	["roshan_slam.damage", "inc, dmg"],
	["kobold_taskmaster_speed_aura.bonus_movement_speed", "inc"],
	["kobold_taskmaster_speed_aura.radius", "inc, dst"],
	["centaur_khan_endurance_aura.bonus_attack_speed", "inc"],
	["centaur_khan_endurance_aura.radius", "inc, dst"],
	["centaur_khan_war_stomp.radius", "inc, dst"],
	["centaur_khan_war_stomp.non_hero_stun_duration", "inc, stun, dur"],
	["centaur_khan_war_stomp.hero_stun_duration", "inc, stun, dur"],
	["gnoll_assassin_envenomed_weapon.damage_per_second", "inc, dmg"],
	["gnoll_assassin_envenomed_weapon.non_hero_duration", "inc, dur"],
	["gnoll_assassin_envenomed_weapon.hero_duration", "inc, dur"],
	["ghost_frost_attack.movespeed_slow", "inc"],
	["ghost_frost_attack.attackspeed_slow", "inc"],
	["ghost_frost_attack.duration", "inc, dur"],
	["polar_furbolg_ursa_warrior_thunder_clap.radius", "inc, dst"],
	["polar_furbolg_ursa_warrior_thunder_clap.movespeed_slow", "inc"],
	["polar_furbolg_ursa_warrior_thunder_clap.attackspeed_slow", "inc"],
	["polar_furbolg_ursa_warrior_thunder_clap.duration", "inc, dur"],
	["ogre_magi_frost_armor.armor_bonus", "inc"],
	["ogre_magi_frost_armor.duration", "inc, dur"],
	["ogre_magi_frost_armor.movespeed_slow", "inc"],
	["ogre_magi_frost_armor.attackspeed_slow", "inc"],
	["ogre_magi_frost_armor.slow_duration", "inc, dur"],
	["dark_troll_warlord_ensnare.duration", "inc, dur"],
	["dark_troll_warlord_raise_dead.duration", "inc, dur"],
	["alpha_wolf_command_aura.bonus_damage_pct", "inc, dmg"],
	["alpha_wolf_command_aura.radius", "inc, dst"],
	["tornado_tempest.far_radius", "inc, dst"],
	["tornado_tempest.movespeed_slow", "inc"],
	["tornado_tempest.attackspeed_slow", "inc"],
	["tornado_tempest.near_radius", "inc, dst"],
	["tornado_tempest.near_damage", "inc, dmg"],
	["tornado_tempest.far_damage", "inc, dmg"],
	["enraged_wildkin_tornado.duration", "inc, dur"],
	["enraged_wildkin_toughness_aura.bonus_armor", "inc"],
	["enraged_wildkin_toughness_aura.radius", "inc, dst"],
	["satyr_trickster_purge.duration", "inc, dur"],
	["satyr_trickster_purge.summon_damage", "inc, dmg"],
	["satyr_soulstealer_mana_burn.burn_amount", "inc"],
	["satyr_hellcaller_shockwave.radius_start", "inc, dst"],
	["satyr_hellcaller_shockwave.radius_end", "inc, dst"],
	["satyr_hellcaller_shockwave.distance", "inc, dst"],
	["satyr_hellcaller_unholy_aura.health_regen", "inc"],
	["satyr_hellcaller_unholy_aura.radius", "inc, dst"],
	["forest_troll_high_priest_heal.health", "inc"],
	["harpy_storm_chain_lightning.initial_damage", "inc, dmg"],
	["harpy_storm_chain_lightning.jump_range", "inc, dst"],
	["harpy_storm_chain_lightning.damage_percent_loss", "inc, dmg"],
	["harpy_storm_chain_lightning.max_targets", "inc"],
	["black_dragon_splash_attack.range_close", "inc, dst"],
	["black_dragon_splash_attack.damage_percent_close", "inc, dmg"],
	["black_dragon_splash_attack.range_mid", "inc, dst"],
	["black_dragon_splash_attack.damage_percent_mid", "inc, dmg"],
	["black_dragon_splash_attack.range_far", "inc, dst"],
	["black_dragon_splash_attack.damage_percent_far", "inc, dmg"],
	["blue_dragonspawn_overseer_devotion_aura.bonus_armor", "inc"],
	["blue_dragonspawn_overseer_devotion_aura.radius", "inc, dst"],
	["big_thunder_lizard_slam.radius", "inc, dst"],
	["big_thunder_lizard_slam.movespeed_slow", "inc"],
	["big_thunder_lizard_slam.non_hero_duration", "inc, dur"],
	["big_thunder_lizard_slam.hero_duration", "inc, dur"],
	["big_thunder_lizard_frenzy.attackspeed_bonus", "inc"],
	["big_thunder_lizard_frenzy.duration", "inc, dur"],
	["forest_troll_high_priest_mana_aura.mana_regen", "inc"],
	["forest_troll_high_priest_mana_aura.radius", "inc, dst"],
	["roshan_halloween_candy.bonus_movement", "inc"],
	["roshan_halloween_candy.bonus_health", "inc"],
	["roshan_halloween_candy.bonus_damage", "inc, dmg"],
	["roshan_halloween_candy.bonus_armor", "inc"],
	["roshan_halloween_angry.bonus_movement", "inc"],
	["roshan_halloween_angry.bonus_health", "inc"],
	["roshan_halloween_angry.bonus_damage", "inc, dmg"],
	["roshan_halloween_angry.bonus_armor", "inc"],
	["roshan_halloween_wave_of_force.radius", "inc, dst"],
	["roshan_halloween_wave_of_force.duration", "inc, dur"],
	["roshan_halloween_greater_bash.duration", "inc, dur"],
	["roshan_halloween_greater_bash.knockback_duration", "inc, dur"],
	["roshan_halloween_greater_bash.knockback_distance", "inc, dst"],
	["roshan_halloween_toss.duration", "inc, dur"],
	["roshan_halloween_toss.grab_radius", "inc, dst"],
	["roshan_halloween_toss.radius", "inc, dst"],
	["roshan_halloween_toss.bonus_damage_pct", "inc, dmg"],
	["roshan_halloween_toss.grow_bonus_damage_pct", "inc, dmg"],
	["roshan_halloween_toss.toss_damage", "inc, dmg"],
	["roshan_halloween_shell.duration", "inc, dur"],
	["roshan_halloween_shell.bonus_spell_damage_pct", "inc, dmg"],
	["roshan_halloween_apocalypse.area_of_effect", "inc, dst"],
	["roshan_halloween_apocalypse.damage", "inc, dmg"],
	["roshan_halloween_burn.radius", "inc, dst"],
	["roshan_halloween_burn.damage", "inc, dmg"],
	["roshan_halloween_burn.projectile_count", "inc"],
	["greevil_magic_missile.customval_damage", "inc, dmg"],
	["greevil_cold_snap.duration", "inc, dur"],
	["greevil_cold_snap.customval_initial_damage", "inc, dmg"],
	["greevil_cold_snap.freeze_duration", "inc, dur"],
	["greevil_cold_snap.customval_damage", "inc, dmg"],
	["greevil_cold_snap.damage_trigger", "inc, dmg"],
	["greevil_decrepify.customval_spell_damage_pct", "inc, dmg"],
	["greevil_decrepify.bonus_movement_speed", "inc"],
	["greevil_decrepify.customval_duration", "inc, dur"],
	["greevil_diabolic_edict.num_explosions", "inc"],
	["greevil_diabolic_edict.radius", "inc, dst"],
	["greevil_diabolic_edict.customval_damage", "inc, dmg"],
	["greevil_diabolic_edict.duration", "inc, dur"],
	["greevil_maledict.customval_bonus_damage", "inc, dmg"],
	["greevil_maledict.bonus_damage_threshold", "inc, dmg"],
	["greevil_maledict.radius", "inc, dst"],
	["greevil_maledict.duration", "inc, dur"],
	["greevil_shadow_strike.customval_strike_damage", "inc, dmg"],
	["greevil_shadow_strike.customval_duration_damage", "inc, dur"],
	["greevil_shadow_strike.movement_slow", "inc"],
	["greevil_shadow_strike.duration", "inc, dur"],
	["greevil_laguna_blade.customval_damage", "inc, dmg"],
	["greevil_poison_nova.radius", "inc, dst"],
	["greevil_poison_nova.start_radius", "inc, dst"],
	["greevil_poison_nova.duration", "inc, dur"],
	["greevil_poison_nova.customval_damage", "inc, dmg"],
	["greevil_ice_wall.customval_duration", "inc, dur"],
	["greevil_ice_wall.slow", "inc"],
	["greevil_ice_wall.customval_damage_per_second", "inc, dmg"],
	["greevil_ice_wall.wall_place_distance", "inc, dst"],
	["greevil_ice_wall.wall_element_radius", "inc, dst"],
	["greevil_ice_wall.slow_duration", "inc, dur"],
	["greevil_fatal_bonds.count", "inc"],
	["greevil_fatal_bonds.duration", "inc, dur"],
	["greevil_fatal_bonds.search_aoe", "inc, dst"],
	["greevil_blade_fury.blade_fury_damage_tick", "inc, dmg"],
	["greevil_blade_fury.duration", "inc, dur"],
	["greevil_blade_fury.blade_fury_radius", "inc, dst"],
	["greevil_blade_fury.customval_damage", "inc, dmg"],
	["greevil_phantom_strike.bonus_attack_speed", "inc"],
	["greevil_phantom_strike.customval_bonus_attacks", "inc"],
	["greevil_time_lock.duration", "inc, dur"],
	["greevil_time_lock.customval_bonus_damage", "inc, dmg"],
	["greevil_shadow_wave.bounce_radius", "inc, dst"],
	["greevil_shadow_wave.damage_radius", "inc, dst"],
	["greevil_shadow_wave.max_targets", "inc"],
	["greevil_shadow_wave.customval_damage", "inc, dmg"],
	["greevil_leech_seed.customval_leech_damage", "inc, dmg"],
	["greevil_leech_seed.movement_slow", "inc"],
	["greevil_leech_seed.radius", "inc, dst"],
	["greevil_leech_seed.duration", "inc, dur"],
	["greevil_echo_slam.echo_slam_damage_range", "inc, dst"],
	["greevil_echo_slam.echo_slam_echo_search_range", "inc, dst"],
	["greevil_echo_slam.echo_slam_echo_range", "inc, dst"],
	["greevil_echo_slam.customval_echo_damage", "inc, dmg"],
	["greevil_echo_slam.customval_damage", "inc, dmg"],
	["greevil_natures_attendants.customval_heal", "inc"],
	["greevil_natures_attendants.radius", "inc, dst"],
	["greevil_natures_attendants.wisp_count", "inc"],
	["greevil_natures_attendants.duration", "inc, dur"],
	["greevil_bloodlust.duration", "inc, dur"],
	["greevil_bloodlust.customval_bonus_movement_speed", "inc"],
	["greevil_bloodlust.customval_bonus_attack_speed", "inc"],
	["greevil_purification.customval_heal", "inc"],
	["greevil_purification.radius", "inc, dst"],
	["greevil_flesh_golem.duration", "inc, dur"],
	["greevil_flesh_golem.customval_bonus_damage", "inc, dmg"],
	["greevil_flesh_golem.customval_armor_bonus", "inc"],
	["greevil_flesh_golem.health_regen", "inc"],
	["greevil_flesh_golem.radius", "inc, dst"],
	["greevil_hook.hook_distance", "inc, dst"],
	["greevil_hook.customval_damage", "inc, dmg"],
	["greevil_rot.rot_radius", "inc, dst"],
	["greevil_rot.rot_slow", "inc"],
	["greevil_rot.customval_damage", "inc, dmg"],
	["greevil_black_hole.customval_pull_radius", "inc, dst"],
	["greevil_black_hole.customval_far_radius", "inc, dst"],
	["greevil_black_hole.near_radius", "inc, dst"],
	["greevil_black_hole.customval_far_damage", "inc, dmg"],
	["greevil_black_hole.customval_near_damage", "inc, dmg"],
	["greevil_black_hole.duration", "inc, dur"],
	["greevil_miniboss_black_nightmare.duration", "inc, dur"],
	["greevil_miniboss_blue_cold_feet.damage", "inc, dmg"],
	["greevil_miniboss_blue_cold_feet.break_distance", "inc, dst"],
	["greevil_miniboss_blue_cold_feet.stun_duration", "inc, stun, dur"],
	["greevil_miniboss_blue_ice_vortex.radius", "inc, dst"],
	["greevil_miniboss_red_earthshock.shock_radius", "inc, dst"],
	["greevil_miniboss_red_earthshock.movement_slow", "inc"],
	["greevil_miniboss_red_overpower.max_attacks", "inc"],
	["greevil_miniboss_red_overpower.attack_speed_bonus_pct", "inc"],
	["greevil_miniboss_yellow_ion_shell.radius", "inc, dst"],
	["greevil_miniboss_yellow_ion_shell.damage_per_second", "inc, dmg"],
	["greevil_miniboss_yellow_ion_shell.duration", "inc, dur"],
	["greevil_miniboss_yellow_surge.duration", "inc, dur"],
	["greevil_miniboss_white_purification.heal", "inc"],
	["greevil_miniboss_white_purification.radius", "inc, dst"],
	["greevil_miniboss_white_degen_aura.speed_bonus", "inc"],
	["greevil_miniboss_white_degen_aura.radius", "inc, dst"],
	["greevil_miniboss_green_living_armor.damage_count", "inc, dmg"],
	["greevil_miniboss_green_living_armor.health_regen", "inc"],
	["greevil_miniboss_green_living_armor.damage_block", "inc, dmg"],
	["greevil_miniboss_green_living_armor.duration", "inc, dur"],
	["greevil_miniboss_green_overgrowth.duration", "inc, dur"],
	["greevil_miniboss_green_overgrowth.radius", "inc, dst"],
	["greevil_miniboss_orange_dragon_slave.dragon_slave_distance", "inc, dst"],
	["greevil_miniboss_orange_light_strike_array.light_strike_array_aoe", "inc, dst"],
	["greevil_miniboss_orange_light_strike_array.light_strike_array_stun_duration", "inc, stun, dur"],
	["greevil_miniboss_purple_venomous_gale.duration", "inc, dur"],
	["greevil_miniboss_purple_venomous_gale.strike_damage", "inc, dmg"],
	["greevil_miniboss_purple_venomous_gale.tick_damage", "inc, dmg"],
	["greevil_miniboss_purple_venomous_gale.movement_slow", "inc"],
	["greevil_miniboss_purple_venomous_gale.radius", "inc, dst"],
	["greevil_miniboss_purple_plague_ward.duration", "inc, dur"],
	["greevil_miniboss_sight.radius", "inc, dst"],
	["healing_campfire.heal_amount", "inc"],
	["healing_campfire.healing_aura_radius", "inc, dst"],
	["item_blink.blink_range", "inc, dst"],
	["item_blink.blink_range_clamp", "inc, dst"],
	["item_blades_of_attack.bonus_damage", "inc, dmg"],
	["item_broadsword.bonus_damage", "inc, dmg"],
	["item_chainmail.bonus_armor", "inc"],
	["item_claymore.bonus_damage", "inc, dmg"],
	["item_helm_of_iron_will.bonus_armor", "inc"],
	["item_helm_of_iron_will.bonus_regen", "inc"],
	["item_javelin.bonus_damage", "inc, dmg"],
	["item_javelin.bonus_chance", "inc, chance"],
	["item_javelin.bonus_chance_damage", "inc, chance"],
	["item_mithril_hammer.bonus_damage", "inc, dmg"],
	["item_platemail.bonus_armor", "inc"],
	["item_quarterstaff.bonus_damage", "inc, dmg"],
	["item_quarterstaff.bonus_speed", "inc"],
	["item_quelling_blade.damage_bonus", "inc, dmg"],
	["item_quelling_blade.damage_bonus_ranged", "inc, dst"],
	["item_ring_of_protection.bonus_armor", "inc"],
	["item_stout_shield.damage_block_melee", "inc, dmg"],
	["item_stout_shield.damage_block_ranged", "inc, dst"],
	["item_gauntlets.bonus_strength", "inc"],
	["item_slippers.bonus_agility", "inc"],
	["item_mantle.bonus_intellect", "inc"],
	["item_branches.bonus_all_stats", "inc"],
	["item_belt_of_strength.bonus_strength", "inc"],
	["item_boots_of_elves.bonus_agility", "inc"],
	["item_robe.bonus_intellect", "inc"],
	["item_circlet.bonus_all_stats", "inc"],
	["item_ogre_axe.bonus_strength", "inc"],
	["item_blade_of_alacrity.bonus_agility", "inc"],
	["item_staff_of_wizardry.bonus_intellect", "inc"],
	["item_ultimate_orb.bonus_all_stats", "inc"],
	["item_gloves.bonus_attack_speed", "inc"],
	["item_ring_of_regen.bonus_health_regen", "inc"],
	["item_sobi_mask.bonus_mana_regen", "inc"],
	//["item_boots.bonus_movement_speed", "inc"],
	["item_gem.radius", "inc, dst"],
	["item_cloak.bonus_magical_armor", "inc"],
	["item_talisman_of_evasion.bonus_evasion", "inc"],
	["item_cheese.health_restore", "inc"],
	["item_magic_stick.max_charges", "inc"],
	["item_magic_stick.charge_radius", "inc, dst"],
	["item_magic_wand.max_charges", "inc"],
	["item_magic_wand.charge_radius", "inc, dst"],
	["item_magic_wand.bonus_all_stats", "inc"],
	["item_ghost.bonus_all_stats", "inc"],
	["item_ghost.extra_spell_damage_percent", "inc, dmg"],
	["item_ghost.duration", "inc, dur"],
	["item_clarity.buff_duration", "inc, dur"],
	["item_flask.buff_duration", "inc, dur"],
	["item_flask.total_health", "inc"],
	["item_dust.duration", "inc, dur"],
	["item_dust.radius", "inc, dst"],
	["item_bottle.health_restore", "inc"],
	["item_bottle.movement_speed_percent_bonus", "inc"],
	["item_ward_observer.health", "inc"],
	["item_ward_sentry.true_sight_range", "inc, dst"],
	["item_ward_sentry.health", "inc"],
	["item_tango.buff_duration", "inc, dur"],
	["item_tango.total_heal", "inc"],
	//["item_tpscroll.minimun_distance", "inc, dst"],
	//["item_tpscroll.maximum_distance", "inc, dst"],
	//["item_travel_boots.bonus_movement_speed", "inc"],
	["item_phase_boots.phase_duration", "inc, dur"],
	//["item_phase_boots.bonus_movement_speed", "inc"],
	["item_phase_boots.bonus_damage", "inc, dmg"],
	["item_demon_edge.bonus_damage", "inc, dmg"],
	["item_eagle.bonus_agility", "inc"],
	["item_reaver.bonus_strength", "inc"],
	["item_relic.bonus_damage", "inc, dmg"],
	["item_hyperstone.bonus_attack_speed", "inc"],
	["item_ring_of_health.bonus_health_regen", "inc"],
	["item_void_stone.bonus_mana_regen", "inc"],
	["item_mystic_staff.bonus_intellect", "inc"],
	["item_energy_booster.bonus_mana", "inc"],
	["item_point_booster.bonus_mana", "inc"],
	["item_point_booster.bonus_health", "inc"],
	["item_vitality_booster.bonus_health", "inc"],
	//["item_power_treads.bonus_movement_speed", "inc"],
	["item_power_treads.bonus_stat", "inc"],
	["item_power_treads.bonus_attack_speed", "inc"],
	["item_hand_of_midas.bonus_attack_speed", "inc"],
	["item_hand_of_midas.bonus_gold", "inc"],
	["item_oblivion_staff.bonus_intellect", "inc"],
	["item_oblivion_staff.bonus_attack_speed", "inc"],
	["item_oblivion_staff.bonus_damage", "inc, dmg"],
	["item_oblivion_staff.bonus_mana_regen", "inc"],
	["item_pers.bonus_damage", "inc, dmg"],
	["item_pers.bonus_health_regen", "inc"],
	["item_pers.bonus_mana_regen", "inc"],
	["item_poor_mans_shield.damage_block_melee", "inc, dmg"],
	["item_poor_mans_shield.damage_block_ranged", "inc, dst"],
	["item_poor_mans_shield.bonus_agility", "inc"],
	["item_bracer.bonus_strength", "inc"],
	["item_bracer.bonus_agility", "inc"],
	["item_bracer.bonus_intellect", "inc"],
	["item_bracer.bonus_damage", "inc, dmg"],
	["item_wraith_band.bonus_strength", "inc"],
	["item_wraith_band.bonus_agility", "inc"],
	["item_wraith_band.bonus_intellect", "inc"],
	["item_wraith_band.bonus_damage", "inc, dmg"],
	["item_null_talisman.bonus_strength", "inc"],
	["item_null_talisman.bonus_agility", "inc"],
	["item_null_talisman.bonus_intellect", "inc"],
	["item_null_talisman.bonus_damage", "inc, dmg"],
	["item_mekansm.bonus_all_stats", "inc"],
	["item_mekansm.bonus_armor", "inc"],
	["item_mekansm.aura_radius", "inc, dst"],
	["item_mekansm.aura_health_regen", "inc"],
	["item_mekansm.heal_amount", "inc"],
	["item_mekansm.heal_radius", "inc, dst"],
	["item_mekansm.heal_bonus_armor", "inc"],
	["item_mekansm.heal_armor_duration", "inc, dur"],
	["item_vladmir.aura_radius", "inc, dst"],
	["item_vladmir.damage_aura", "inc, dmg"],
	["item_vladmir.armor_aura", "inc"],
	["item_vladmir.mana_regen_aura", "inc"],
	["item_vladmir.hp_regen", "inc"],
	["item_buckler.bonus_armor", "inc"],
	["item_buckler.bonus_all_stats", "inc"],
	["item_buckler.bonus_aoe_radius", "inc, dst"],
	["item_buckler.bonus_aoe_armor", "inc, dst"],
	["item_buckler.bonus_aoe_duration", "inc, dur"],
	["item_buckler.bonus_aoe_duration_hero", "inc, dur"],
	["item_ring_of_basilius.bonus_damage", "inc, dmg"],
	["item_ring_of_basilius.aura_radius", "inc, dst"],
	["item_ring_of_basilius.aura_mana_regen", "inc"],
	["item_ring_of_basilius.aura_bonus_armor", "inc"],
	["item_ring_of_basilius.bonus_armor", "inc"],
	["item_pipe.health_regen", "inc"],
	["item_pipe.magic_resistance", "inc, mr"],
	["item_pipe.barrier_radius", "inc, dst"],
	["item_pipe.barrier_duration", "inc, dur"],
	["item_pipe.barrier_debuff_duration", "inc, dur"],
	["item_urn_of_shadows.mana_regen", "inc"],
	["item_urn_of_shadows.bonus_strength", "inc"],
	["item_urn_of_shadows.soul_radius", "inc, dst"],
	["item_urn_of_shadows.soul_heal_amount", "inc"],
	["item_urn_of_shadows.soul_heal_duration", "inc, dur"],
	["item_urn_of_shadows.soul_damage_amount", "inc, dmg"],
	["item_urn_of_shadows.soul_damage_duration", "inc, dur"],
	["item_headdress.bonus_all_stats", "inc"],
	["item_headdress.aura_radius", "inc, dst"],
	["item_headdress.aura_health_regen", "inc"],
	["item_sheepstick.bonus_strength", "inc"],
	["item_sheepstick.bonus_agility", "inc"],
	["item_sheepstick.bonus_intellect", "inc"],
	["item_sheepstick.bonus_mana_regen", "inc"],
	["item_sheepstick.sheep_duration", "inc, dur"],
	["item_orchid.bonus_intellect", "inc"],
	["item_orchid.bonus_attack_speed", "inc"],
	["item_orchid.bonus_damage", "inc, dmg"],
	["item_orchid.bonus_mana_regen", "inc"],
	["item_orchid.silence_duration", "inc, dur"],
	["item_orchid.silence_damage_percent", "inc, dmg"],
	["item_cyclone.bonus_intellect", "inc"],
	["item_cyclone.bonus_mana_regen", "inc"],
	//["item_cyclone.bonus_movement_speed", "inc"],
	["item_cyclone.cyclone_duration", "inc, dur"],
	["item_force_staff.bonus_intellect", "inc"],
	["item_force_staff.bonus_health_regen", "inc"],
	["item_force_staff.push_length", "inc, dst"],
	["item_dagon.bonus_intellect", "inc"],
	["item_dagon.bonus_all_stats", "inc"],
	["item_dagon.bonus_damage", "inc, dmg"],
	["item_dagon.damage", "inc, dmg"],
	["item_dagon_2.bonus_intellect", "inc"],
	["item_dagon_2.bonus_all_stats", "inc"],
	["item_dagon_2.bonus_damage", "inc, dmg"],
	["item_dagon_2.damage", "inc, dmg"],
	["item_dagon_3.bonus_intellect", "inc"],
	["item_dagon_3.bonus_all_stats", "inc"],
	["item_dagon_3.bonus_damage", "inc, dmg"],
	["item_dagon_3.damage", "inc, dmg"],
	["item_dagon_4.bonus_intellect", "inc"],
	["item_dagon_4.bonus_all_stats", "inc"],
	["item_dagon_4.bonus_damage", "inc, dmg"],
	["item_dagon_4.damage", "inc, dmg"],
	["item_dagon_5.bonus_intellect", "inc"],
	["item_dagon_5.bonus_all_stats", "inc"],
	["item_dagon_5.bonus_damage", "inc, dmg"],
	["item_dagon_5.damage", "inc, dmg"],
	["item_necronomicon.bonus_intellect", "inc"],
	["item_necronomicon.bonus_strength", "inc"],
	["item_necronomicon.summon_duration", "inc, dur"],
	["item_necronomicon.archer_attack_speed_radius", "inc, dst"],
	["item_necronomicon_2.bonus_intellect", "inc"],
	["item_necronomicon_2.bonus_strength", "inc"],
	["item_necronomicon_2.summon_duration", "inc, dur"],
	["item_necronomicon_2.archer_attack_speed_radius", "inc, dst"],
	["item_necronomicon_3.bonus_intellect", "inc"],
	["item_necronomicon_3.bonus_strength", "inc"],
	["item_necronomicon_3.summon_duration", "inc, dur"],
	["item_necronomicon_3.archer_attack_speed_radius", "inc, dst"],
	["item_ultimate_scepter.bonus_all_stats", "inc"],
	["item_ultimate_scepter.bonus_health", "inc"],
	["item_ultimate_scepter.bonus_mana", "inc"],
	["item_refresher.bonus_health_regen", "inc"],
	["item_refresher.bonus_mana_regen", "inc"],
	["item_refresher.bonus_damage", "inc, dmg"],
	["item_refresher.bonus_int", "inc"],
	["item_assault.bonus_attack_speed", "inc"],
	["item_assault.bonus_armor", "inc"],
	["item_assault.aura_radius", "inc, dst"],
	["item_assault.aura_positive_armor", "inc"],
	["item_assault.aura_negative_armor", "inc"],
	["item_heart.bonus_strength", "inc"],
	["item_heart.bonus_health", "inc"],
	["item_heart.health_regen_rate", "inc"],
	["item_black_king_bar.bonus_strength", "inc"],
	["item_black_king_bar.bonus_damage", "inc, dmg"],
	["item_black_king_bar.duration", "inc, dur"],
	["item_black_king_bar.max_level", "inc"],
	["item_shivas_guard.bonus_intellect", "inc"],
	["item_shivas_guard.bonus_armor", "inc"],
	["item_shivas_guard.aura_radius", "inc, dst"],
	["item_shivas_guard.blast_radius", "inc, dst"],
	["item_shivas_guard.blast_damage", "inc, dmg"],
	["item_shivas_guard.blast_debuff_duration", "inc, dur"],
	["item_bloodstone.bonus_health", "inc"],
	["item_bloodstone.bonus_mana", "inc"],
	["item_bloodstone.bonus_health_regen", "inc"],
	["item_bloodstone.bonus_mana_regen", "inc"],
	["item_bloodstone.charge_range", "inc, dst"],
	["item_bloodstone.heal_on_death_range", "inc, dst"],
	["item_bloodstone.heal_on_death_base", "inc"],
	["item_bloodstone.heal_on_death_per_charge", "inc"],
	["item_bloodstone.respawn_time_reduction", "inc"],
	["item_bloodstone.death_gold_reduction", "inc"],
	["item_sphere.bonus_all_stats", "inc"],
	["item_sphere.bonus_health_regen", "inc"],
	["item_sphere.bonus_mana_regen", "inc"],
	["item_sphere.bonus_damage", "inc, dmg"],
	["item_vanguard.bonus_health", "inc"],
	["item_vanguard.bonus_health_regen", "inc"],
	["item_vanguard.block_damage_ranged", "inc, dst"],
	["item_vanguard.block_damage_melee", "inc, dmg"],
	["item_blade_mail.bonus_damage", "inc, dmg"],
	["item_blade_mail.bonus_armor", "inc"],
	["item_blade_mail.bonus_intellect", "inc"],
	["item_blade_mail.duration", "inc, dur"],
	["item_soul_booster.bonus_health", "inc"],
	["item_soul_booster.bonus_mana", "inc"],
	["item_soul_booster.bonus_health_regen", "inc"],
	["item_soul_booster.bonus_mana_regen", "inc"],
	["item_hood_of_defiance.bonus_spell_resist", "inc, mr"],
	["item_hood_of_defiance.bonus_health_regen", "inc"],
	["item_rapier.bonus_damage", "inc, dmg"],
	["item_monkey_king_bar.bonus_damage", "inc, dmg"],
	["item_monkey_king_bar.bonus_attack_speed", "inc"],
	["item_monkey_king_bar.bash_damage", "inc, dmg"],
	["item_radiance.bonus_damage", "inc, dmg"],
	["item_radiance.aura_radius", "inc, dst"],
	["item_radiance.aura_damage", "inc, dmg"],
	["item_butterfly.bonus_agility", "inc"],
	["item_butterfly.bonus_damage", "inc, dmg"],
	["item_butterfly.bonus_evasion", "inc"],
	["item_butterfly.bonus_attack_speed", "inc"],
	["item_greater_crit.bonus_damage", "inc, dmg"],
	["item_basher.bonus_damage", "inc, dmg"],
	["item_basher.bonus_strength", "inc"],
	["item_basher.bash_chance_ranged", "inc, chance"],
	["item_basher.bash_duration", "inc, dur"],
	["item_bfury.bonus_damage", "inc, dmg"],
	["item_bfury.bonus_health_regen", "inc"],
	["item_bfury.bonus_mana_regen", "inc"],
	["item_bfury.cleave_damage_percent", "inc, dmg"],
	["item_bfury.cleave_radius", "inc, dst"],
	["item_manta.bonus_strength", "inc"],
	["item_manta.bonus_agility", "inc"],
	["item_manta.bonus_intellect", "inc"],
	["item_manta.bonus_attack_speed", "inc"],
	["item_manta.bonus_movement_speed", "inc"],
	["item_manta.images_count", "inc"],
	["item_lesser_crit.bonus_damage", "inc, dmg"],
	["item_armlet.bonus_damage", "inc, dmg"],
	["item_armlet.bonus_attack_speed", "inc"],
	["item_armlet.bonus_armor", "inc"],
	["item_armlet.bonus_health_regen", "inc"],
	["item_armlet.unholy_bonus_damage", "inc, dmg"],
	["item_armlet.unholy_bonus_attack_speed", "inc"],
	["item_armlet.unholy_bonus_strength", "inc"],
	["item_armlet.unholy_health_drain", "inc"],
	["item_invis_sword.bonus_damage", "inc, dmg"],
	["item_invis_sword.bonus_attack_speed", "inc"],
	["item_invis_sword.windwalk_duration", "inc, dur"],
	["item_invis_sword.windwalk_fade_time", "dec"],
	["item_invis_sword.windwalk_bonus_damage", "inc, dmg"],
	["item_sange_and_yasha.bonus_damage", "inc, dmg"],
	["item_sange_and_yasha.bonus_strength", "inc"],
	["item_sange_and_yasha.bonus_agility", "inc"],
	["item_sange_and_yasha.bonus_attack_speed", "inc"],
	["item_sange_and_yasha.movement_speed_percent_bonus", "inc"],
	["item_sange_and_yasha.maim_slow_movement", "inc"],
	["item_sange_and_yasha.maim_slow_attack", "inc"],
	["item_sange_and_yasha.maim_duration", "inc, dur"],
	["item_satanic.bonus_damage", "inc, dmg"],
	["item_satanic.bonus_strength", "inc"],
	["item_satanic.bonus_armor", "inc"],
	["item_satanic.unholy_duration", "inc, dur"],
	["item_mjollnir.bonus_damage", "inc, dmg"],
	["item_mjollnir.bonus_attack_speed", "inc"],
	["item_mjollnir.static_duration", "inc, dur"],
	["item_mjollnir.static_damage", "inc, dmg"],
	["item_mjollnir.static_primary_radius", "inc, dst"],
	["item_mjollnir.static_seconary_radius", "inc, dst"],
	["item_mjollnir.static_radius", "inc, dst"],
	["item_mjollnir.chain_damage", "inc, dmg"],
	["item_mjollnir.chain_radius", "inc, dst"],
	["item_skadi.bonus_all_stats", "inc"],
	["item_skadi.bonus_health", "inc"],
	["item_skadi.bonus_mana", "inc"],
	["item_skadi.cold_duration_melee", "inc, dur"],
	["item_skadi.cold_duration_ranged", "inc, dur"],
	["item_sange.bonus_damage", "inc, dmg"],
	["item_sange.bonus_strength", "inc"],
	["item_sange.maim_duration", "inc, dur"],
	["item_helm_of_the_dominator.bonus_damage", "inc, dmg"],
	["item_helm_of_the_dominator.bonus_armor", "inc"],
	["item_helm_of_the_dominator.dominate_duration", "inc, dur"],
	["item_maelstrom.bonus_damage", "inc, dmg"],
	["item_maelstrom.bonus_attack_speed", "inc"],
	["item_maelstrom.chain_damage", "inc, dmg"],
	["item_maelstrom.chain_radius", "inc, dst"],
	["item_desolator.bonus_damage", "inc, dmg"],
	["item_desolator.corruption_armor", "inc"],
	["item_desolator.corruption_duration", "inc, dur"],
	["item_yasha.bonus_agility", "inc"],
	["item_yasha.bonus_attack_speed", "inc"],
	["item_yasha.movement_speed_percent_bonus", "inc"],
	["item_mask_of_madness.berserk_bonus_attack_speed", "inc"],
	["item_mask_of_madness.berserk_bonus_movement_speed", "inc"],
	["item_mask_of_madness.berserk_extra_damage", "inc, dmg"],
	["item_mask_of_madness.berserk_duration", "inc, dur"],
	["item_diffusal_blade.bonus_agility", "inc"],
	["item_diffusal_blade.bonus_intellect", "inc"],
	["item_diffusal_blade.purge_summoned_damage", "inc, dmg"],
	["item_diffusal_blade.purge_root_duration", "inc, dur"],
	["item_diffusal_blade.purge_slow_duration", "inc, dur"],
	["item_diffusal_blade_2.bonus_agility", "inc"],
	["item_diffusal_blade_2.bonus_intellect", "inc"],
	["item_diffusal_blade_2.purge_summoned_damage", "inc, dmg"],
	["item_diffusal_blade_2.purge_root_duration", "inc, dur"],
	["item_diffusal_blade_2.purge_slow_duration", "inc, dur"],
	["item_ethereal_blade.bonus_agility", "inc"],
	["item_ethereal_blade.bonus_strength", "inc"],
	["item_ethereal_blade.bonus_intellect", "inc"],
	["item_ethereal_blade.blast_movement_slow", "inc"],
	["item_ethereal_blade.duration", "inc, dur"],
	["item_ethereal_blade.blast_damage_base", "inc, dmg"],
	["item_ethereal_blade.ethereal_damage_bonus", "inc, dmg"],
	["item_ethereal_blade.duration_ally", "inc, dur"],
	["item_soul_ring.health_regen", "inc"],
	["item_soul_ring.mana_regen", "inc"],
	["item_soul_ring.health_sacrifice", "inc"],
	["item_soul_ring.duration", "inc, dur"],
	//["item_arcane_boots.bonus_movement", "inc"],
	["item_arcane_boots.bonus_mana", "inc"],
	["item_arcane_boots.replenish_radius", "inc, dst"],
	["item_arcane_boots.replenish_amount", "inc"],
	["item_orb_of_venom.poison_movement_speed_range", "inc, dst"],
	["item_orb_of_venom.poison_duration", "inc, dur"],
	["item_orb_of_venom.poison_damage", "inc, dmg"],
	["item_ancient_janggo.bonus_stats", "inc"],
	["item_ancient_janggo.bonus_damage", "inc, dmg"],
	["item_ancient_janggo.bonus_aura_attack_speed_pct", "inc"],
	["item_ancient_janggo.bonus_aura_movement_speed_pct", "inc"],
	["item_ancient_janggo.bonus_attack_speed_pct", "inc"],
	["item_ancient_janggo.bonus_movement_speed_pct", "inc"],
	["item_ancient_janggo.duration", "inc, dur"],
	["item_ancient_janggo.radius", "inc, dst"],
	["item_medallion_of_courage.bonus_armor", "inc"],
	["item_medallion_of_courage.bonus_mana_regen_pct", "inc"],
	["item_medallion_of_courage.armor_reduction", "inc"],
	["item_medallion_of_courage.duration", "inc, dur"],
	//["item_smoke_of_deceit.application_radius", "inc, dst"],
	//["item_smoke_of_deceit.visibility_radius", "inc, dst"],
	["item_smoke_of_deceit.bonus_movement_speed", "inc"],
	["item_smoke_of_deceit.duration", "inc, dur"],
	["item_veil_of_discord.bonus_armor", "inc"],
	["item_veil_of_discord.bonus_intellect", "inc"],
	["item_veil_of_discord.bonus_health_regen", "inc"],
	["item_veil_of_discord.debuff_radius", "inc, dst"],
	["item_veil_of_discord.resist_debuff_duration", "inc, dur"],
	["item_rod_of_atos.bonus_intellect", "inc"],
	["item_rod_of_atos.bonus_health", "inc"],
	["item_rod_of_atos.slow", "inc"],
	["item_rod_of_atos.duration", "inc, dur"],
	["item_abyssal_blade.bonus_damage", "inc, dmg"],
	["item_abyssal_blade.bonus_strength", "inc"],
	["item_abyssal_blade.bash_chance_ranged", "inc, chance"],
	["item_abyssal_blade.bash_duration", "inc, dur"],
	["item_abyssal_blade.stun_duration", "inc, stun, dur"],
	["item_heavens_halberd.bonus_damage", "inc, dmg"],
	["item_heavens_halberd.bonus_strength", "inc"],
	["item_heavens_halberd.maim_duration", "inc, dur"],
	["item_heavens_halberd.bonus_evasion", "inc"],
	["item_heavens_halberd.disarm_range", "inc, dst"],
	["item_ring_of_aquila.bonus_damage", "inc, dmg"],
	["item_ring_of_aquila.bonus_all_stats", "inc"],
	["item_ring_of_aquila.bonus_agility", "inc"],
	["item_ring_of_aquila.bonus_armor", "inc"],
	["item_ring_of_aquila.aura_radius", "inc, dst"],
	["item_ring_of_aquila.aura_mana_regen", "inc"],
	["item_ring_of_aquila.aura_bonus_armor", "inc"],
	//["item_tranquil_boots.bonus_movement_speed", "inc"],
	["item_tranquil_boots.bonus_armor", "inc"],
	["item_tranquil_boots.bonus_health_regen", "inc"],
	["item_tranquil_boots.heal_duration", "inc, dur"],
	["item_tranquil_boots.heal_amount", "inc"],
	["item_tranquil_boots.break_count", "inc"],
	["item_tranquil_boots.break_threshold", "inc"],
	["item_shadow_amulet.fade_time", "dec"],
	["item_shadow_amulet.bonus_attack_speed", "inc"],
	["item_mystery_hook.hook_distance", "inc, dst"],
	["item_mystery_arrow.arrow_range", "inc, dst"],
	["item_mystery_arrow.arrow_max_stunrange", "inc, stun, dur"],
	["item_mystery_arrow.arrow_min_stun", "inc, stun, dur"],
	["item_mystery_arrow.arrow_max_stun", "inc, stun, dur"],
	["item_mystery_missile.stun_duration", "inc, stun, dur"],
	["item_mystery_missile.attack_speed_bonus_pct", "inc"],
	["item_mystery_missile.min_damage", "inc, dmg"],
	["item_mystery_missile.max_distance", "inc, dst"],
	["item_mystery_missile.hero_damage", "inc, dmg"],
	["item_mystery_toss.duration", "inc, dur"],
	["item_mystery_toss.grab_radius", "inc, dst"],
	["item_mystery_toss.radius", "inc, dst"],
	["item_mystery_toss.bonus_damage_pct", "inc, dmg"],
	["item_mystery_toss.grow_bonus_damage_pct", "inc, dmg"],
	["item_mystery_toss.toss_damage", "inc, dmg"],
	["item_mystery_vacuum.radius", "inc, dst"],
	["item_mystery_vacuum.duration", "inc, dur"],
	["item_mystery_vacuum.damage", "inc, dmg"],
	["item_mystery_vacuum.radius_tree", "inc, dst"],
	["item_halloween_rapier.bonus_damage", "inc, dmg"],
	["item_greevil_whistle.duration", "inc, dur"],
	["item_greevil_whistle.transform_duration", "inc, dur"],
	["item_greevil_whistle_toggle.duration", "inc, dur"],
	["item_greevil_whistle_toggle.transform_duration", "inc, dur"],
	["item_winter_skates.bonus_movement_speed", "inc"],
	["item_winter_cake.buff_duration", "inc, dur"],
	["item_winter_cake.total_health", "inc"],
	["item_winter_cookie.buff_duration", "inc, dur"],
	["item_winter_cookie.total_health", "inc"],
	["item_winter_coco.buff_duration", "inc, dur"],
	["item_winter_coco.total_health", "inc"],
	["item_winter_ham.buff_duration", "inc, dur"],
	["item_winter_ham.total_health", "inc"],
	["item_winter_kringle.buff_duration", "inc, dur"],
	["item_winter_kringle.total_health", "inc"],
	["item_winter_greevil_treat.duration", "inc, dur"],
	["item_winter_greevil_garbage.buff_duration", "inc, dur"],
	["item_winter_greevil_garbage.total_health", "inc"]
]

var abilityDamage =
[
	["axe_battle_hunger",15,21,27,33],
	["axe_counter_helix",100,135,170,205],
	["bane_brain_sap",90,160,230,300],
	["bane_nightmare",20,20,20,20],
	["bloodseeker_bloodrage",20,20,20,20],
	["bloodseeker_rupture",150,250,350],
	["earthshaker_fissure",125,175,225,275],
	["earthshaker_aftershock",50,75,100,125],
	["earthshaker_echo_slam",160,210,270],
	["juggernaut_blade_fury",80,100,120,140],
	["kunkka_torrent",120,180,240,300],
	["kunkka_ghostship",350,450,550],
	["lina_dragon_slave",100,170,230,280],
	["lina_light_strike_array",90,150,210,280],
	["lion_impale",60,130,200,260],
	["mirana_arrow",90,180,270,360],
	["mirana_starfall",75,150,225,300],
	["morphling_waveform",100,175,250,325],
	["nevermore_shadowraze1",75,150,225,300],
	["nevermore_shadowraze2",75,150,225,300],
	["nevermore_shadowraze3",75,150,225,300],
	["nevermore_requiem",80,120,160],
	["phantom_lancer_spirit_lance",100,150,200,250],
	["puck_illusory_orb",70,140,210,280],
	["puck_waning_rift",70,140,210,280],
	["pudge_meat_hook",90,180,270,360],
	["pudge_rot",35,60,85,110],
	["shadow_shaman_ether_shock",140,200,260,320],
	["shadow_shaman_shackles",40,40,40,40],
	["razor_unstable_current",40,70,100,130],
	["skeleton_king_hellfire_blast",50,100,150,200],
	["death_prophet_carrion_swarm",100,175,250,300],
	["sven_storm_bolt",100,175,250,325],
	["storm_spirit_static_remnant",140,180,220,260],
	["storm_spirit_overload",30,50,70,90],
	["storm_spirit_ball_lightning",8,12,16],
	["sandking_burrowstrike",100,160,220,280],
	["sandking_sand_storm",20,40,60,80],
	["sandking_caustic_finale",90,130,170,220],
	["tiny_avalanche",100,180,260,300],
	["tiny_craggy_exterior",25,35,45,55],
	["zuus_arc_lightning",85,100,115,145],
	["zuus_lightning_bolt",100,175,275,350],
	["slardar_slithereen_crush",50,100,150,200],
	["tidehunter_gush",110,160,210,260],
	["tidehunter_anchor_smash",75,125,175,225],
	["tidehunter_ravage",200,325,450],
	["vengefulspirit_magic_missile",100,175,250,325],
	["vengefulspirit_wave_of_terror",30,50,70,90],
	["crystal_maiden_crystal_nova",100,150,200,250],
	["crystal_maiden_frostbite",70,70,70,70],
	["windrunner_powershot",120,200,280,360],
	["lich_frost_nova",50,100,150,200],
	["witch_doctor_paralyzing_cask",75,100,125,150],
	["witch_doctor_maledict",5,10,15,20],
	["riki_blink_strike",30,60,90,120],
	["tinker_laser",80,160,240,320],
	["tinker_heat_seeking_missile",100,175,250,325],
	["tinker_march_of_the_machines",16,24,32,40],
	["sniper_shrapnel",12,24,36,48],
	["sniper_headshot",15,40,65,90],
	["sniper_assassinate",355,505,655],
	["necrolyte_death_pulse",75,125,200,275],
	["warlock_shadow_word",15,25,35,45],
	["beastmaster_wild_axes",90,120,150,180],
	["queenofpain_scream_of_pain",85,165,225,300],
	["pugna_nether_blast",100,175,250,325],
	["phantom_assassin_stifling_dagger",50,100,150,200],
	["luna_lucent_beam",75,150,225,300],
	["dragon_knight_breathe_fire",90,170,240,300],
	["dragon_knight_dragon_tail",25,50,75,100],
	["dazzle_poison_touch",8,16,24,32],
	["dazzle_shadow_wave",80,100,120,140],
	["rattletrap_battery_assault",15,35,55,75],
	["rattletrap_rocket_flare",80,120,160,200],
	["leshrac_split_earth",120,180,240,300],
	["leshrac_diabolic_edict",12.5,25,37.5,50],
	["leshrac_lightning_storm",80,145,205,265],
	["huskar_burning_spear",5,10,15,20],
	["night_stalker_void",90,160,255,335],
	["jakiro_dual_breath",35,70,105,140],
	["ancient_apparition_ice_blast",250,350,450],
	["ursa_earthshock",90,140,190,240],
	["gyrocopter_rocket_barrage",11,15,19,23],
	["gyrocopter_homing_missile",110,220,330,440],
	["lone_druid_spirit_bear_entangle",60],
	["shadow_demon_shadow_poison",50,50,50,50],
	["shadow_demon_demonic_purge",200,300,400],
	["meepo_poof",80,100,120,140],
	["meepo_geostrike",7,14,21,28],
	["ogre_magi_fireblast",80,145,210,275],
	["ogre_magi_unrefined_fireblast",275],
	["disruptor_thunder_strike",40,60,80,100],
	["nyx_assassin_impale",80,140,200,260],
	["naga_siren_rip_tide",130,160,190,220],
	["centaur_khan_war_stomp",25],
	["polar_furbolg_ursa_warrior_thunder_clap",150],
	["satyr_hellcaller_shockwave",125],
	["big_thunder_lizard_slam",70],
	["roshan_halloween_wave_of_force",600],
	["greevil_miniboss_black_nightmare",20],
	["greevil_miniboss_black_brain_sap",200],
	["greevil_miniboss_red_earthshock",240],
	["greevil_miniboss_orange_dragon_slave",170],
	["greevil_miniboss_orange_light_strike_array",150]
]