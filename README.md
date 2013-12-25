D2Ware Plugins
===========

This repo contains several less popular d2ware plugins I made, or plugins that were a work in progress.

###AddBots###
 - A plugin that added bots to the server before you connected

###Border - Border Patrol###
  - A plugin where teams would race towards the enemy team's ancients
 - Players who were on their side of the map could instantly kill enemies
 - Players on the enemy's side of the map would get evasion type tools

###Cycle - Cycling Skills###
 - A plugin where people would get a random set of skills every so often

###DifferentMutliplier###
 - This was my attempt at Custom Spell Power
 - I think this was later merged into Fast Modifiers

###Diretide###
 - This would a plugin that would load Valve's Diretide gamemode
 - This was later merged into the Game Mode plugin

###EntTest###
 - This would print the class of every ent on the map, useful for finding specific ents

###FastRespawn - Fast Modifiers###
 - A plugin that allows you to modify tons of asspects of the game including gold / exp rates, spawn rates and movement speed
 - See lobby options for a full list of modifiers

###Gamemode - Game Mode###
 - A plugin which allowed you to load around 15 official game modes, such as Diretide and Mid Only

###GreevilFlute###
 - A plugin where everyone spawns with a Greevil Flute

###Greeviling###
 - A plugin which would load the Greevling Game Mode
 - This was later merged into the Game Mode plugin

###HeroTest###
 - This plugin adds a console commands 'h' which would change the caller into drow ranger
 - This was later used to make Border

###Illusion###
 - A plugin which turns you into an illusion when you spawn
 - Has no real use, was interesting to know what happens when you become an illusion though

###LoadTest###
 - A plugin which prints a message when it is loaded
 - Very useless (unless you're trying to work out if plugins are actually loading)

###LobbyManager_ash47###
 - A lobby Manager I wrote which was later replaced by one written by M28, his is very similar to mine

###LVL1ULT###
 - A plugin where people's ultimate abilities would be skilled at level 1, as opposed to level 6

###Map###
 - A plugin which lets you play on the Winter and Autumn maps

###ModifierTest###
 - A plugin which tests techies modifiers
 - I think it partially worked

###PluginMixer###
 - A plugin loader plugin, it had several less played plugins and allowed players to load them all, or a random subset of htem

###Redux###
 - The successor to the Infection plugin, due to huge changes in sm.js, the module loading no longer works in this, and hence I stopped working on it
 - On the plus side, I leant a better way to make modular JS code

###Rosh###
 - A plugin which attempted to spawn roshan, I don't think it ever worked

###RoshanWars###
 - Everyone would spawn as (or with) their own Roshan
 - Wasn't heavily developed

###rtd1 - Roll The Dice###
 - A plugin where you could type -rtd to get a random bonus / negative effect
 - It had support for other plugins to add RTD effects

###rtdPluginTest###
 - An example of how you would add RTD effects in your own plugin

###Siege###
 - An older plugin where you would get bonus str, agi and int for last hitting
 - I took this plugin over and added more options such as bonus gold, and negative stats
 - I am fairly sure I rewrote this from scratch

###SpecificSkills###
 - A plugin where the lobby host could choose 6 skills and a hero for everyone to use

###Speed###
 - A plugin where players would get speed modifiers (2x IIRC)
 - This was later merged into Fast Modifiers

###Sunstrike###
 - A plugin where one player would be choosen as the sun striker, and the rest had to dodge him
 - It suffered from D2Ware's crashing, I couldn't make it crash on my server, so I never found out what was wrong with it, and it died

###SwitchBases###
 - A plugin where bases would slowly rotate, or swap over time (Depends on hard coded options)

###TowerChasers###
 - A plugin that made towers chase people

###VS###
 - A plugin with tons of sub game modes, it had arena PvP, 9 VS 1 modes and 10 VS creeps modes.
 - It was broken due to sm.js module changing stuff and was never finished

###WormWar###
 - You would spawn as a worm, and there would be around 100 couriers walking around, as well as some roshlings
 - Collect couriers to grow in size, and touch a roshling to revert back to 0 size
 - First person to collect around 20 couriers would win
 - Removed from d2ware because it caused huge lag
 - Since it wasn't that fun to play, I never bothered optimising it