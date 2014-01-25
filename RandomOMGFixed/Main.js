// KV Files
var abDeps = keyvalue.parseKVFile("abilityDeps.kv");
var abList = keyvalue.parseKVFile("abilities.kv");

// Vars
var gottenNewSkills = {}

// Hook spawning
game.hook("Dota_OnHeroSpawn", function(hero) {
    if(!hero) return;
    if(gottenNewSkills[hero]) return;
    gottenNewSkills[hero] = true;

    // Remove all starting abilities
    for(var i=0; i<16; i++) {
        var ab = hero.netprops.m_hAbilities[i];
        if(ab != null) {
            dota.removeAbilityFromIndex(hero, i);
        }
    }

    var missingSkills = [];
    function addSkill(name, slot) {
        // Load dependencies
        loadDeps(name);

        // Give the skill
        var ab = dota.createAbility(hero, name);
        dota.setAbilityByIndex(hero, ab, slot);

        // Add to the missing skills
        var deps = abDeps[name].SubAbilities;
        if(deps) missingSkills = missingSkills.concat(deps);
    }

    // Give 3 normal skills
    for(var i=0;i<3;i++) {
        addSkill(abList.Abs.random(), i);
    }

    // Give ult
    addSkill(abList.Ults.random(), 3);

    // Give Attribute Bonus
    var ab = dota.createAbility(hero, "attribute_bonus");
    dota.setAbilityByIndex(hero, ab, 4);

    // Add missing extra skills
    for(i=0; i<missingSkills.length; i++) {
        // Give the skill
        var ab = dota.createAbility(hero, missingSkills[i]);
        dota.setAbilityByIndex(hero, ab, 5+i);
    }
});

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