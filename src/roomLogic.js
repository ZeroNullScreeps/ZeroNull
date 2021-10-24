const utilsCreep = require('./utils.creep');
const roleLogic = require('./roleLogic');

module.exports = {
    attemptToSpawnCreep: function(room) {
        // Get a list of all the creep roles
        let creepTypes = Object.keys(roleLogic);
        
        // foreach creep type
        let creepTypeNeeded = _.find(creepTypes, function(type) {
            return roleLogic[type].spawn(room, utilsCreep.getMinimum(type));
        });

        let creepSpawnData = roleLogic[creepTypeNeeded] && roleLogic[creepTypeNeeded].spawnData(room);

        if (creepSpawnData) {
            // find the first or 0th spawn in the room
            let spawn = room.find(FIND_MY_SPAWNS)[0];
    
            // define the result variable
            let result;
    
            // Add a check to make sure there are creeps
            // in the room. If there are no creeps then
            // spawn a basic harvester creep.
            if(_.filter(Game.creeps).length <= 1) {
                console.log("<font color=#e74c3c>Number of creeps in the room is less then or equal to 1. Spawning default creep!</font>");
                creepSpawnData.body = [WORK,CARRY,MOVE];
                creepSpawnData.memory = {role: 'harvester'};
            }
    
            // Try and spawn a creep
            result = spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory});
    
    
            // Define the spawnFailed & spawnFailedCode variables
            let spawnFailed = Memory.gameData.spawnFailed;
            let spawnFailedCode = Memory.gameData.spawnFailedCode;
    
            // If the spawnFailed does not yet equal true
            // Means that the spawn has yet to fail once...
            // If the spawnFailedCode does not equal the result AND spawnFailed is true
            // That means that the spawn has failed once but the reason has changed...
            // If this code block does not run then the spawn was successful.
            if(spawnFailed !== true || (spawnFailedCode !== result && spawnFailed === true)) {
                // Output the appropriate error message.
                switch(result) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log("<font color=#f1c40f>Not enough energy to spawn creep. Waiting for a fill up!</font>");
                        break;
                    case ERR_BUSY:
                        console.log("<font color=#f1c40f>Busy spawning another creep. Waiting for my turn.</font>");
                        break;
                }
                // Update the Memory variables
                Memory.gameData.spawnFailed = true;
                Memory.gameData.spawnFailedCode = result;
            }
    
            // If the spawn was successful!
            if(result === 0) {
                console.log(`<font color=#27ae60>Spawned Creep:</font> ${creepSpawnData.name}`);
                console.log(`<font color=#27ae60>Creep Body</font>: ${creepSpawnData.body}`);
                console.log(`<font color=#27ae60>Creep Memory</font>: ${JSON.stringify(creepSpawnData.memory)}`);
                Memory.gameData.spawnFailed = false;
            }
        }
    },
}