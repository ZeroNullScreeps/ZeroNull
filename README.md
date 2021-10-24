## ZeroNull Screeps Artificial Intelligence

![Screeps: World Steam Image](https://cdn.cloudflare.steamstatic.com/steam/apps/464350/capsule_616x353.jpg?t=1624813977)

[TOC]

## What is Screeps: World?

**Screeps: World** is an open source MMO RTS sandbox game. With all the attributes of a full-fledged strategy game, you control your colony by writing script that operates 24/7 in the single persistent open world filled by other players on par with you.

Your colony can **harvest** resources, **build** units, **conquer** territory, **trade** with other colonies. As you conquer more territory, your influence in the game world grows, as well as your abilities to expand your footprint. But beware, multiple players aiming for the same territory may lead to conflict!

Screeps is developed for people with programming skills. Unlike some other RTS games, your units in Screeps can react to events without your participation – provided that you have programmed them properly. And, unlike other MMO, you do not have to play Screeps constantly to play well. It is quite enough just to check once in a while to see if everything goes well.

### Features

- You play by writing JavaScript AI which controls your units 24/7 even while you're offline.
- Units of all players coexist in the same real-time huge persistent world and obey the same rules.
- Many kinds of units, base building, mining resources, territory control, economy, manufacturing, transporting, logistics, trading—all the attributes of a real strategy game which you need to program!
- The better your scripts, the better your game—irrespective of the time played. Your creeps will mine, build, defend, and conquer as you just work, sleep, or walk your dog.
- Only basic programming skills are required. However, if you are a pro developer, now is the chance to put your skills to the limit!
- Edit your scripts from the in-game editor, or using your favorite external IDE.
- Other languages are supported via [WebAssembly](https://steamcommunity.com/linkfilter/?url=https://webassembly.org/getting-started/developers-guide/): C/C++, Rust, TypeScript, Go, C#, F#, Kotlin, Swift, D, Pascal, Zig, the list is growing.
- Permanent MMO access with 20 CPU limit included in the starter package. Unlock your full CPU in your account on the official server by purchasing a Lifetime CPU unlock or an in-game [CPU Unlock](https://steamcommunity.com/market/listings/464350/CPU Unlock) consumable item (can be bought by in-game credits).
- If you don't want to buy an unlock, that's fine—there is a standalone CPU-limited world shard where you can compete with other "CPU-locked" players on equal terms.
- Host your own server, modify games rules and play with your friends via LAN or on the Internet. The server is an [open source project](https://steamcommunity.com/linkfilter/?url=https://github.com/screeps/screeps).
- The game is slow-paced (from 2 seconds to 5 seconds per game tick depending on a world shard where you start playing), since it allows you to debug your scripts in the real-time world. You can use your private server to develop and test with fast pace (up to 10 game ticks per second).

## Software Requirements

* [Node.js](https://nodejs.org/en/) (v12.17.0+) LTS

### Install npm modules

`$ npm install`
`$ npm install -g grunt-cli`

You may have to install grunt with the -g for Global which sets an environment path variable. Otherwise it may say something about grunt not being found.

## Setup Grunt Configuration File

### Setup Local Environment

Under the `copy` key you will find a key named `dest`. This `dest` value should equal the current working root directory of your screeps default script.

Example: `C:/Users/User/AppData/Local/Screeps/scripts/10_0_0_2___21025/default`

### Setup Live Environment

Under the `screeps` key you will find two keys, the `email` key and the `password` key. Change these values to the live server authentication values for your account.

## In-Game Console Usage

`global.updateCreepMinAll(int number)` - Updates the minimum creeps that should be spawned per type for all creep types

`global.updateCreepMin(string type, int number)` - Updates the minimum creeps that should be spawned for the given type

`global.refreshTimedCommands()` - Wipes `Memory.gameData.timedCommands`, and reinitializes them.

`global.setTimedCommandsInterval(integer interval)` - Sets the timed commands interval.

## CLI Usage

* `grunt main`: Writes your distribution file to the MMO Server
* `grunt merge`: Merges the source files into the dist
* `grunt local`: Merges the source files into the dist and puts them into the local destination folder.
* `grunt`: Checks the jshint rules, merges your src files and writes the dist to the remote
