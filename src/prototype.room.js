/**
 * All functions in here must be instantiated by running
 * RoomPositions(x,y, roomName).function();
 */

module.exports = function() {
    /**
     * Returns all nearby positions from the provided x, y
     * coordinates in the form of an array.
     *
     * @returns {[]}
     */
    RoomPosition.prototype.getNearbyPositions = function getNearbyPositions(spread = 1) {
        var positions = [];

        // Get the startX and startY numeric values.
        // If this.x - 1 is zero then return 1.
        // All variables if it returns false or 0 it will
        // use the other value so long as there is a ||.
        let startX = this.x - spread || 1;
        let startY = this.y - spread || 1;

        // Loop through horizontally across the map
        // If we're using the coordinates (x=25,y=25) then
        // x <= 25 + 1 (Equals 26) and ensure that x doesn't
        // go out of bounds which is why x < 49 is there.
        // Increase x by one each loop. This condition is the
        // same on the Y axis as well.
        for(x = startX; x <= this.x + spread && x < 49; x++) {
            for(y = startY; y <= this.y + spread && y < 49; y++) {
                // If the x OR y condition doesn't equal the
                // passed position from the Object push the
                // position into the positions array.
                if(x !== this.x || y !== this.y) {
                    positions.push(new RoomPosition(x, y, this.roomName));
                }
            }
        }

        // Return an array of all the positions
        return positions;
    }

    /**
     * Gets all the open positions from the provided
     * x, y coordinates. This function INCLUDED creeps.
     * It will block the position from being open if a
     * creep is currently standing on it.
     *
     * @returns {void | Array}
     */
    RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
        let nearbyPositions = this.getNearbyPositions();

        let terrain = Game.map.getRoomTerrain(this.roomName);

        let walkablePositions = _.filter(nearbyPositions, function(pos) {
        return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
        });

        return _.filter(walkablePositions, function (pos) {
            return !pos.lookFor(LOOK_CREEPS).length;
        });
    }

    /**
     * Gets all of the buildable positions based on
     * the provided x, y coordinates. This function
     * does NOT INCLUDE creeps. This function will
     * return only "walkable" areas. I.e. anything
     * that isn't a wall.
     *
     * Example: new RoomPosition(Game.spawns.Spawn1.pos.x, Game.spawns.Spawn1.pos.y, Game.spawns.Spawn1.room.name)
     *                      .getBuildablePositions()
     * @returns {void | Array}
     */
    RoomPosition.prototype.getBuildablePositions = function getBuildablePositions(spread = 1) {
        // Grab all the nearby positions
        let nearByPositions = this.getNearbyPositions(spread);

        // Grab the terrain of the room
        let terrain = Game.map.getRoomTerrain(this.roomName);

        // Grab the room itself
        let room = Game.rooms[this.roomName];

        // Grab all the walkable positions
        var walkablePositions =  _.filter(nearByPositions, function (pos) {
            return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
        });

        // Filter all the walkable positions to see if an existing
        // structure or construction site is there. If it is not there,
        // return the position and then return all positions that you
        // can currently build on.
        return _.filter(walkablePositions, function (pos) {
            var structures = room.lookForAt(LOOK_STRUCTURES, pos);
            var constructionSites = room.lookForAt(LOOK_CONSTRUCTION_SITES, pos);
            if(structures[0] === undefined && constructionSites[0] === undefined) {
                return pos;
            }
        });
    }


}