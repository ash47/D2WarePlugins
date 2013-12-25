var multiplier = 4;

var changedValues = {};
game.hook("Dota_OnGetAbilityValue", function(ability, abilityName, field, values) {
	// Check if we've seen this skill before
	var abName = abilityName + '.' + field;
	if(changedValues[abName]) return;
	changedValues[abName] = true;
	
	var min = 10000;
	
	if(values.length <= 1) {
		min = 0;
	} else {
		// Find the minimum difference
		for(var i=1; i<values.length; i++) {
			// Workout the difference
			var dif = values[i] - values[i-1];
			
			if(Math.abs(dif) < Math.abs(min)) {
				min = dif;
			}
		}
	}
	
	// Generate the list of new values
	var newValues = values.slice();
	
	for(var i=0; i<multiplier;i++) {
		newValues.push(newValues[newValues.length-1]+min);
	}
	
	server.print(field);
	
	server.print(newValues);
	
	for(var i=0; i<values.length; i++) {
		values[i] = newValues[i+multiplier];
	}
	
	server.print(values);
	
	return values;
});
