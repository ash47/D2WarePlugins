// Loads developer mode
function load() {
	console.addClientCommand("changeteam", CmdChangeTeam);
	console.addClientCommand("gold", CmdGold);
}

function CmdChangeTeam(client, args) {
	// Validate client
	if(!client) return;
	
	// Swap the client's team
	var res = customTeams.swapTeam(client);
	
	// Check if it worked
	if(res) {
		// Print success message
		client.printToChat(lang.cmdChangeTeamSuccess);
	} else {
		// Print failed message
		client.printToChat(lang.cmdFailed);
	}
}

function CmdGold(client, args) {
	// Validate client
	if(!client) return;
	
	// Grab how much gold they want
	var gold1 = parseInt(args[0]);
	var gold2 = parseInt(args[1]);
	
	// Make sure it's not too high
	if (gold1 > 99999) gold1 = 99999;
	if (gold2 > 99999) gold2 = 99999;
	
	// Set their gold
	var res = goldManager.setGold(client, {
		u: gold1,
		r: gold2
	});
	
	// Check if it worked
	if(res) {
		// Print success message
		client.printToChat(lang.cmdGoldSuccess);
	} else {
		// Print failed message
		client.printToChat(lang.cmdFailed);
	}
}

// Check if we are in developer mode
if(settings.dev) {
	// Print developer warning
	server.print(lang.devWarning);
	
	// Load developer functions
	load();
}
