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
    runCommands: function() {
        console.log("<font color=#2ecc71>[Timed Commands] Running timed commands.</font>");

        // Update the Builder Minimum value
        // this.updateBuilderMin();
        // Run the Base Builder Module
        // this.runBaseBuilder();
        // Give a report to console
        // this.giveReport();
    },
}