const roleLogic = require('./roleLogic');
let creepTypes = Object.keys(roleLogic);

module.exports = {
    run: function() {
        // Check if the timedCommands are in Memory
        if(Memory.gameData.timedCommands.lastRun === undefined) {
            // Initialize timedCommands
            this.init();
            // Then run the commands
            this.runCommands();
        }

        // If we should run the timed commands
        if(this.checkShouldRun()) {
            // Run them
            this.runCommands();
        }
    },
    runCommands: function() {
        console.log("<font color=#2ecc71>[Timed Commands] Running timed commands.</font>");

        // Update the Builder Minimum value
        // this.updateBuilderMin();
        // Run the Base Builder Module
        // this.runBaseBuilder();
        // Give a report to console
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
        // Current Creep Count vs. Minimum Count
        console.log("<font color=#3498db>Current Creep Count</font>");
        _.forEach(creepTypes, function(type) {
            let currentCount = _.filter(Game.creeps, (creep) => creep.memory.role === type).length;
            let minimum = Memory.gameData.creepRoles[type].minimum;
            console.log("<font color=#3498db>" + type.toTitleCase() + ":</font> " + currentCount + " / " + minimum);
        });
    },
}