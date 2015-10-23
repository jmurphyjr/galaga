var app = app || {};
(function () {
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
        },
        explosion: {
            image: 'images/explosion-sprite.png',
            size: {
                width: 146,
                height: 36
            },
            scale: 1,
            frames: {
                0: {
                    width: 48,
                    height: 49,
                    x: 167,
                    y: 38
                },
                1: {
                    width: 50,
                    height: 48,
                    x: 293,
                    y: 42
                },
                2: {
                    width: 58,
                    height: 54,
                    x: 416,
                    y: 40
                },
                3: {
                    width: 66,
                    height: 61,
                    x: 28,
                    y: 166
                },
                4: {
                    width: 70,
                    height: 66,
                    x: 155,
                    y: 165
                },
                5: {
                    width: 66,
                    height: 63,
                    x: 284,
                    y: 165
                },
                6: {
                    width: 67,
                    height: 69,
                    x: 412,
                    y: 162
                },
                7: {
                    width: 72,
                    height: 73,
                    x: 26,
                    y: 289
                },
                8: {
                    width: 77,
                    height: 77,
                    x: 151,
                    y: 287
                },
                9: {
                    width: 83,
                    height: 80,
                    x: 276,
                    y: 287
                },
                10: {
                    width: 80,
                    height: 84,
                    x: 406,
                    y: 285
                }
            }
        }
    };
    /**
     * @description Represents a player
     * @param {object} startingPosition x and y location for starting position
     * @param {string} type Identifies the type
     * @constructor
     */
    var Player = function (startingPosition, type) {
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

        this.keys = [];
        this.move = false;
        this.score = 0;
        this.bonuses = {
            20000: false,
            70000: false,
            140000: false,
            210000: false,
            280000: false,
            350000: false,
            420000: false,
            490000: false,
            560000: false,
            630000: false,
            700000: false,
            770000: false,
            840000: false,
            910000: false,
            980000: false,
            1050000: false,
            1120000: false,
            1190000: false,
            1260000: false,
            1330000: false
        };

        this.explosionTimer = 0;
        this.explosionDelay = 20;
    };

    Player.prototype = Object.create(app.Entity.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.keyDown = function (evt) {
        // console.log(evt);
        this.keys[evt.keyCode] = true;
    };

    Player.prototype.keyUp = function (evt) {
        // console.log(evt);
        this.keys[evt.keyCode] = false;
    };

    /**
     * @description Sets up event listeners for keyup and keydown actions.
     * @param win
     */
    Player.prototype.init = function (win) {
        win.addEventListener('keydown', this.keyDown.bind(this), false);
        win.addEventListener('keyup', this.keyUp.bind(this), false);

    };

    /**
     * @description Checks if the player has earned a new life based on score.
     */
    Player.prototype.checkBonus = function() {

        for (var level in this.bonuses) {
            if (this.score >= level && !this.bonuses[level]) {
                this.lives += 1;
                this.bonuses[level] = true;
            }
        }
    };

    /**
     * @description The Player update method.
     *
     * @param {Number} dt
     * @param {Number} lastTime
     */
    Player.prototype.update = function (dt, lastTime) {
        this.checkBonus();
        if (this.destroyed) {
            // this.sprite = this.sprites.explosion;
            if (this.frameCounter === null) {
                this.frameCounter = 0;
                this.explosionTimer = lastTime + this.explosionDelay;
            }
            else {
                if (lastTime > this.explosionTimer) {
                    this.frameCounter++;
                    this.explosionTimer = lastTime + this.explosionDelay;
                }
            }

            if (this.frameCounter >= (Object.keys(this.sprite.frames).length - 1)) {
                // console.log('Entity id: ' + this.__objId + '  frameCounter: ' + this.frameCounter);
                if (this.destroyed && this.current === 'destroyed') {
                    this.next();
                }
            }
        }
        else {
            var xmove = 0;
            if (this.keys[37]) {
                xmove = dt * 100 * 2 * -1;
                this.move = true;
            }
            if (this.keys[39]) {
                xmove = dt * 100 * 2;
                this.move = true;
            }
            if (!this.move) {
                return;
            }
            this.currentPosition.x = this.currentPosition.x + xmove;
            if (this.currentPosition.x < 0) {
                this.currentPosition.x = 0;
            }
            else if ((this.currentPosition.x) > game.canvasSize.width - game.cellSize) {
                this.currentPosition.x = game.canvasSize.width - game.cellSize - 2;
            }
            // this.y = 50;
            this.move = false;
        }
    };

    Player.prototype.render = function (ctx) {
        // console.log(this.currentPosition);
        if (this.destroyed) {

            renderDestroyed(this, ctx);
        }
        else {
            app.Entity.prototype.render.call(this, ctx);
        }
    };

    var renderDestroyed = function (p, ctx) {
        var frmCnt = p.frameCounter;
        var sp = p.sprite;
        var spF = sp.frames;
        var cp = p.currentPosition;
        // console.log('Enemy: 323:  Entity id: ' + enemy.__objId + '  frameCounter: ' + enemy.frameCounter);
        if (spF === undefined) {
            // The frameCounter was incremented so need to go back a step
            p.frameCounter--;
            app.Entity.prototype.render.call(p, ctx);
        }
        else {
            ctx.drawImage(Resources.get(sp.image), spF[frmCnt].x, spF[frmCnt].y, spF[frmCnt].width, spF[frmCnt].height, cp.x, cp.y, spF[frmCnt].width, spF[frmCnt].height);
        }
    };


    Player.prototype.lives = 3;

    /**
     * Reset the player to a known state. Typically this will be executed after all enemies
     * have been destroyed.
     */
    Player.prototype.reset = function () {
        this.currentPosition.copy(this.startingPosition);
    };

    Player.prototype.onkilled = function () {
        this.setDestroy();
        this.sprite = sprites.explosion;
        this.frameCounter = 0;
        game.missiles = [];
    };

    Player.prototype.onnext = function () {
        this.lives--;
        this.sprite = sprites.white;
        this.currentPosition = this.startingPosition.clone();
        this.destroyed = false;
    };

    app.Player = Player;
})();

StateMachine.create({
    target: app.Player.prototype,
    initial: 'alive',
    events: [
        { name: 'killed', from: 'alive', to: 'destroyed' },
        { name: 'next', from: 'destroyed', to: 'alive' },
        { name: 'restart', from: 'destroyed', to: 'alive' }
    ]
});
