// Identifier of this plugin
var pluginID = 'collection';

// Debug mode
var debug = false;

// List of all the plugins
var pluginList = [];

// List of active plugins (to print to clients)
var activePlugins = [];

// Weather or not we've printed to this client
var printedTo = {};

// hook functions
game.hook("Dota_OnHeroSpawn", onHeroSpawn);

// Colors
var color_red = '\x12';
var color_light_green = '\x15';

function onHeroSpawn(hero) {
	// Validate hero
	if(!hero) return;
	
	// Grab playerID, validate
	var playerID = hero.netprops.m_iPlayerID;
	if(playerID == null || playerID == -1) return;
	
	// Check if we've printed to this player
	if(!printedTo[playerID]) {
		// Grab client
		var client = dota.findClientByPlayerID(playerID);
		if (!client || !client.isInGame()) return;
		
		// Header message
		client.printToChat(color_red+'[Plugin Mixer] '+color_light_green+'The following plugins are loaded:');
		
		// Tell them which plugins are active
		for(i = 0; i<activePlugins.length;i++) {
			// Print plugin
			client.printToChat(color_red+'['+i+'] '+color_light_green+activePlugins[i]);
		}
		
		// Store that we printed to this player
		printedTo[playerID] = true;
	}
}

// Adds a plugin to the list of addons to check for loading
// Argument should be an array: ['Hard Creeps']
// The first index should be the disabled option
// The rest of the rest should be plugin names
// forcedMixer will force a plugin state of mixer is on (-1 for off)
function addPlugin(name, plugins, forcedMixer) {
	// Add this plugin
	pluginList.push({
		name: name,
		plugins: plugins,
		mixer: forcedMixer
	});
}

// Add plugins
addPlugin('Fountain Camping', ['Allow Fountain Camping', 'No Fountain Camping'], 1);
addPlugin('Creeps', ['Default Creeps', 'Hard Creeps', 'No Creeps'], -1);
addPlugin('Happy Creeps', ['Default Happy Creeps', 'Angry Creeps'], -1);
addPlugin('Game Length', ['Normal Game', 'Early Game'], -1);
addPlugin('Hero Vision', ['Normal Hero Vision', 'No Hero Vision'], -1);
addPlugin('Buying', ['Default Buying', 'No Buying'], -1);
addPlugin('WTF Mode', ['WTF Disabled', 'WTF Mode Enabled'], -1);

// Load required plugins
plugin.get('LobbyManager', function(obj){
	// Grab the options table
	var options = obj.getOptionsForPlugin(pluginID);
	
	// Validate our options table
	if(!options) {
		server.print('Failed to find options for plugin '+pluginID);
		return;
	}
	
	// True if mixed mode is enabled
	var mixer = ( (options['Mixer'] || 'mixer mode').toLowerCase().indexOf('mixer mode') != -1);
	
	// Loop over all the plugins
	for(var i=0; i<pluginList.length; i++) {
		// Grab the name of a plugin
		var p = pluginList[i];
		
		// Grab the state of this plugin
		var state = (options[p.name]) || (p.plugins[0]);
		
		// Modify for mixer mode
		if(mixer) {
			// Check how to mix this plugin
			if(p.mixer == -1) {
				// Chance to disable the plugin all together
				if(Math.random() > 0.5) {
					// Random plugin from this list (can also disable)
					state = randomFromArray(p.plugins);
				} else {
					// Disable
					state = p.plugins[0];
				}
			} else {
				// Forced to a certain state
				state = p.plugins[p.mixer]
			}
		}
		
		// Convert to lowercase (for easy comparing)
		state = state.toLowerCase();
		
		// Workout which plugin was selected
		for(j=1; j<p.plugins.length; j++) {
			// Grab a plugin name, convert it to lowercase
			var pName = p.plugins[j].toLowerCase();
			var pNameLower = pName.toLowerCase();
			
			// Check if it's in our state
			if(state.indexOf(pNameLower) != -1) {
				// Log what is loading
				debugMessage(pName+' is loading...')
				
				try {
					// Require this plugin
					require('plugins/'+pName+'.js');
					
					// Store that we loaded this plugin
					activePlugins.push(pName);
					
					// Log that it loaded
					debugMessage(pName+' was loaded!')
				} catch(err) {
					throw new Error("Failed to load: "+pName);
				}
				
				// Done loading this plugin set
				break;
			}
		}
	}
});

function randomFromArray(ar) {
	return ar[Math.floor(Math.random()*ar.length)];
}

// Prints a message if debug mode is on
function debugMessage(txt) {
	// Check if debug mode is on
	if(debug) {
		// Print the message
		server.print(txt);
	}
}

// Print debug warning
debugMessage('\n\nDEBUG MODE IS ON\n\n');
