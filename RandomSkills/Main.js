// Load libraries
var timers = require('timers');

// KV Files
var abDeps = keyvalue.parseKVFile("abilityDeps.kv");
var abList = keyvalue.parseKVFile("abilities.kv");
var abInfo = keyvalue.parseKVFile('npc_abilities.kv').DOTAAbilities;
var heroesKV = keyvalue.parseKVFile('npc_heroes.kv').DOTAHeroes;

// Vars
var newSkillsOnDeath = false;   // An option to give new skills when a player dies
var stackPassives = false;      // An option to stack passive abilities
var durationMultiplier = 1;     // For CSP, SIGH!

var numberOfUlts = 1;           // Number of ults to give each hero
var maxSlots = 4;            // Total number of skills to give

// CVs
var cvForceGameMode = console.findConVar("dota_force_gamemode");

// Bans
var banSilencer = true;
var banMeepo = false;

// Load lobby settings
plugin.get("LobbyManager", function(lobbyManager) {
    // Grab the options
    var options = lobbyManager.getOptionsForPlugin("RandomSkills");
    //var options = lobbyManager.getOptionsForPlugin("collection");

    // The game mode
    switch(options["Mode"]) {
        case "Classic":
            newSkillsOnDeath = false;
        break;

        case "New Skills On Death":
            newSkillsOnDeath = true;
        break;
    }

    // Grab how many slots to use
    switch(options['Number of Slots']) {
        case 'Use 1 Slot':
            maxSlots = 1;
        break;

        case 'Use 2 Slots':
            maxSlots = 2;
        break;

        case 'Use 3 Slots':
            maxSlots = 3;
        break;

        case 'Use 4 Slots':
            maxSlots = 4;
        break;

        case 'Use 5 Slots':
            maxSlots = 5;
        break;

        case 'Use 6 Slots':
            maxSlots = 6;
        break;
    }

    // The number of ults
    switch(options["Number of Ults"]) {
        case "No Ults":
            numberOfUlts = 0;
        break;

        case "1 Ult":
            numberOfUlts = 1;
        break;

        case "2 Ults":
            numberOfUlts = 2;
        break;

        case "3 Ults":
            numberOfUlts = 3;
        break;

        case "4 Ults":
            numberOfUlts = 4;
        break;

        case "5 Ults":
            numberOfUlts = 5;
        break;

        case "6 Ults":
            numberOfUlts = 6;
        break;
    }

    // Make sure the number of ults we need is <= the max number of slots
    if(numberOfUlts > maxSlots) numberOfUlts = maxSlots;

    // Fix the hero pool
    fixHeroPool();
});

// Hook spawning
game.hook("Dota_OnHeroSpawn", function(hero) {
    // Check if this hero should get new skills
    if(!hero) return;
    if(hero.gottenSkills) return;
    hero.gottenSkills = true;

    // Don't touch illusions
    if(dota.hasModifier(hero, 'modifier_illusion')) return;

    // Give this hero new skills
    giveHeroNewSkills(hero);
});

function giveHeroNewSkills(hero) {
    // Grab current ability points
    var abPoints = hero.netprops.m_iAbilityPoints || 0;

    // Remove all starting abilities
    for(var i=0; i<16; i++) {
        var ab = hero.netprops.m_hAbilities[i];
        if(ab != null) {
            // Add to the count of ability points
            abPoints += ab.netprops.m_iLevel;

            // Cleanup the ability
            cleanupAbility(hero, ab);

            // Remove the ability from the slot
            dota.removeAbilityFromIndex(hero, i);
        }
    }

    // Change ability points
    hero.netprops.m_iAbilityPoints = abPoints;

    var missingSkills = [];
    function addSkill(name, slot) {
        // Load dependencies
        loadDeps(name);

        // Give the skill
        var ab = dota.createAbility(hero, name);
        dota.setAbilityByIndex(hero, ab, slot);

        // Add to the missing skills
        if(abDeps[name]) {
            var deps = abDeps[name].SubAbilities;
            if(deps) missingSkills = missingSkills.concat(deps);
        }
    }

    // Workout how many normal skills to give
    var numberOfNormal = maxSlots - numberOfUlts;

    // Stores which skills they have gotten
    var gottenSkills = {};
    var skillName = "";

    // Give normal skill(s)
    for(var i=0;i<numberOfNormal;i++) {
        // Find a unique skill
        do {
            skillName = abList.Abs.random();
        } while(gottenSkills[skillName]);
        gottenSkills[skillName] = true;

        // Add the skill
        addSkill(skillName, i);
    }

    // Give ult(s)
    for(var i=0;i<numberOfUlts;i++) {
        // Find a unique skill
        do {
            skillName = abList.Ults.random()
        } while(gottenSkills[skillName]);
        gottenSkills[skillName] = true;

        // Add the skill
        addSkill(skillName, numberOfNormal+i);
    }

    // Give Attribute Bonus
    var ab = dota.createAbility(hero, "attribute_bonus");
    dota.setAbilityByIndex(hero, ab, maxSlots);

    // Add missing extra skills
    for(i=0; i<missingSkills.length; i++) {
        // Give the skill
        var ab = dota.createAbility(hero, missingSkills[i]);
        dota.setAbilityByIndex(hero, ab, maxSlots+1+i);
    }
}

