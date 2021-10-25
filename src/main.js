// Require Prototypes
require('./prototype.creep')();
require('./prototype.room')();
require('./prototype.string')();
require('./prototype.global')();

// Require Utilities
const memoryController = require('./memoryController');
const timedCommands = require('./timedCommands');

// Require Room Logic
const roomLogic = require('./roomLogic');

// Require Role Logic
const roleLogic = require('./roleLogic');

module.exports.loop = function () {
    // Run the memory controller initialization
    memoryController.init();

    // Run the timed command logic
    timedCommands.run();

    // make a list of all of our rooms
    Memory.gameData.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    
    /**
     * Loop through all our rooms. This is the main loop
     * that handles spawning and creep functionality.
     */
     _.forEach(Memory.gameData.myRooms, function(room) {

        // Run the room defense module
        // roomLogic.defense(room);

        // Run the spawning logic to see if a
        // creep needs to be spawned inside of
        // the current room.
        roomLogic.attemptToSpawnCreep(room);

        // Grab all of the creeps and loop
        // through them and run their specified
        // role functions. More info in
        // ./creeps/*.js
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            let role = creep.memory.role;
            if (roleLogic[role]) {
                roleLogic[role].run(creep);
            }
        }
    });
    
    // Run the memory controller to save memory
    memoryController.clean();
    
}