/**
 * Created by jack on 9/29/15.
 */

var app = app || {};

(function() {
    /**
     * @description Represents a point on a 2 dimensional x / y coordinate system.
     *
     * @param {Number} [x=0] X Position
     * @param {Number} [y=0] Y Position
     * @constructor
     * @class Point
     */
    function Point(x, y) {
        this.setValues(x, y);
    }

    /**
     * Sets the values on this instance
     * @method setValues
     * @param {Number} [x=0] X Position
     * @param {Number} [y=0] Y Position
     * @returns {Point} This instance.
     */
    Point.prototype.setValues = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    };

    Point.prototype.copy = function(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    };

    Point.prototype.clone = function() {
        return new Point(this.x, this.y);
    };

    Point.prototype.toString = function() {
        return '[Point (x=' + this.x + ' y=' + this.y + ')]';
    };

    app.Point = Point;
})();
