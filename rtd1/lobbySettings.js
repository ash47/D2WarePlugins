var settings = require('settings.js').s;
var rtd = require('rtd.js');

// Grab lobby manager, load settings
plugin.get('LobbyManager', function(obj){
	var options = obj.getOptionsForPlugin("rtd1");
	if(!options) {
		server.print('\n\nNO OPTIONS FOUND FOR RTD!\n\n');
		return;
	}
	
	// Grab delay
	settings.rtdDelay = parseInt(options["Use Delay"] || settings.rtdDelay);
	
	// Attempt to ban all the options
	var g = options["Good Outcomes"];
	if(g == 'Good Disabled') rtd.ban('good');
	
	var g = options["Bad Outcomes"];
	if(g == 'Bad Disabled') rtd.ban('bad');
	
	var g = options["Terrible Outcomes"];
	if(g == 'Terrible Disabled') rtd.ban('terrible');
	
	var g = options["General Outcomes"];
	if(g == 'General Disabled') rtd.ban('general');
	
	var g = options["Gold Outcomes"];
	if(g == 'Gold Disabled') rtd.ban('gold');
	
	var g = options["Stats Outcomes"];
	if(g == 'Stats Disabled') rtd.ban('stats');
	
	var g = options["Unofficial Outcomes"];
	if(g == 'Unofficial Disabled') rtd.ban('unoffical');
	
	var g = options["Modifiers"];
	if(g == 'Modifiers Disabled') rtd.ban('modifier');
});
