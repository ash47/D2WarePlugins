var lang = require('language.js');

var abilitiesDependencies = keyvalue.parseKVFile('abilities_dependencies.kv');

// Returns the xy distance between two vectors
exports.vecDist = function(vec1, vec2) {
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

// A vector (0, 0, 0)
exports.pos0 = {
	x:0,
	y:0,
	z:0
}

// Returns the current gametime
exports.gameTime = function() {
	return game.rules.props.m_fGameTime;
}

// Replaces {i} with element i in args (i can be as long as you please)
function format(msg, args) {
	// Check if any args were parsed
	if(args) {
		// Cycle each arg
		for(var i=0;i<args.length;i++) {
			// Replace them
			msg = msg.replace('{'+i+'}', args[i]);
		}
	}
	
	// Return new message
	return msg;
}

// Add format export
exports.format = format;

// Picks a random element from an array
exports.randomFromArray = function(ar) {
	return ar[Math.floor(Math.random()*ar.length)];
}

exports.randomFromInterval = function(from,to) {
	// Make sure from < to
	if(to < from) {
		var t = to;
		to = from;
		from = t;
	}
	
	// Pick a number in this range
    return Math.floor(Math.random()*(to-from+1)+from);
}

exports.printToAll = function(txt) {
	for(var i=0;i<server.clients.length;i++) {
		// Grab a client
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Print message
		client.printToChat(txt);
	}
}

// Prints a formatted message to a client
Client.prototype.print = function(msg, args) {
	// Print message to this client
	this.printToChat(format(lang.prefix+msg, args));
}

// Preloads a skill
exports.preloadSkill = function(skill) {
	var dependencies = abilitiesDependencies[skill];
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