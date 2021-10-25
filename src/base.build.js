module.exports = {
    run: function(room) {
        console.log("<font color=#9b59b6>[Base Builder] Running Base Builder Module!</font>");
        // Check to see if build memory is active
        this.checkBuildMemory(room);

        // Assign the room build memory to a variable
        let buildMemory = Memory.gameData.buildQueue[room.name];

        // Assign the first spawn of the room to a variable
        let spawn = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_SPAWN }})[0];

        // Check if the build area is valid
        if(!buildMemory.validSpawn) {
            this.checkBuildArea(spawn);
        } else {
            // Roads
            if(!buildMemory.roads) {
                this.buildRoads(spawn);
            }
            // Extensions
            if(!buildMemory.extensions) {
                this.buildExtensions(spawn);
            }
            // Towers
            if(!buildMemory.towers) {
                this.buildTowers(spawn);
            }

        }
    },
    buildTowers: function(spawn) {
        console.log("<font color=#9b59b6>[Base Builder] Building Towers...</font>");
        let controllerLevel = spawn.room.controller.level;
        let positions = [];
        if(controllerLevel >= 3) {
            positions.push(
                {x: spawn.pos.x - 4, y: spawn.pos.y - 2},
            );
        }
        if(controllerLevel >= 5) {
            positions.push(
                {x: spawn.pos.x - 4, y: spawn.pos.y + 2},
            );
        }
        if(controllerLevel >= 7) {
            positions.push(
                {x: spawn.pos.x - 6, y: spawn.pos.y},
            );
        }
        if(controllerLevel >= 8) {
            positions.push(
                {x: spawn.pos.x - 4, y: spawn.pos.y - 1},
                {x: spawn.pos.x - 4, y: spawn.pos.y + 1},
                {x: spawn.pos.x - 2, y: spawn.pos.y},
            );
        }

        _.forEach(positions, function(position) {
            let site = spawn.room.createConstructionSite(position.x, position.y, STRUCTURE_TOWER);
            if(site === 0) {
                console.log(`Built tower at: ${position.x}, ${position.y}`);
            }
        });

        if(controllerLevel === 8) {
            Memory.gameData.buildQueue[spawn.room.name].towers = true;
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
            // Y = -6
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y - 6) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y - 6) },
            // Y = -5
            { x: (spawn.pos.x - 7), y: (spawn.pos.y - 5) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 5) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y - 5) },
            // Y = -4
            { x: (spawn.pos.x - 8), y: (spawn.pos.y - 4) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 4) },
            { x: (spawn.pos.x), y: (spawn.pos.y - 4) },
            // Y = -3
            { x: (spawn.pos.x - 9), y: (spawn.pos.y - 3) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y - 3) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y - 3) },
            // Y = -2
            { x: (spawn.pos.x - 10), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y - 2) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y - 2) },
            // Y = -1
            { x: (spawn.pos.x - 10), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x), y: (spawn.pos.y - 1) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y - 1) },
            // Y = 0
            { x: (spawn.pos.x - 10), y: (spawn.pos.y) },
            { x: (spawn.pos.x - 7), y: (spawn.pos.y) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y) },
            // Y = +1
            { x: (spawn.pos.x - 10), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 8), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 6), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y + 1) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y + 1) },
            // Y = +2
            { x: (spawn.pos.x - 10), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 9), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 5), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y + 2) },
            { x: (spawn.pos.x + 2), y: (spawn.pos.y + 2) },
            // Y = +3
            { x: (spawn.pos.x - 9), y: (spawn.pos.y + 3) },
            { x: (spawn.pos.x - 4), y: (spawn.pos.y + 3) },
            { x: (spawn.pos.x + 1), y: (spawn.pos.y + 3) },
            // Y = +4
            { x: (spawn.pos.x - 8), y: (spawn.pos.y + 4) },
            { x: (spawn.pos.x - 3), y: (spawn.pos.y + 4) },
            { x: (spawn.pos.x), y: (spawn.pos.y + 4) },
            // Y = +5
            { x: (spawn.pos.x - 7), y: (spawn.pos.y + 5) },
            { x: (spawn.pos.x - 2), y: (spawn.pos.y + 5) },
            { x: (spawn.pos.x - 1), y: (spawn.pos.y + 5) },
            // Y = +6
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
                // If the x OR y condition doesn't equal the
                // passed position from the Object push the
                // position into the positions array.
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
            // Set memory of room building
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
        // Double check if all the structures are built by deleting
        // the room from memory and resetting all of the values
        if(Memory.gameData.buildQueue[room.name].firstRun >= (Memory.gameData.buildQueue[room.name].firstRun + 1000)) {
            console.log("Clearing Build Queue memory.");
            delete Memory.gameData.buildQueue[room.name];
        }
    }
}