module.exports = function() {
    /**
     * Converts a string to title case.
     */
    String.prototype.toTitleCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}