// Should we give new skills when a hero dies?
if(newSkillsOnDeath) {
    // Hook entities being hurt
    game.hookEvent("entity_hurt", function(event) {
        // Grab the entity that was attacked
        var ent = game.getEntityByIndex(event.getInt('entindex_killed'));

        // Check if it is a hero
        if(ent.isHero()) {
            // Check if they will die as a result of this
            if(ent.netprops.m_iHealth <= 0) {
                // No illusions
                if(dota.hasModifier(ent, 'modifier_illusion')) return;

                // Search for aegis
                for(var i=0; i<6;i++) {
                    // Grab item
                    var item = ent.netprops.m_hItems[i];

                    // Check if it's valid
                    if(item && item.isValid()) {
                        // Check if it's an Aegis
                        if(item.getClassname() == 'item_aegis') {
                            // They have an aegis
                            return;
                        }
                    }
                }

                // Give the hero new skills
                giveHeroNewSkills(ent);
            }
        }
    });
}

// Loads dependencies
function loadDeps(skill) {
    var dependencies = abDeps[skill];
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

/*console.addClientCommand('endit', function(client, args) {
    dota.forceWin(dota.TEAM_RADIANT);
});*/

function cleanupModifier(hero, name) {
    if(dota.hasModifier(hero, name)) {
        dota.removeModifier(hero, name);
    }

    if(dota.hasModifier(hero, 'modifier_'+name)) {
        dota.removeModifier(hero, 'modifier_'+name);
    }
}

function cleanupUnitByID(name, playerID) {
    var conIndex = 1 << playerID;

    // Remove units owned by this hero
    var bears = game.findEntitiesByClassname(name);
    for(i=0; i<bears.length; i++) {
        var bear = bears[i];
        if(!bear || !bear.isValid()) continue;

        // Check if the bear is owned by this player
        if(bear.netprops.m_iIsControllableByPlayer == conIndex) {
            // Remove it
            dota.remove(bear);
        }
    }
}

function cleanupUnitByOwner(name, hero) {
    // Remove units owned by this hero
        var bears = game.findEntitiesByClassname(name);
        for(i=0; i<bears.length; i++) {
            var bear = bears[i];
            if(!bear || !bear.isValid()) continue;

            // Check if the bear is owned by this player
            if(bear.netprops.m_hOwnerEntity == hero) {
                // Remove it
                dota.remove(bear);
            }
        }
}

function cleanupAbility(hero, ab) {
    if(!ab || !ab.isValid()) return;

    // If we are stacking passives (why people want this, idk) just dont remove the ability / skill >_>
    if(stackPassives) return;

    // Grab info on the skill
    var name = ab.getClassname();
    var info = abInfo[name];

    // Cleanup spirit bear
    if(name == 'lone_druid_spirit_bear') {
        // Cleanup the units
        cleanupUnitByID('npc_dota_lone_druid_bear*', hero.netprops.m_iPlayerID);

        // Remove stuff
        dota.remove(ab);
        cleanupModifier(hero, name);
        return;
    }

    // Cleanup familiars
    if(name == 'visage_summon_familiars') {
        // Cleanup the units
        cleanupUnitByID('npc_dota_visage_familiar*', hero.netprops.m_iPlayerID);

        // Remove stuff
        dota.remove(ab);
        cleanupModifier(hero, name);
        return;
    }

    // Cleanup webs
    if(name == 'broodmother_spin_web') {
        // Cleanup units
        cleanupUnitByOwner('npc_dota_broodmother_web*', hero);

        // Remove stuff
        dota.remove(ab);
        cleanupModifier(hero, name);
        return;
    }

    // Cleanup restoration
    if(name == 'witch_doctor_voodoo_restoration') {
        cleanupModifier(hero, 'modifier_voodoo_restoration_aura');
        cleanupModifier(hero, 'modifier_voodoo_restoration_heal');
    }

    // Cleanup templar refraction
    if(name == 'templar_assassin_refraction') {
        cleanupModifier(hero, 'modifier_templar_assassin_refraction_damage');
        cleanupModifier(hero, 'modifier_templar_assassin_refraction_absorb');
    }

    var duration = -1;

    if(info) {
        for(key in info) {
            if( key.indexOf('duration') != -1 ||
                key.indexOf('ChannelTime') != -1) {

                // Grab all durations
                var durs = info[key].split(' ');

                // Update duration
                var newDuration = parseFloat(durs[durs.length-1]);

                // Take largest
                if(newDuration > duration) {
                    duration = newDuration;
                }
            }
        }

        // Check for duration
        var spec = info.AbilitySpecial;
        if(spec) {
            for(key in spec) {
                for(key2 in spec[key]) {
                    if( key2.indexOf('duration') != -1 ||
                        key2.indexOf('channel_time') != -1) {

                        // Grab all durations
                        var durs = spec[key][key2].split(' ');

                        // Update duration
                        var newDuration = parseFloat(durs[durs.length-1]);

                        // Take largest
                        if(newDuration > duration) {
                            duration = newDuration;
                        }
                    }
                }
            }
        }

        // Check if this ability has behavior (probably does)
        var b = info['AbilityBehavior'];
        if(b != null) {
            // If it's a passive, we can simply remove it
            if(b.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) {
                dota.remove(ab);
                return;
            }
        }
    }

    // Failed to find duration, default to 300
    if(duration == -1) {
        duration = 300;
    }

    // Cleanup modifiers
    cleanupModifier(hero, name);

    // Remvoe after duration is up (add a buffer of 10 seconds since cleanup doesnt matter too much anyways)
    timers.setTimeout(function() {
        if(ab && ab.isValid()) {
            dota.remove(ab);
        }
    }, (duration) * 1000 * durationMultiplier + 1000);
    // durationMultiplier is for CSP support
    // Add an extra second just to be sure
}

function fixHeroPool() {
    for(var i=0;i<128;i++) {
        // Grab the name of this hero
        var heroName = dota.heroIdToClassname(i);

        // Check if this hero has enough slots
        if(findHeroSlotCount(heroName) >= maxSlots) {
            // Yes
            dota.setHeroAvailable(i, true);
        } else {
            // no
            dota.setHeroAvailable(i, false);
        }
    }

    // Should we ban silencer?
    if(banSilencer) {
        dota.setHeroAvailable(75, false);
    }

    // Should we ban meepo?
    if(banMeepo) {
        dota.setHeroAvailable(82, false);
    }

    // Ban SK / WK
    dota.setHeroAvailable(42, false);
}

function findHeroSlotCount(heroName) {
    // Grab the hero map for this hero, validate it
    var map = heroesKV[heroName];
    if(!map) return 0;

    // Heroes with wrong slot counts (for out purposes)
    if(heroName == 'npc_dota_hero_lone_druid') return 4;

    // Return how many slots this hero has (default to 4)
    return map['AbilityLayout'] || 4;
}

// Set Mid Only if >5 slots
if(maxSlots >= 6) {
    // Set the gamemode
    cvForceGameMode.setInt(11);

    // This is needed incase the map changes
    game.hook("OnGameFrame", function() {
        cvForceGameMode.setInt(11);
    });
}

game.hook("OnMapStart", function() {
    // Check if we should make it mid only
    if(maxSlots >= 6) {
        cvForceGameMode.setInt(11);
    }

    // Fixup the hero pool
    fixHeroPool();
});
