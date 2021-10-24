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
        // console.log(sources);
        if(sources.length) {
            let source = _.find(sources, function(s) {
                // console.log(s.pos, s.pos.getOpenPositions());
                return s.pos.getOpenPositions().length > 0;
            });
            // console.log(sources.length, source);
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
        // console.log(storedSource);
        if(!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
            // console.log(this.name + " --- Creep could not find a source. Cleaning memory.");
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

        // If the current room that the creep is
        // in has energy equal to the total energy
        // capacity of the room, then change the
        // creeps task to an upgrader.
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
        // Grab the closest construction site
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

        // If the closest construction site does not exist
        // then force the creep to upgrade the room controller
        // by reassigning them the role of upgrader
        if(!constructionSite[0]) {
            this.transferToController();
        }
        // Otherwise build the structure
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

        // If the total stored energy inside of the creep
        // is equal to 0, then mark the creep for the
        // mining task.
        if(energyStored === 0) {
            this.memory.task = noEnergyTask;
        }

        // If the total stored energy inside of the creep
        // is equal to the total capacity the creep can
        // carry, the mark the creep for transferring the
        // energy to an appropriate storage facility.
        if(energyStored === energyCapacity) {
            this.memory.task = fullEnergyTask;
        }

        // Return the task
        return this.memory.task;
    }
}