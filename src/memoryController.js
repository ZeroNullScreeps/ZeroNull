module.exports = {
    clean: function() {
        this.removeOldCreeps();
    },
    removeOldCreeps: function() {
        // free up memory if creep no longer exists
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
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