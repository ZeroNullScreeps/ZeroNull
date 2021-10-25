module.exports = {
    getMinimum: function(type) {
        if(!Memory.gameData.creepRoles[type].minimum) {
            console.log('Memory does not hold minimums. Populating Minimum Creep Values.');
            Memory.gameData.creepRoles[type].minimum = 2;
        }

        return Memory.gameData.creepRoles[type].minimum;
    },
    /**
     * Gets a creep body bases upon a segment array passed to
     * the function.
     *
     * @param segment - Array of body parts
     * @param room - Current room that the creep is in
     * @returns {[]}
     */
     getBody: function(segment, room) {
        // Define the body array
        let body = [];

        // Define the rooms total energy capacity
        let energyAvailable = room.energyAvailable;
        let energyCapacityAvailable = room.energyCapacityAvailable;
        let energyRatio = room.energyCapacityAvailable / room.energyAvailable;
        
        // If the energy capacity is equal to 300
        if(energyCapacityAvailable === 300) {
            // then return the segment
            return segment;
        }

        // console.log(`Energy Ratio: ${energyRatio}`);
        if(energyRatio <= 2) {
            // While the energy capacity store is greater then or
            // equal to 0, continue looping.
            while(energyAvailable >= 0) {
                // console.log(`Energy Available: ${energyAvailable}`);
                // For each role body segment loop through the body parts
                _.forEach(segment, function(bodyPart) {
                    // Get the bodyPart cost
                    partCost = BODYPART_COST[bodyPart];
                    // Subtract the body part cost from the energy capacity
                    energyAvailable -= BODYPART_COST[bodyPart];
                    // If the energy capacity is still greater then or equal to 0
                    if(energyAvailable >= 0) {
                        // Push the body part to the body array
                        body.push(bodyPart);
                    }
                });
            }
        }

        // Return the body array
        return body;
    }
}