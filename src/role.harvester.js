const utilsCreep = require('./utils.creep');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Grab the task the creep should perform
        var task = creep.getWorkTask('mining', 'transferring');

        // Run the task
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
        // console.log('Harvesters: ' + harvesters.length, room.name);

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