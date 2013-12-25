	// Grabs rtd (this wont do anything if rtd isn't loaded)
	plugin.get('rtd1', function(obj){
		obj.add({
			name: 'Dev Test',
			des: 'Prints a message you',
			type: {
				general: 1
			},
			callback: function(playerID) {
				// Attempt to grab client
				var client = dota.findClientByPlayerID(playerID);
				if(!client || !client.isValid()) return '{0} got nothing';
				
				// Print message to this client
				client.printToChat('Hello from another plugin!');
				
				// Return prize
				return '{0} won a secret prize!';
			}
		});
	});
