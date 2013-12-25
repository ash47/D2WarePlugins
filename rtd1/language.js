// All Language / printed stuff for the gamemode

// Colors
var COLOR_RED = '\x12';
var COLOR_LIGHT_GREEN = '\x15';

// Warning to print when developer mode is enabled
exports.devWarning = '-----\n\n\nWARNING: Developer mode is turned on!!!\n\n\n-----';

// Invalid outcome debug messages
exports.invalidArgs = 'Invalid outcome args!';
exports.invalidName = 'Invalid outcome name!';
exports.invalidDes = 'Invalid outcome des!';
exports.invalidType = 'Invalid outcome name!';
exports.invalidcallback = 'Invalid outcome callback!';

// Adding an outcome failed for some reason
exports.addOutcomeError = 'An error occured whle trying to add an outcome: {0}';

// Removing an outcome failed for some reason
exports.removeOutcomeError = 'An error occured whle trying to remove an outcome: {0}';

// Ban fail messages
exports.banFailed = 'Invalid input for outcome ban.';
exports.banError = 'An error occured while banning an outcome: {0}';

// RTD failed
exports.rtdError = 'RTD Failed: {0}';

// Invalid input to remove an outcome
exports.invalidRemoveName = 'Invalid removal outcome name!';

// What to print before a prize is announced
var rtdPrefix = COLOR_RED+'[RTD] '+COLOR_LIGHT_GREEN;
exports.rtdPrefix = rtdPrefix;

// RTD Messages
exports.rtdCooldown = 		rtdPrefix + 'You have to wait another {0} second(s) before using this!';										// RTD Cooldown message
exports.rtdNoOutcomes = 	rtdPrefix + 'All of the dice outcomes have been disabled!';														// Message if somehow all the outcomes get disabled
exports.rtdHelp = 			rtdPrefix + 'Type '+COLOR_RED+'-rtd'+COLOR_LIGHT_GREEN+' to roll the dice. You can roll once every {0} seconds.';	// Help message, {0} = seconds between rolls
exports.rtdHelp2 = 			rtdPrefix + 'Type '+COLOR_RED+'-autoroll'+COLOR_LIGHT_GREEN+' to have the game roll on cooldown for you.';		// Message about auto roll
exports.chatOutcomeList = 	rtdPrefix + '[{0} {1}] {2}';																					// Template for printing an addon, {0} is the outcome number, {1} is name, {2} is description
exports.rdmNoOutcomes = 	rtdPrefix + 'There are no outcomes enabled! Tell the host to enable some next time!';							// Message to disable when no outcomes are avalible (-rtd command)
exports.rtdAd = 			rtdPrefix + 'Type '+COLOR_RED+'-rtdhelp'+COLOR_LIGHT_GREEN+' for more info on Roll The Dice.';						// Ad to print when a hero spawns
exports.rtdMustBeAlive = 	rtdPrefix + 'You have to be alive to use this command.';														// Printed when a dead hero tries to rtd while dead
exports.rtdMustHaveHero = 	rtdPrefix + 'You have to pick a hero first.';																	// Printed when a client tries to rtd without picking
exports.rtdReady = 			rtdPrefix + 'RTD is available again. Type '+COLOR_RED+'-r'+COLOR_LIGHT_GREEN+' to roll.';						// RTD is ready

exports.rtdAutoOff =		rtdPrefix + 'Auto roll was turned '+COLOR_RED+'off'+COLOR_LIGHT_GREEN+'.';										// Auto roll OFF
exports.rtdAutoOn =			rtdPrefix + 'Auto roll was turned '+COLOR_RED+'on'+COLOR_LIGHT_GREEN+'.';										// Auto roll ON

/*
Sounds
*/

// When RTD is ready
exports.sound_rtdReady = 'ui/npe_objective_given.wav';

// When the dice is auto rolled
exports.sound_rtdRoll = 'ui/npe_objective_given.wav';
