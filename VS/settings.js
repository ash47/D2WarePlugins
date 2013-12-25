// All constant settings for the titan gamemode

// Developer stuff
exports.dev = true;			// Enable or disable devmode
exports.forceTitanID = 0;	// Who should be the titan?	(-1 for random)

// Gamemode IDs
exports.GAMEMODE_LMS = 1;		// Last Man Standing
exports.GAMEMODE_ASSULT = 2;	// Tower Assult
exports.GAMEMODE_WAVES = 3;		// Waves

// How much to scale the titan by
exports.titanScale = 1.5;

// Health and Mana Scaling factor
exports.titanHeathScale = 50;
exports.titanManaScale = 25;

// How much starting gold to award each player
exports.startingGold = 50000;

// The max time a titan can stay hexed (in seconds)
exports.titanMaxHexTime = 1;

// The max time a titan can stay stunned (in seconds)
exports.titanMaxStunTime = 0.0;

// The radius from the ancients to keep players in during spawn time
exports.baseRadius = 2800;

/*
Gamemode settings
*/

// Stop creeps from spawning
exports.stopCreepsSpawning = {};
exports.stopCreepsSpawning[exports.GAMEMODE_LMS] = true;	// No creeps on Last Man Standing
exports.stopCreepsSpawning[exports.GAMEMODE_WAVES] = true;	// No creeps on Waves (we can make our own)

// Spawn protection (stops players leaving their base until the game has begun)
exports.spawnProtection = {};
exports.spawnProtection[exports.GAMEMODE_LMS] = true;		// Spawn protection on Last Man Standing
exports.spawnProtection[exports.GAMEMODE_ASSULT] = true;	// Spawn protection for Tower Assult gamemode

// Disable going over to dire side
exports.noDireSide = {};
exports.noDireSide[exports.GAMEMODE_WAVES] = true;			// Disable going over to the dire side in Wave mode

// Disable bonus gold for certain gamemode
exports.noBonusGold = {};
exports.noBonusGold[exports.GAMEMODE_WAVES] = true;			// Disable bonus gold for waves mode

// Load Spawn Points
var cskv = keyvalue.parseKVFile('creepSpawns.kv');

// Build list of creep spawns
var creepSpawns = new Array();
for(var i=0;i<cskv.spawns.length;i++) {
	creepSpawns.push({
		name: cskv.spawns[i].name,		// Name of spawn point
		spawnPos: {
			x: cskv.spawns[i].x,		// X position
			y: cskv.spawns[i].y,		// Y position
			z: cskv.spawns[i].z			// Z position
		},
		march: cskv.spawns[i].march		// What entity to march towards?
	});
}

// Export the list of creep spawns
exports.creepSpawns = creepSpawns;
