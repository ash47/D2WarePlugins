// All Language / printed stuff for the gamemode

// Colors
var COLOR_RED = '\x12';
var COLOR_LIGHT_GREEN = '\x15';

// Export colors
exports.COLOR_RED = COLOR_RED;
exports.COLOR_LIGHT_GREEN = COLOR_LIGHT_GREEN;

// What to put before every messsage
var prefix = '{red}[Redux] {lgreen}';
exports.prefix = prefix;

// Warning to print when developer mode is enabled
exports.devWarning = '-----\n\n\nWARNING: Developer mode is turned on!!!\n\n\n-----';

// Message to print when something bad goes wrong (that shouldnt)
exports.brokenGamemode = '\n\VS GAMEMODE IS BROKEN!\n\n';

// Message to print when VS failed to find the player manager
exports.noPlayerManager = '\n\nFAILED TO FIND PLAYER MANAGER!\n\n';

// When a player uses -changeteam successfully
exports.cmdChangeTeamSuccess = 'You successfull changed teams!';

// When a player uses -gold successfully
exports.cmdGoldSuccess = 'Gold was successfully set!';

// When a commands fails
exports.cmdFailed = 'Something went wrong with the command.';

// When a player tries to leave the spawn area
exports.spawnProtection = 'You can\'t leave the spawn area until the game starts.';

// When a player tries to go onto the dire side of the map, and it's disabled
exports.noDireSide = 'You can\'t enter the Dire side of the map.';

// Client has been selected as a zombie
exports.selectedAsZombie = 'You will spawn as a zombie.';

// Instructions
exports.instructionsZombie = [
	'Destroy radiant\'s base or kill all the humans to win.',
	'Any humans you kill will turn into zombies.'
];
exports.instructionsHuman = [
	'Survive 10 waves of zombies and then escape to win.',
	'If you die as a human, you will turn into a zombie!'
];
exports.instructionsCommon = [
	'Type -o for a list of current objectives.'
];
