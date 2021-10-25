const utilsCreep = require('./utils.creep');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Grab the task the creep should perform
        var task = creep.getWorkTask('mining', 'building');

        // Run the task
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