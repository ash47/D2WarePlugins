console.addClientCommand('e', function(client, args) {
	var ents = game.findEntitiesByClassname('*');
	
	for(i=0; i<ents.length; i++) {
		var ent = ents[i];
		if(! ent || !ent.isValid()) continue;
		
		server.print(ent.getClassname());
	}
});
