var options = {
	"SpecificSkills": {
		"Skill 1": "zuus_thundergods_wrath",
		"Skill 2": "zuus_thundergods_wrath",
		"Skill 3": "Random Skill Or Ult",
		"Skill 4": "Individual Random Skill",
		"Skill 5": "Individual Random Ult",
		"Skill 6": "Individual Random Skill Or Ult",
		"Hero": "Invoker"
	},
	
	"Infection": {
		"Rate": "1 Infected"
	},
	
	"Builder1": {
		"GoldPerSecond": "50 Bonus GPS"
	},
	
	"rtd1": {
		"Good Outcomes": "Good Enabled",
		"Bad Outcomes": "Bad Disabled",
		"Terrible Outcomes": "Terrible Disabled",
		"General Outcomes": "General Disabled",
		"Gold Outcomes": "Gold Disabled",
		"Stats Outcomes": "Stats Disabled",
		"Unofficial Outcomes": "Unofficial Disabled",
		"Modifiers": "Modifiers Enabled",
		"Use Delay": "5 seconds"
	},
	
	"collection": {
		"Creeps": "Default Creeps",
		"Happy Creeps": "Happy Creeps",
		"Game Length": "Normal Game",
		"Hero Vision": "Normal Hero Vision",
		"Buying": "Normal Buying",
		"WTF Mode": "WTF Disabled",
		"Fountain Camping": "No Fountain Camping",
		"Mixer": "Manual Mode"
	},
	
	"LuckySkills": {
		"Speed": "2:00",
		"StartingSkills": "4 Starting Skills",
		"StartingUlts": "2 Starting Ults",
		"LeaveStartingSkills": "Leave Starting Skills (Compatibility)",
		"Hero": "4 Slots"
	},
	
	"Border": {
		"Captures To Win": "5 Captures"
	},
	
	"LVL1ULT": {
		"Level": "Level 3",
		"Scepter": "Level 2 Free Scepter",
		"Force Ult Points": "Wait 15 Seconds For Ults"
	},
	
	"WeaponMayhem": {
		"Speed": "0:01",
		"Method": "Weighted",
		"Price": "4000+",
		"Selection": "No specifics",
		"Modifiers": "Modifiers enabled"
	},
	
	"Cycle": {
		"Skill Set": "Only No Target",
		"Starting Skills": "4 Starting Skills",
		"Cycle Time": "0:30",
		"Combination": "Global Unique Skills",
		"Scaling": "Scale On Average Hero Level",
		"Stacking": "Remove Passives",
		"Manual Cycling": "50g Manual Cycling",
		"Cooldown": "Cooldown New Abilities",
		"Kill Death Cycle": "Cycle on Kills & Deaths"
	},
	
	"CustomSpellPower": {
		"Multiplier": "x3.1"
	},
	
	"Siege": {
		"Bonus Stats": "+10 Team Stats on Last Hit",
		"Remove Stats": "-10 Enemy Stats on Last Hit",
		"Bonus Gold": "+50 Team Gold on Last Hit",
		"Tower Multiplier": "10X Tower Multiplier",
		"Hero Multiplier": "10X Hero Multiplier"
	},
	
	"Gamemode": {
		"Game Mode": "Diretide"
	},
	
	"ChangeMap": {
		"Map": "Autumn Map"
	},
	
	"FastRespawn": {
		"Respawn Multiplier": "1 second Respawn",
		"Cooldown Multiplier": "10X Faster Skill Cooldown",
		"Mana Multiplier": "10X Less Spell Manacost",
		"Damage Multiplier": "10X Less Spell Damage",
		"Gold Multiplier": "100X More Starting Gold",
		"XP Bounty Multiplier": "10X More XP Bounty",
		"Gold Bounty Multiplier": "10X More Gold Bounty",
		"Starting Courier": "No Free Starting Courier",
		"Ignore game breaking cooldowns": "Ignore game breaking cooldowns",
		"Starting Level": "Start at Level 1",
		"Spell Value Multiplier": "+10 Levels Spell Values",
		"Base Stat Multiplier": "Normal Stats",
		"Move Speed Multiplier": "10X Faster Move Speed",
		"Creep Scaler": "10X Creep Power",
		"Building Scaler": "10X Building Power",
		"Level Cap": "Level Cap 5000"
	},
	
	"PickYourSkills": {
		"Picking Time": "0:45",
		"Max Number of Regular Skills": "Allow Upto 3 Regular Skills",
		"Max Number of Ults": "Allow Upto 3 Ults",
		"Ban Troll Combos": "Allow Trolls",
		"Ban Tinker Rearm": "Allow Tinker Rearm"
	}
}

plugin.expose({
	getOptionsForPlugin: function (LobbyTitle) {
		if(options[LobbyTitle]) {
			return options[LobbyTitle];
		} else {
			server.print('\N\NWARNING: NO LOBBY SETTINGS FOUND FOR "'+LobbyTitle+'"\n\n\n');
		}
	}
});