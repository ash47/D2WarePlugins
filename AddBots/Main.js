// Used later to count number of connected bots
var kickBots = 0;

// Kicks bot with your ID
game.hook('OnClientPutInServer', onClientPutInServer);
function onClientPutInServer(client){
	if(kickBots) {
		if(kickBots == 10) {
			server.print('didnt assign');
			kickBots = 0;
			return false;
		}
		
		kickBots += 1;
	}
	
	if(client.isFake() || client.isSourceTV() || client.isReplay()) return;
	if(game.getTeamClientCount(2) <= game.getTeamClientCount(3)){
		client.fakeCommand("jointeam good");
	}else{
		client.fakeCommand("jointeam bad");
	}
}

// Adds bots to the server
function addBots() {
	// Begin counting the number of connected bots
	kickBots = 1;
	
	// Populate server with bots
	server.command('dota_bot_populate');
	
	// Kick the last bot
	server.command('kickid 11');
}

// Allows you to add bots with 'bots' console command
console.addServerCommand('bots', addBots);
