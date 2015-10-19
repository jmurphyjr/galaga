var app = app || {};
(function() {
    'use strict';
    var sprites = {
        red: {
            image: 'images/galaga-red-fighter.png',
            size: {
                width: 138,
                height: 145
            },
            scale: 0.23
        },
        white: {
            image: 'images/galaga-white-fighter.png',
            size: {
                width: 138,
                height: 145
            },
            scale: 0.23
        }
    };
    /**
     * @description Represents a player
     * @param {object} startingPosition x and y location for starting position
     * @param {string} type Identifies the type
     * @constructor
     */
    var Player = function(startingPosition, type) {
        app.Entity.call(this, sprites[type], startingPosition, type);

        /**
         * @description controls the direction of movement for the player.
         * @property
         * @type {Number}
         */
        this.direction = +1;

        /**
         * @description holds the missile objects associated with the Player.
         * @property
         * @type {Array}
         */
        this.missiles = [];

        var key = this.keys = [];
        this.move = false;
        this.fireTimer = 0;
        this.fireSpacing = 250;
        this.score = 0;
    };
    Player.prototype = Object.create(app.Entity.prototype);
    Player.prototype.constructor = Player;
    Player.prototype.keyDown = function(evt) {
        // console.log(evt);
        this.keys[evt.keyCode] = true;
    };
    Player.prototype.keyUp = function(evt) {
        // console.log(evt);
        this.keys[evt.keyCode] = false;
    };

    /**
     * @description Sets up event listeners for keyup and keydown actions.
     * @param win
     */
    Player.prototype.init = function(win) {
        win.addEventListener('keydown', this.keyDown.bind(this), false);
        win.addEventListener('keyup', this.keyUp.bind(this), false);

    };

    /**
     * @description The Player update method.
     *
     * @param {Number} dt
     * @param {Number} lastTime
     */
    Player.prototype.update = function(dt, lastTime) {
        if (this.missiles.length > 0) {
            for (var i = this.missiles.length - 1; i >= 0; i--) {
                if (this.missiles[i].destroyed) {
                    this.missiles.splice(i, 1);
                    // console.log('missile deleted');
                } else if (this.missiles[i].currentPosition.y < 0) {
                    // Bullet has left the screen destroy it.
                    // console.log('should not see this with a hit');
                    this.missiles.splice(i, 1);
                } else {
                    this.missiles[i].update(dt);
                }
            }
        }
        var xmove = 0;
        if (this.keys[37]) {
            xmove = dt * 100 * 2 * -1;
            this.move = true;
        }
        if (this.keys[39]) {
            xmove = dt * 100 * 2;
            this.move = true;
        }
        if (this.keys[32]) {
            if (lastTime > this.fireTimer) {
                this.missiles.push(new app.Missile(this.currentPosition, 'player'));
                this.fireTimer = lastTime + this.fireSpacing;
            }
        }
        if (!this.move) {
            return;
        }
        this.currentPosition.x = this.currentPosition.x + xmove;
        if (this.currentPosition.x < 0) {
            this.currentPosition.x = 0;
        } else if ((this.currentPosition.x) > game.canvasSize.width - game.cellSize) {
            this.currentPosition.x = game.canvasSize.width - game.cellSize - 2;
        }
        // this.y = 50;
        this.move = false;
    };
    Player.prototype.render = function(ctx) {
        // console.log(this.currentPosition);
        app.Entity.prototype.render.call(this, ctx);
        if (this.missiles.length > 0) {
            for (var i = 0; i < this.missiles.length; i++) {
                this.missiles[i].render(ctx);
            }
        }
    };

    /**
     * Reset the player to a known state. Typically this will be executed after all enemies
     * have been destroyed.
     */
    Player.prototype.reset = function() {
        this.missiles = [];
    };

    app.Player = Player;
})();
