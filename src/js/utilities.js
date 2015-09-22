/**
 *  Generate a variable integer
 * @param multiplier
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

