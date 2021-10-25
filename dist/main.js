/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\main.js **********/
__modules[0] = function(module, exports) {
// Require Prototypes
__require(1,0)();
__require(2,0)();
__require(3,0)();
__require(4,0)();
const memoryController = __require(5,0);
const timedCommands = __require(6,0);
const roomLogic = __require(7,0);
const roleLogic = __require(8,0);

module.exports.loop = function () {
    memoryController.init();
    timedCommands.run();
    Memory.gameData.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    
    /**
     * Loop through all our rooms. This is the main loop
     * that handles spawning and creep functionality.
     */
     _.forEach(Memory.gameData.myRooms, function(room) {
        roomLogic.attemptToSpawnCreep(room);
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            let role = creep.memory.role;
            if (roleLogic[role]) {
                roleLogic[role].run(creep);
            }
        }
    });
    memoryController.clean();
    
}
return module.exports;
}
/********** End of module 0: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\main.js **********/
/********** Start module 1: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.creep.js **********/
__modules[1] = function(module, exports) {
module.exports = function() {
    /**
     * Hello World!
     */
    Creep.prototype.sayHello = function sayHello() {
        this.say("Hello", true);
    }

    /**
     * Find the nearest energy source to the creeps
     * current position.
     *
     * @returns {*}
     */
    Creep.prototype.findEnergySource = function findEnergySource(findNew = false) {
        if(findNew) {
            delete this.memory.source;
        }

        let sources = this.room.find(FIND_SOURCES_ACTIVE);
        if(sources.length) {
            let source = _.find(sources, function(s) {
                return s.pos.getOpenPositions().length > 0;
            });
            if(source) {
                this.memory.source = source.id;
                return source;
            }
        }
    }

    /**
     * Mines / Harvests Energy sources closest to the creeps
     * current position.
     */
    Creep.prototype.mineEnergySource = function mineEnergySource() {
        let storedSource = Game.getObjectById(this.memory.source);
        if(!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
            delete this.memory.source;
            storedSource = this.findEnergySource();
        }
        if(storedSource) {
            if(this.pos.isNearTo(storedSource)) {
                this.harvest(storedSource);
            } else {
                this.moveTo(storedSource, {visualizePathStyle: {stroke: '#f1c40f'}});
            }
        }
    }

    /**
     * Transfer task for the harvester role.
     * Transfers to a building that can accept
     * energy and the free capacity of the building
     * is greater then zero.
     */
    Creep.prototype.unloadEnergyToStructure = function unloadEnergyToStructure() {
        var targets = this.room.find(FIND_MY_STRUCTURES);
        targets = _.filter(targets, function(s) {
        return   (s.structureType === STRUCTURE_SPAWN ||
                    s.structureType === STRUCTURE_EXTENSION ||
                    s.structureType === STRUCTURE_TOWER) &&
                    s.store &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0

        });

        if(targets.length) {
            if(this.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
        }
        if(this.room.energyAvailable === this.room.energyCapacityAvailable) {
            this.transferToController();
        }
    }

    /**
     * Transfer task for the upgrader role. This
     * function selects a controller that is under
     * our control and tells the creep to transfer
     * energy to it.
     */
    Creep.prototype.transferToController = function() {
        var controller = this.room.controller;
        if(this.transfer(controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(controller);
        }
    }

    /**
     * Transfer task for the builder role. This
     * function selects structures that are ours
     * and that need to still be built, then
     * instructs the creep to build it.
     */
    Creep.prototype.buildStructure = function() {
        var sites = this.room.find(FIND_CONSTRUCTION_SITES);

        constructionSite = _.filter(sites, function(s) {
            return (s.structureType === STRUCTURE_TOWER ||
                    s.structureType === STRUCTURE_EXTENSION ||
                    s.structureType === STRUCTURE_ROAD ||
                    s.structureType === STRUCTURE_RAMPART ||
                    s.structureType === STRUCTURE_CONTAINER ||
                    s.structureType === STRUCTURE_LINK ||
                    s.structureType === STRUCTURE_STORAGE ||
                    s.structureType === STRUCTURE_OBSERVER ||
                    s.structureType === STRUCTURE_POWER_SPAWN ||
                    s.structureType === STRUCTURE_EXTRACTOR ||
                    s.structureType === STRUCTURE_LAB ||
                    s.structureType === STRUCTURE_TERMINAL ||
                    s.structureType === STRUCTURE_NUKER ||
                    s.structureType === STRUCTURE_FACTORY)
        });
        if(!constructionSite[0]) {
            this.transferToController();
        }
        if(this.build(constructionSite[0]) === ERR_NOT_IN_RANGE) {
            this.moveTo(constructionSite[0]);
        }
    }

    /**
     * This function selects a structure that is
     * in need of repair. If no structure can be
     * found, then it will force the creep to turn
     * into an upgrader. If it does find a structure
     * the creep will then repair it.
     */
    Creep.prototype.repairStructure = function() {
        var structure = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
        });
        if(!structure) {
            this.transferToController();
        }
        if(this.repair(structure) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }

    /**
     * Gets the creeps task based on the amount of energy stored or not stored inside the creep.
     * Then it assigns the task to the creeps memory to later be used by the run() method.
     *
     * @returns {string} - Returns the task.
     * @param noEnergyTask
     * @param fullEnergyTask
     */
    Creep.prototype.getWorkTask = function(noEnergyTask, fullEnergyTask) {
        var energyCapacity = this.store.getCapacity(RESOURCE_ENERGY);
        var energyStored = this.store.getUsedCapacity(RESOURCE_ENERGY);
        if(energyStored === 0) {
            this.memory.task = noEnergyTask;
        }
        if(energyStored === energyCapacity) {
            this.memory.task = fullEnergyTask;
        }
        return this.memory.task;
    }
}
return module.exports;
}
/********** End of module 1: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.creep.js **********/
/********** Start module 2: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.room.js **********/
__modules[2] = function(module, exports) {
/**
 * All functions in here must be instantiated by running
 * RoomPositions(x,y, roomName).function();
 */

module.exports = function() {
    /**
     * Returns all nearby positions from the provided x, y
     * coordinates in the form of an array.
     *
     * @returns {[]}
     */
    RoomPosition.prototype.getNearbyPositions = function getNearbyPositions(spread = 1) {
        var positions = [];
        let startX = this.x - spread || 1;
        let startY = this.y - spread || 1;
        for(x = startX; x <= this.x + spread && x < 49; x++) {
            for(y = startY; y <= this.y + spread && y < 49; y++) {
                if(x !== this.x || y !== this.y) {
                    positions.push(new RoomPosition(x, y, this.roomName));
                }
            }
        }
        return positions;
    }

    /**
     * Gets all the open positions from the provided
     * x, y coordinates. This function INCLUDED creeps.
     * It will block the position from being open if a
     * creep is currently standing on it.
     *
     * @returns {void | Array}
     */
    RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
        let nearbyPositions = this.getNearbyPositions();

        let terrain = Game.map.getRoomTerrain(this.roomName);

        let walkablePositions = _.filter(nearbyPositions, function(pos) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
        });

        return _.filter(walkablePositions, function (pos) {
            return !pos.lookFor(LOOK_CREEPS).length;
        });
    }

    /**
     * Gets all of the buildable positions based on
     * the provided x, y coordinates. This function
     * does NOT INCLUDE creeps. This function will
     * return only "walkable" areas. I.e. anything
     * that isn't a wall.
     *
     * Example: new RoomPosition(Game.spawns.Spawn1.pos.x, Game.spawns.Spawn1.pos.y, Game.spawns.Spawn1.room.name)
     *                      .getBuildablePositions()
     * @returns {void | Array}
     */
    RoomPosition.prototype.getBuildablePositions = function getBuildablePositions(spread = 1) {
        let nearByPositions = this.getNearbyPositions(spread);
        let terrain = Game.map.getRoomTerrain(this.roomName);
        let room = Game.rooms[this.roomName];
        var walkablePositions =  _.filter(nearByPositions, function (pos) {
            return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
        });
        return _.filter(walkablePositions, function (pos) {
            var structures = room.lookForAt(LOOK_STRUCTURES, pos);
            var constructionSites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos);
            if(structures[0] === undefined && constructionSites[0] === undefined) {
                return pos;
            }
        });
    }


}
return module.exports;
}
/********** End of module 2: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.room.js **********/
/********** Start module 3: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.string.js **********/
__modules[3] = function(module, exports) {
module.exports = function() {
    /**
     * Converts a string to title case.
     */
    String.prototype.toTitleCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}
return module.exports;
}
/********** End of module 3: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.string.js **********/
/********** Start module 4: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.global.js **********/
__modules[4] = function(module, exports) {
const roleLogic = __require(8,4);
let creepTypes = Object.keys(roleLogic);
const timedCommands = __require(6,4);

module.exports = function() {
    /**
     * Sets the timed commands interval.
     */
    global.setTimedCommandsInterval = function(interval) {
        if(Memory.gameData.timedCommands.interval !== undefined) {
            Memory.gameData.timedCommands.interval = interval;
            Memory.gameData.timedCommands.lastRun = Game.time;
            console.log(`Timed Commands interval set to: ${interval}`);
            return true;
        } else {
            console.log("<font color=#e74c3c>ERROR: Something went wrong with the timedCommands. Refresh timed commands with the global.refreshTimedCommands() method.</font>");
            return false;
        }
    }

    /**
     * Refreshes the entire timed commands memory object.
     */
    global.refreshTimedCommands = function() {
        console.log("Refreshing Timed Commands Memory...");
        delete Memory.gameData.timedCommands;
        timedCommands.init();
        return true;
    }

    /**
     * Set the minimum spawn value for a specific creep type.
     */
    global.setMinSpawnValue = function(creepType, value) {
        Memory.gameData.creepRoles[creepType].minimum = value;
        console.log(`Updated ${creepType.toTitleCase()} creep minimum spawn value to ${value}`);
        return true;
    }

    /**
     * Set the minimum spawn values for all creep types.
     */
    global.setMinSpawnValueAll = function(value) {
        _.forEach(creepTypes, (creepType) => Memory.gameData.creepRoles[creepType].minimum = value);
        console.log("Spawn minimums have been updated for all roles!");
        return true;
    }
}
return module.exports;
}
/********** End of module 4: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\prototype.global.js **********/
/********** Start module 5: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\memoryController.js **********/
__modules[5] = function(module, exports) {
module.exports = {
    clean: function() {
        this.removeOldCreeps();
    },
    removeOldCreeps: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log("<font color=#3498db>Clearing non-existing creep memory:</font>", name);
            }
        }
    },
    init: function() {
        if(Memory.gameData === undefined) {
            Memory.gameData = {
                creepRoles: {
                    harvester: {
                        minimum: 2,
                    },
                    upgrader: {
                        minimum: 2,
                    },
                    builder: {
                        minimum: 2,
                    },
                    repairer: {
                        minimum: 2,
                    }
                },
                myRooms: {},
                timedCommands: {},
                buildQueue: {},
            };
        }
    }
}
return module.exports;
}
/********** End of module 5: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\memoryController.js **********/
/********** Start module 6: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\timedCommands.js **********/
__modules[6] = function(module, exports) {
const roleLogic = __require(8,6);
let creepTypes = Object.keys(roleLogic);
const baseBuilder = __require(9,6);
module.exports = {
    run: function() {
        if(Memory.gameData.timedCommands.lastRun === undefined) {
            this.init();
            this.runCommands();
        }
        if(this.checkShouldRun()) {
            this.runCommands();
        }
    },
    runCommands: function() {
        console.log("<font color=#2ecc71>[Timed Commands] Running timed commands.</font>");
        this.updateBuilderMin();
        this.runBaseBuilder();
        this.giveReport();
    },
    init: function() {
        console.log("<font color=#e74c3c>[Timed Commands] Can not find timedCommands in Memory. Initiailizing...</font>");
        Memory.gameData.timedCommands = {
            lastRun: Game.time,
            interval: 100,
        };
    },
    checkShouldRun: function() {
        let lastRun = Memory.gameData.timedCommands.lastRun;
        let interval = Memory.gameData.timedCommands.interval;

        if((lastRun + interval) === Game.time) {
            Memory.gameData.timedCommands.lastRun = Game.time;
            return true;
        }
    },
    giveReport: function() {
        console.log("<font color=#e67e22>===========================================</font>");
        console.log("<font color=#e67e22>Auto-Generated Report</font>");
        console.log("<font color=#e67e22>===========================================</font>");
        console.log("<font color=#3498db>Current Creep Count</font>");
        _.forEach(creepTypes, function(type) {
            let currentCount = _.filter(Game.creeps, (creep) => creep.memory.role === type).length;
            let minimum = Memory.gameData.creepRoles[type].minimum;
            console.log("<font color=#3498db>" + type.toTitleCase() + ":</font> " + currentCount + " / " + minimum);
        });
    },
    runBaseBuilder: function() {
        console.log("<font color=#3498db>[Timed Commands] Running Base Builder</font>");
        _.forEach(Memory.gameData.myRooms, function(room) {
            baseBuilder.run(room);
        });
    },
    updateBuilderMin: function() {
        _.forEach(Game.rooms, function(room) {
            let constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            if(constructionSites.length > 0) {
                Memory.gameData.creepRoles.builder.minimum = 5;
            } else {
                Memory.gameData.creepRoles.builder.minimum = 2;
            }
        });
    }
}
return module.exports;
}
/********** End of module 6: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\timedCommands.js **********/
/********** Start module 7: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\roomLogic.js **********/
__modules[7] = function(module, exports) {
const utilsCreep = __require(10,7);
const roleLogic = __require(8,7);

module.exports = {
    attemptToSpawnCreep: function(room) {
        let creepTypes = Object.keys(roleLogic);
        let creepTypeNeeded = _.find(creepTypes, function(type) {
            return roleLogic[type].spawn(room, utilsCreep.getMinimum(type));
        });

        let creepSpawnData = roleLogic[creepTypeNeeded] && roleLogic[creepTypeNeeded].spawnData(room);

        if (creepSpawnData) {
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result;
            if(_.filter(Game.creeps).length <= 1) {
                console.log("<font color=#e74c3c>Number of creeps in the room is less then or equal to 1. Spawning default creep!</font>");
                creepSpawnData.body = [WORK,CARRY,MOVE];
                creepSpawnData.memory = {role: 'harvester'};
            }
            result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
            let spawnFailed = Memory.gameData.spawnFailed;
            let spawnFailedCode = Memory.gameData.spawnFailedCode;
            if(spawnFailed !== true || (spawnFailedCode !== result && spawnFailed === true)) {
                switch(result) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log("<font color=#f1c40f>Not enough energy to spawn creep. Waiting for a fill up!</font>");
                        break;
                    case ERR_BUSY:
                        console.log("<font color=#f1c40f>Busy spawning another creep. Waiting for my turn.</font>");
                        break;
                }
                Memory.gameData.spawnFailed = true;
                Memory.gameData.spawnFailedCode = result;
            }
            if(result === 0) {
                console.log(`<font color=#27ae60>Spawned Creep:</font> ${creepSpawnData.name}`);
                console.log(`<font color=#27ae60>Creep Body</font>: ${creepSpawnData.body}`);
                console.log(`<font color=#27ae60>Creep Memory</font>: ${JSON.stringify(creepSpawnData.memory)}`);
                Memory.gameData.spawnFailed = false;
            }
        }
    },
}
return module.exports;
}
/********** End of module 7: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\roomLogic.js **********/
/********** Start module 8: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\roleLogic.js **********/
__modules[8] = function(module, exports) {
module.exports = {
    harvester: __require(11,8),
    upgrader: __require(12,8),
    builder: __require(13,8),
    repairer: __require(14,8),
}
return module.exports;
}
/********** End of module 8: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\roleLogic.js **********/
/********** Start module 9: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\base.build.js **********/
__modules[9] = function(module, exports) {
module.exports = {
    run: function(room) {
        console.log("<font color=#9b59b6>[Base Builder] Running Base Builder Module!</font>");
        this.checkBuildMemory(room);
        let buildMemory = Memory.gameData.buildQueue[room.name];
        let spawn = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN }})[0];
        if(!buildMemory.validSpawn) {
            this.checkBuildArea(spawn);
        } else {
            if(!buildMemory.roads) {
                this.buildRoads(spawn);
            }
            if(!buildMemory.extensions) {
                this.buildExtensions(spawn);
            }

        }
    },
    buildExtensions: function(spawn) {
        console.log("<font color=#9b59b6>[Base Builder] Building Extensions...</font>");
        let controllerLevel = spawn.room.controller.level;
        let positions = [];
        if(controllerLevel >= 2) {
            positions.push(
                {x: (spawn.pos.x - 5), y: (spawn.pos.y - 5)},
                {x: (spawn.pos.x - 4), y: (spawn.pos.y - 5)},
                {x: (spawn.pos.x - 3), y: (spawn.pos.y - 5)},
                {x: (spawn.pos.x - 2), y: (spawn.pos.y - 5)},
                {x: (spawn.pos.x - 3), y: (spawn.pos.y - 4)},
            );
        }
        if(controllerLevel >= 3) {
            positions.push(
                { x: (spawn.pos.x - 7), y: (spawn.pos.y - 4) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y - 4) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y - 3) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y - 3) },
                { x: (spawn.pos.x - 5), y: (spawn.pos.y - 3) },
            );
        }
        if(controllerLevel >= 4) {
            positions.push(
                { x: (spawn.pos.x - 8), y: (spawn.pos.y - 3) },
                { x: (spawn.pos.x - 9), y: (spawn.pos.y - 2) },
                { x: (spawn.pos.x - 8), y: (spawn.pos.y - 2) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y - 2) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y - 2) },
                { x: (spawn.pos.x - 9), y: (spawn.pos.y - 1) },
                { x: (spawn.pos.x - 8), y: (spawn.pos.y - 1) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y - 1) },
                { x: (spawn.pos.x - 9), y: (spawn.pos.y) },
                { x: (spawn.pos.x - 9), y: (spawn.pos.y + 1) },
            );
        }
        if(controllerLevel >= 5) {
            positions.push(
                { x: (spawn.pos.x - 7), y: (spawn.pos.y + 1) },
                { x: (spawn.pos.x - 8), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x - 8), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 5), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 7), y: (spawn.pos.y + 4) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y + 4) },
            );
        }
        if(controllerLevel >= 6) {
            positions.push(
                { x: (spawn.pos.x - 3), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 5), y: (spawn.pos.y + 4) },
                { x: (spawn.pos.x - 4), y: (spawn.pos.y + 4) },
                { x: (spawn.pos.x - 2), y: (spawn.pos.y + 4) },
                { x: (spawn.pos.x - 1), y: (spawn.pos.y + 4) },
                { x: (spawn.pos.x - 6), y: (spawn.pos.y + 5) },
                { x: (spawn.pos.x - 5), y: (spawn.pos.y + 5) },
                { x: (spawn.pos.x - 4), y: (spawn.pos.y + 5) },
                { x: (spawn.pos.x - 3), y: (spawn.pos.y + 5) },
            );
        }
        if(controllerLevel >= 7) {
            positions.push(
                { x: (spawn.pos.x + 1), y: (spawn.pos.y) },
                { x: (spawn.pos.x - 1), y: (spawn.pos.y + 1) },
                { x: (spawn.pos.x), y: (spawn.pos.y + 1) },
                { x: (spawn.pos.x + 1), y: (spawn.pos.y + 1) },
                { x: (spawn.pos.x - 2), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x - 1), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x + 1), y: (spawn.pos.y + 2) },
                { x: (spawn.pos.x - 2), y: (spawn.pos.y + 3) },
                { x: (spawn.pos.x - 1), y: (spawn.pos.y + 3) },
            );
        }
        if(controllerLevel >= 8) {
            positions.push(
                { x: (spawn.pos.x + 1), y: (spawn.pos.y - 1) },
            );
        }


        _.forEach(positions, function(position) {
            let site = spawn.room.createConstructionSite(position.x, position.y, STRUCTURE_EXTENSION);
            if(site === 0) {
                console.log(`Built extension at: ${position.x}, ${position.y}`);
            }
        });

        if(controllerLevel === 8) {
            Memory.gameData.buildQueue[spawn.room.name].extensions = true;
        }
    },
    buildRoads: function(spawn) {
        console.log("<font color=#9b59b6>[Base Builder] Building Roads...</font>");
        let positions = [
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 7), y: (spawn.pos.y - 5) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 5) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y - 5) },
            { x: (spawn.pos.x - 8), y: (spawn.pos.y - 4) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 4) },
            { x: (spawn.pos.x), y: (spawn.pos.y - 4) },
            { x: (spawn.pos.x - 9), y: (spawn.pos.y - 3) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y - 3) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y - 3) },
            { x: (spawn.pos.x - 10), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x - 10), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x - 10), y: (spawn.pos.y) },
            { x: (spawn.pos.x - 7), y: (spawn.pos.y) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y) },
            { x: (spawn.pos.x - 10), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 8), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 10), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 9), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 9), y: (spawn.pos.y + 3) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y + 3) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y + 3) },
            { x: (spawn.pos.x - 8), y: (spawn.pos.y + 4) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y + 4) },
            { x: (spawn.pos.x), y: (spawn.pos.y + 4) },
            { x: (spawn.pos.x - 7), y: (spawn.pos.y + 5) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y + 5) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y + 5) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y + 6) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y + 6) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y + 6) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y + 6) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y + 6) },
        ];

        let buildSuccess = true;
        _.forEach(positions, function(position) {
            let site = spawn.room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
            if(site === 0) {
                console.log(`Built road at: ${position.x}, ${position.y}`);
            } else {
                buildSuccess = false;
                return false;
            }
        });

        if(buildSuccess) {
            Memory.gameData.buildQueue[spawn.room.name].roads = true;
        }
    },
    checkBuildArea: function(spawn) {
        let startX = (spawn.pos.x - 10);
        let startY = (spawn.pos.y - 6);
        let endX = (spawn.pos.x + 2);
        let endY = (spawn.pos.y + 6);

        console.log("Checking build area around spawn");
        console.log(`Start XY: [${startX}, ${startY}]`);
        console.log(`End XY: [${endX}, ${endY}]`);

        if(startX <= 0 || startY <= 0 || endX >= 49 || endY >= 49) {
            console.log("Can not build base here. Too close to edge.");
            return false;
        }

        var positions = [];

        for(x = startX; x <= endX && x < 49; x++) {
            for(y = startY; y <= endY && y < 49; y++) {
                if(x !== spawn.pos.x || y !== spawn.pos.y) {
                    positions.push(new RoomPosition(x, y, spawn.room.name));
                }
            }
        }

        let terrain = Game.map.getRoomTerrain(spawn.room.name);

        let walkablePositions = _.filter(positions, function(pos) {
            return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
        });

        Memory.gameData.buildQueue[spawn.room.name].validSpawn = true;
    },
    checkBuildMemory: function(room) {
        if(Memory.gameData.buildQueue === undefined) {
            console.log("Build Memory Initializing...");
            Memory.gameData.buildQueue = {};
        }
        if(Memory.gameData.buildQueue[room.name] === undefined) {
            console.log(`Room ${room.name} added to the build memory.`);
            Memory.gameData.buildQueue = {
                [room.name]: {
                    validSpawn: false,
                    spawns: false,
                    extensions: false,
                    links: false,
                    roads: false,
                    walls: false,
                    ramparts: false,
                    storage: false,
                    towers: false,
                    observer: false,
                    powerSpawn: false,
                    extractor: false,
                    terminal: false,
                    labs: false,
                    nuker: false,
                    factory: false,
                    firstRun: Game.time,
                }
            };
        }
        if(Memory.gameData.buildQueue[room.name].firstRun >= (Memory.gameData.buildQueue[room.name].firstRun + 1000)) {
            console.log("Clearing Build Queue memory.");
            delete Memory.gameData.buildQueue[room.name];
        }
    }
}
return module.exports;
}
/********** End of module 9: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\base.build.js **********/
/********** Start module 10: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\utils.creep.js **********/
__modules[10] = function(module, exports) {
module.exports = {
    getMinimum: function(type) {
        if(!Memory.gameData.creepRoles[type].minimum) {
            console.log('Memory does not hold minimums. Populating Minimum Creep Values.');
            Memory.gameData.creepRoles[type].minimum = 2;
        }

        return Memory.gameData.creepRoles[type].minimum;
    },
    /**
     * Gets a creep body bases upon a segment array passed to
     * the function.
     *
     * @param segment - Array of body parts
     * @param room - Current room that the creep is in
     * @returns {[]}
     */
     getBody: function(segment, room) {
        let body = [];
        let energyAvailable = room.energyAvailable;
        let energyCapacityAvailable = room.energyCapacityAvailable;
        let energyRatio = room.energyCapacityAvailable / room.energyAvailable;
        if(energyCapacityAvailable === 300) {
            return segment;
        }
        if(energyRatio <= 2) {
            while(energyAvailable >= 0) {
                _.forEach(segment, function(bodyPart) {
                    partCost = BODYPART_COST[bodyPart];
                    energyAvailable -= BODYPART_COST[bodyPart];
                    if(energyAvailable >= 0) {
                        body.push(bodyPart);
                    }
                });
            }
        }
        return body;
    }
}
return module.exports;
}
/********** End of module 10: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\utils.creep.js **********/
/********** Start module 11: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.harvester.js **********/
__modules[11] = function(module, exports) {
const utilsCreep = __require(10,11);

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var task = creep.getWorkTask('mining', 'transferring');
        switch(task) {
            case 'mining':
                creep.mineEnergySource();
                break;
            case 'transferring':
                creep.unloadEnergyToStructure();
                break;
        }
    },
    /**
     * Checks if the room needs to spawn a creep.
     *
     * @param room - The current room that the spawner is in.
     * @param minimum - The minimum number of creeps that is pulled from Memory.gameData.minimums
     * @returns {boolean} - Returns true if the creep type should be spawned.
     */
    spawn: function(room, minimum) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.room.name === room.name);

        if (harvesters.length < minimum) {
            return true;
        }
    },
    /**
     * Defines the creep object that is passed to the createCreep() method on the StructureSpawn object.
     * @param room - Defines the room that the spawner is in.
     * @returns Object - Returns the creep object to be passed back to the spawner logic.
     */
    spawnData: function(room) {
            let name = 'Harvester' + Game.time;
            let body = utilsCreep.getBody([WORK, CARRY, CARRY, MOVE], room);
            let memory = {role: 'harvester'};

            return {name, body, memory};
    }
};
return module.exports;
}
/********** End of module 11: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.harvester.js **********/
/********** Start module 12: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.upgrader.js **********/
__modules[12] = function(module, exports) {
const utilsCreep = __require(10,12);

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var task = creep.getWorkTask('mining', 'upgrading');
        switch(task) {
            case 'mining':
                creep.mineEnergySource();
                break;
            case 'upgrading':
                creep.transferToController();
                break;
        }
    },
    /**
     * Checks if the room needs to spawn a creep.
     *
     * @param room - The current room that the spawner is in.
     * @param minimum - The minimum number of creeps that is pulled from Memory.gameData.minimums
     * @returns {boolean} - Returns true if the creep type should be spawned.
     */
    spawn: function(room, minimum) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.room.name === room.name);

        if (upgraders.length < minimum) {
            return true;
        }
    },
    /**
     * Defines the creep object that is passed to the createCreep() method on the StructureSpawn object.
     * @param room - Defines the room that the spawner is in.
     * @returns Object - Returns the creep object to be passed back to the spawner logic.
     */
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let body = utilsCreep.getBody([WORK, CARRY, CARRY, MOVE], room);
            let memory = {role: 'upgrader'};
        
            return {name, body, memory};
    }
}
return module.exports;
}
/********** End of module 12: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.upgrader.js **********/
/********** Start module 13: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.builder.js **********/
__modules[13] = function(module, exports) {
const utilsCreep = __require(10,13);

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var task = creep.getWorkTask('mining', 'building');
        switch(task) {
            case 'mining':
                creep.mineEnergySource();
                break;
            case 'building':
                creep.buildStructure();
                break;
        }
    },
    /**
     * Checks if the room needs to spawn a creep.
     *
     * @param room - The current room that the spawner is in.
     * @param minimum - The minimum number of creeps that is pulled from Memory.gameData.minimums
     * @returns {boolean} - Returns true if the creep type should be spawned.
     */
    spawn: function(room, minimum) {
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.room.name === room.name);

        if (builders.length < minimum) {
            return true;
        }
    },
    /**
     * Defines the creep object that is passed to the createCreep() method on the StructureSpawn object.
     * @param room - Defines the room that the spawner is in.
     * @returns Object - Returns the creep object to be passed back to the spawner logic.
     */
    spawnData: function(room) {
        let name = 'Builder' + Game.time;
        let body = utilsCreep.getBody([WORK, WORK, CARRY, MOVE], room);
        let memory = {role: 'builder'};

        return {name, body, memory};
    }
}
return module.exports;
}
/********** End of module 13: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.builder.js **********/
/********** Start module 14: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.repairer.js **********/
__modules[14] = function(module, exports) {
const utilsCreep = __require(10,14);

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var task = creep.getWorkTask('mining', 'repairing');
        switch(task) {
            case 'mining':
                creep.mineEnergySource();
                break;
            case 'repairing':
                creep.repairStructure();
                break;
        }
    },
    /**
     * Checks if the room needs to spawn a creep.
     *
     * @param room - The current room that the spawner is in.
     * @param minimum - The minimum number of creeps that is pulled from Memory.gameData.minimums
     * @returns {boolean} - Returns true if the creep type should be spawned.
     */
    spawn: function(room, minimum) {
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer' && creep.room.name === room.name);

        if (repairers.length < minimum) {
            return true;
        }
    },
    /**
     * Defines the creep object that is passed to the createCreep() method on the StructureSpawn object.
     * @param room - Defines the room that the spawner is in.
     * @returns Object - Returns the creep object to be passed back to the spawner logic.
     */
    spawnData: function(room) {
        let name = 'Repairer' + Game.time;
        let body = utilsCreep.getBody([WORK, WORK, CARRY, MOVE], room);
        let memory = {role: 'repairer'};

        return {name, body, memory};
    }
}
return module.exports;
}
/********** End of module 14: C:\Users\Jonathan\AppData\Local\Screeps\scripts\10_0_0_2___21025\ZeroNull\src\role.repairer.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
