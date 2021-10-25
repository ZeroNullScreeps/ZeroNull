const roleLogic = require('./roleLogic');
let creepTypes = Object.keys(roleLogic);
const timedCommands = require('./timedCommands');

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