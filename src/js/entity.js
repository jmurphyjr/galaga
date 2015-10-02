/**
 * Created by jack on 9/29/15.
 */

var app = app || {};

(function() {
    /**
     *
     * @param {object} sprite object includes image, size, scale attributes
     * @param {Point} startingPosition Where the image will start on the canvas
     * @param {string} type Type of entity.
     * @constructor
     * @class
     */
    var Entity = function(sprite, startingPosition, type) {
        this.sprite = sprite || '';
        this.hasSpriteSheet = (sprite.sprite) ? true:false;
        this.spriteFrame = 0;

        this.startingPosition = new app.Point(startingPosition.x,startingPosition.y) || {};
        this.currentPosition = this.startingPosition.clone();
        this.lastPosition = startingPosition;
        this.x = this.startingPosition.x || 0;
        this.y = this.startingPosition.y || 0;
        var imgW = this.sprite.size.width * this.sprite.scale;
        var imgH = this.sprite.size.height * this.sprite.scale;
        if (this.sprite.image !== '') {
            this.rect = { x: this.x, y: this.y, width: imgW, height: imgH };
        }
        else {
            this.rect = { x: null, y: null, width: null, height: null };
        }
        this.speed = 0;
        this.type = type || '';
    };

    /**
     * Get the current position of this entity
     *
     * @returns {Point|*}
     */
    Entity.prototype.getCurrentPosition = function() {
        return this.currentPostion;
    };

    /**
     * Get the last position of this entity
     *
     * @returns {Point|*}
     */
    Entity.prototype.getLastPosition = function() {
        return this.lastPostion;
    };

    /**
     * Get starting position for this entity
     *
     * @returns {Point|*}
     * @method
     */
    Entity.prototype.getStartingPosition = function() {
        return this.startingPosition;
    };

    /**
     * Set sprite image URL
     *
     * @param {string} spriteFileName
     * @throws {error} If spriteFileName is not string
     */
    Entity.prototype.setSpriteImage = function(spriteFileName) {

        if (typeof spriteFileName !== 'string') {
            throw new Error('spriteFileName must be string type');
        }
        this.sprite = spriteFileName;
    };

    /**
     * Renders the entity on the canvas context
     *
     * @param {object} ctx Canvas context
     */
    Entity.prototype.render = function(ctx) {
        if (this.hasSpriteSheet) {
            ctx.drawImage(Resources.get(this.sprite.image), this.sprite.sprite[this.spriteFrame].x, this.sprite.sprite[this.spriteFrame].y, this.sprite.sprite[this.spriteFrame].w, this.sprite.sprite[this.spriteFrame].h, this.currentPosition.x, this.currentPosition.y, this.sprite.sprite[this.spriteFrame].w * this.sprite.scale, this.sprite.sprite[this.spriteFrame].h * this.sprite.scale);
        }
        else {
            ctx.drawImage(Resources.get(this.sprite.image), this.currentPosition.x, this.currentPosition.y, this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
        }
    };

    /**
     * Exports to the app namespace
     *
     * @type {Function}
     */
    app.Entity = Entity;
})();

