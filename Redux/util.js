// Returns the xy distance between two vectors
exports.vecDist = function(vec1, vec2) {
	var xx = (vec1.x - vec2.x);
	var yy = (vec1.y - vec2.y);
	
	return Math.sqrt(xx*xx + yy*yy);
}

// Pick a random number from a range
exports.randomFromInterval = function(from, to) {
	// Make sure from < to
	if(to < from) {
		var t = to;
		to = from;
		from = t;
	}
	
	// Pick a number in this range
    return Math.floor(Math.random()*(to-from+1)+from);
}

// Replaces {i} with element i in args (i can be as long as you please)
// Replaces {color code} with the correct color
function format(msg, args) {
	// Check if any args were parsed
	if(args) {
		// Cycle each arg
		for(var i=0;i<args.length;i++) {
			// Replace them
			msg = msg.replace('{'+i+'}', args[i]);
		}
	}
	
	// Replace colors
	msg = msg.replace(/{red}/g, lang.COLOR_RED);
	msg = msg.replace(/{lgreen}/g, lang.COLOR_LIGHT_GREEN);
	
	// Return new message
	return msg;
}

// Add format export
exports.format = format;

exports.printToAll = function(txt) {
	for(var i=0;i<server.clients.length;i++) {
		// Grab a client
		var client = server.clients[i];
		if(!client || !client.isInGame()) continue;
		
		// Print message
		client.printToChat(txt);
	}
}

// A vector (0, 0, 0)
exports.pos0 = {
	x:0,
	y:0,
	z:0
}

// Prints a formatted message to a client
Client.prototype.print = function(msg, args) {
	if(typeof(msg) == 'string') {
		// Print message to this client
		this.printToChat(format(lang.prefix+msg, args));
	} else {
		// Loop over all the messages
		for(var i=0; i<msg.length; i++) {
			// Print a message to this client
			this.printToChat(format(lang.prefix+msg[i], args));
		}
	}
}
