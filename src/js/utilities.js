/**
 *  Generate a variable integer
 * @param {Number} multiplier
 * @param addOn
 * @returns {number}
 */
var variableInteger = function(multiplier, addOn) {
    var x = Math.floor((Math.random() * multiplier) + addOn);

    if (x > multiplier) {
        return multiplier;
    }
    return x;
};

/**
 * Set the rectangle bounds about an entity.
 * @param entity
 */
var setEntityBounds = function(entity) {
    entity.left = entity.x + entity.xOffset;
    entity.right = entity.left + entity.width;
    entity.top = entity.y + entity.yOffset;
    entity.bottom = entity.top + entity.height;
};

// Quadratic Bezier Curve for 2 Control Points, total 3 points.
function B0_2(t) { return (1 - t) * (1 - t); }
function B1_2(t) { return 2 * (1 - t) * t; }
function B2_2(t) { return t * t; }

// Derivative for Quadratic Bezier Curve
function B0_2_DT(t) { return 2 * (1 - t); }
function B1_2_DT(t) { return 2 * t; }

// Cubic Bezier Curve for 3 Control Points, total 4 points.
function B0_3(t) { return (1 - t) * (1 - t) * (1 - t); }
function B1_3(t) { return 3 * ((1 - t) * (1 - t)) * t; }
function B2_3(t) { return 3 * (1 - t) * ( t * t); }
function B3_3(t) { return t * t * t; }

// Derivative for Cubic Bezier Curve
function B0_3_DT(t) { return 3 * ((1 - t) * (1 - t)); }
function B1_3_DT(t) { return 6 * (1 - t) * t; }
function B2_3_DT(t) { return 3 * t * t; }

/**
 * @description Calculate location of point on Bezier curve at time t.
 *
 * Function calculates the x and y value along a Bezier curve at given
 * time 't'. The function accepts a variable number of arguments between
 * 3 and 5. The last argument specified must be the 't' value indicating
 * location along the curve.
 *
 * @param {Point} Point objects used as the control points in the calculation. 2, 3 or 4
 * @param {Number} t Location calculated along the curve. Valid values are:    0 <= t >= 1;
 * @returns {Point} Point on the curve at the given t value
 */
var bezierPoint = function() {
    var t = Array.prototype.slice.call(arguments,arguments.length - 1);
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

    var x = 0;
    var y = 0;

    if (arguments.length === 5) {
        // Calculate a point along a Cubic Bezier Curve
        x = B0_3(t) * args[0].x + B1_3(t) * args[1].x + B2_3(t) * args[2].x + B3_3(t) * args[3].x;
        y = B0_3(t) * args[0].y + B1_3(t) * args[1].y + B2_3(t) * args[2].y + B3_3(t) * args[3].y;
    }
    else if (arguments.length === 4) {
        // Calculate a point along a Quadratic Bezier Curve
        x = B0_2(t) * args[0].x + B1_2(t) * args[1].x + B2_2(t) * args[2].x;
        y = B0_2(t) * args[0].y + B1_2(t) * args[1].y + B2_2(t) * args[2].y;
    }
    else if (arguments.length === 3) {
        x = (1 - t) * args[0].x + t * args[1].x;
        y = (1 - t) * args[0].y + t * args[1].x;
    }
    return new app.Point(x,y);
};

/**
 * @description Calculate the angle tangent to the Bezier Curve
 *
 * Function calculates the angle tangent to the Bezier Curve at given
 * time 't'. The function accepts a variable number of arguments between
 * 3 and 5. The last argument specified must be the 't' value indicating
 * location along the curve.
 *
 * @param {Point} Point objects used as the control points in the calculation. 2, 3 or 4
 * @param {number} t - Angle calculated along the curve. Valid values are:    0 <= t >= 1;
 *
 * @returns {number} angle in Radians, PI / 2 is added to the return value to orient 0 up.
 *
 */
var bezierTangent = function() {
    var t = Array.prototype.slice.call(arguments, arguments.length - 1);
    var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    var dx = 0;
    var dy = 0;

    if (arguments.length === 5) {
        dx = B0_3_DT(t) * (args[1].x - args[0].x) + B1_3_DT(t) * (args[2].x - args[1].x) + B2_3_DT(t) * (args[3].x - args[2].x);
        dy = B0_3_DT(t) * (args[1].y - args[0].y) + B1_3_DT(t) * (args[2].y - args[1].y) + B2_3_DT(t) * (args[3].y - args[2].y);
    }
    else if (arguments.length === 4) {
        dx = B0_2_DT(t) * (args[1].x - args[0].x) + B1_2_DT(t) * (args[2].x - args[1].x);
        dy = B0_2_DT(t) * (args[1].y - args[0].y) + B1_2_DT(t) * (args[2].y - args[1].y);
    }

    return Math.atan2(dy, dx) + (Math.PI / 2);
};

var calculateBezierCurvePoints = function() {
    var savedArguments = [];
    var points = [];
    if (arguments.length === 4) {
        for (var t = 0; t <= 1; t = t + 0.01) {
            savedArguments = Array.prototype.slice.call(arguments);
            savedArguments.push(t);
            points.push(bezierPoint.apply(null, savedArguments));
            savedArguments = [];
        }
    }
    return points;
};

var calculateBezierCurveAngles = function() {
    var savedArguments = [];
    var angles = [];
    if (arguments.length === 4) {
        for (var t = 0; t <= 1; t = t + 0.01) {
            savedArguments = Array.prototype.slice.call(arguments);
            savedArguments.push(t);
            angles.push(bezierTangent.apply(null, savedArguments));
            savedArguments = [];
        }
    }
    return angles;
};
