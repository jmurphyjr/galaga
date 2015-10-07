var app = app || {};
(function() {
    'use strict';
    // Define enemy sprites and their attributes
    var states = {
        // attack the start point is currentPosition.
        attack: {
            //            controlPoints: {
            //                p1: new app.Point(70, -50),
            //                p2: new app.Point(0, 250),
            //                p3: new app.Point(140, 350),
            //                p4: new app.Point(140, 350),
            //                p5: new app.Point(500, 300),
            //                p6: new app.Point(100, 250)
            //            }
            controlPoints: {
                p1: new app.Point(70, -50),
                p2: new app.Point(0, 250),
                p3: new app.Point(140, 350),
                p4: new app.Point(140, 350),
                p5: new app.Point(500, 300),
                p6: new app.Point(100, 250)
            }
        }
    };

    var __nextObjId = 1;

    function objectId(obj) {
        if (obj === null) {
            return null;
        }
        if (obj.__objId === null) {
            obj.__objId = __nextObjId++;
        }
        return obj.__objId;

    }

    /**
     * @description Represents a Game Enemy
     * @param {Point} startingPosition
     * @param {string} type
     * @constructor
     */
    var Enemy = function(startingPosition, type) {
        
        this.sprites = {
        green: {
            image: 'images/galaga-green-enemy.png',
            size: {
                width: 160,
                height: 145
            },
            scale: 0.23
        },
        blue: {
            image: 'images/galaga-blue-enemy.png',
            size: {
                width: 160,
                height: 145
            },
            scale: 0.23
        },
        redblue: {
            image: 'images/galaga-red-blue-pink-enemy.png',
            size: {
                width: 160,
                height: 145
            },
            scale: 0.23
        },
        blueyellow: {
            image: 'images/galaga-blue-yellow-red-enemy.png',
            size: {
                width: 160,
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
            // frames: {
            //     0: {
            //         width: 7,
            //         height: 8,
            //         x: 2,
            //         y: 13
            //     },
            //     1: {
            //         width: 12,
            //         height: 13,
            //         x: 25,
            //         y: 11
            //     },
            //     2: {
            //         width: 16,
            //         height: 16,
            //         x: 47,
            //         y: 10
            //     },
            //     3: {
            //         width: 25,
            //         height: 25,
            //         x: 74,
            //         y: 5
            //     }
            // }
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
                }
            }
        }
    };

        
        
        
        /**
         * Enemies have all attributes of an Entity, plus
         */
        app.Entity.call(this, this.sprites[type], startingPosition, type);

        this.__objId = null;
        this.__objId = objectId(this);
        /**
         * The current state for this enemy. Available states are:
         *   - ENTER - The flyin movement for this enemy
         *   - SLIDE - Slides enemy left and right.
         *   - PULSE - Enemies move away from the center of the canvas
         *             then return to startingPosition
         *   - ATTACK - Enemy launches an attack.
         *   - DESTROY - Enemy has been hit and destroyed.
         * @property state
         * @type {string}
         * @default ENTER
         */
        this.state = 'SLIDE';
        this.offset = 0;
        /**
         * Movement direction for this enemy.
         * @property direction
         * @type {number}
         * @default +1 (Positive X (right) or Positive Y (down)
         */
        this.direction = +1;
        /**
         * @property attackStart
         * @type {boolean}
         * @default false
         */
        this.attackStart = false;
        /**
         * @property attackPoints Holds the Point objects for an enemy flight path during attack
         * @type {Array}
         */
        this.attackPoints = [];
        /**
         * @property {Array} attackAngles Holds the angles associated with the enemy flight path during attack
         * @type {Array}
         */
        this.attackAngles = [];
        /**
         * @description Tracks current location within the attackPoints and attackAngles arrays.
         * @property attackIndex
         * @type Array
         */
        this.attackIndex = 0;
        /**
         * @description Used to limit the movement.
         */
        this.attackTimer = 0;
        this.attackMovementSpacing = 20;
        /**
         * The row the enemy exists, within the Brigade.
         * @property row
         * @type {Number}
         */
        this.row = null;
        /**
         * The column the enemy exists, within the Brigade.
         * @property column
         * @type {Number}
         */
        this.column = null;
        this.pulseBoundary = this.column * 2 || 0;


        this.explosionTimer = 0;
        this.explosionDelay = 25;
        
        this.scoreValue = 200;
        
    };
    Enemy.prototype = Object.create(app.Entity.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.getPointValue = function() {
        return this.scoreValue;
    };
    
    Enemy.prototype.reset = function() {
        this.deleteMe = false;
        this.destroyed = false;
        this.sprite = this.sprites[this.type];
        this.frameCounter = 0;
        this.state = 'SLIDE';
        
    };
    
    Enemy.prototype.setRow = function(row) {
        this.row = row;
    };

    Enemy.prototype.setColumn = function(column) {
        this.column = column;
    };

    Enemy.prototype.setState = function(state) {
        this.state = 'PULSE';
    };

    /**
     * Set sprite image URL
     *
     * @param {string} sprite
     * @throws {error} If sprite is not string
     */
    Enemy.prototype.setSprite = function(sprite) {
        if (typeof sprite !== 'string') {
            throw new Error('sprite must be string type');
        }
        this.sprite = this.sprites[sprite];
    };


    /**
     * Update location of enemy object.
     * @method
     * @param {number} dt
     * @param {Number} lastTime description
     * @param {Point} refPoint description
     * @param {Number} xmove
     * @param {Number} ymove description
     * @param {Number} colOffset
     * @param {Number} rowOffset description
     */
    //    Enemy.prototype.update = function(dt, lastTime) {
    Enemy.prototype.update = function(dt, lastTime, refPoint, xmove, ymove, colOffset, rowOffset) {

        if (this.destroyed) {
            this.sprite = this.sprites.explosion;
            if (this.frameCounter === null) {
                this.frameCounter = 0;
                this.explosionTimer = lastTime + this.explosionDelay;
            } else {
                if (lastTime > this.explosionTimer) {
                    this.frameCounter++;
                    this.explosionTimer = lastTime + this.explosionDelay;
                }
            }

            if (this.frameCounter >= (Object.keys(this.sprite.frames).length - 1)) {
                console.log('Entity id: ' + this.__objId + '  frameCounter: ' + this.frameCounter);
                this.deleteMe = true;
            }
            // return;
        } else {
            // In the original game, the enemies would spread out
            var xMove = refPoint.x + this.column * colOffset;
            var yMove = refPoint.y + this.row * rowOffset;
            if (this.state === 'PULSE') {
                if (this.type === 'green' || this.type === 'blue') {
                    this._pulseEnemy(this);
                    if (Math.abs(this.startingPosition.x - this.currentPosition.x) > 20) {
                        this.direction *= -1;
                    }
                    xmove = dt * this.offset * this.speed * this.direction;
                    this.lastPosition = this.currentPosition;
                    this.currentPosition.x += xmove;
                }
            } else if (this.state === 'SLIDE') {
                this.currentPosition.x = xMove;
                this.currentPosition.y = yMove;
            } else if (this.state === 'ATTACK') {
                // attack causes the enemy to rise up, rotate either right or left depending
                // column, and continue to attack.
                if (this.attackStart) {
                    var points = calculateControlPoints('triangle', this.currentPosition);
                    this.attackStart = false;
                    console.log(states.attack);
                    this.attackPoints.pushArrayMembers(calculateBezierCurvePoints(points[0], points[1], points[2], points[3]));
                    this.attackAngles.pushArrayMembers(calculateBezierCurveAngles(points[0], points[1], points[2], points[3]));
                } else {
                    if (this.attackPoints.length !== 0) {
                        if (lastTime > this.attackTimer) {
                            this.currentPosition.x = this.attackPoints[this.attackIndex].x;
                            this.currentPosition.y = this.attackPoints[this.attackIndex].y;
                            this.attackIndex++;
                            if (this.attackIndex === this.attackPoints.length) {
                                this.attackPoints = [];
                                this.attackAngles = [];
                                this.attackIndex = 0;
                                this.state = 'SLIDE';
                            }
                            this.attackTimer = lastTime + this.attackMovementSpacing;
                        }
                    }
                }
            } else if (this.state === 'CIRCLE') {
                if (this.attackStart) {
                    this.attackStart = false;
                    var loop = calculateLoopPoints(this.currentPosition);
                    this.attackPoints.pushArrayMembers(loop[0]);
                    this.attackAngles.pushArrayMembers(loop[1]);
                    this.currentPosition.x = this.attackPoints[0].x;
                    this.currentPosition.y = this.attackPoints[0].y;
                    this.attackIndex++;
                } else
                if (this.attackPoints.length !== 0) {
                    if (lastTime > this.attackTimer) {
                        this.currentPosition.x = this.attackPoints[this.attackIndex].x;
                        this.currentPosition.y = this.attackPoints[this.attackIndex].y;
                        this.attackIndex++;
                        if (this.attackIndex === this.attackPoints.length) {
                            this.attackPoints = [];
                            this.attackAngles = [];
                            this.attackIndex = 0;
                            this.state = 'SLIDE';
                        }
                        this.attackTimer = 0; // lastTime + this.attackMovementSpacing;
                    }
                }
            }
        }
    };
    Enemy.prototype.render = function(ctx) {
        // console.log(this.currentPosition);
        if (this.destroyed) {
            renderDestroyed(this, ctx);
        } else if (this.state === 'ATTACK' && !this.attackStart) {
            ctx.translate(this.currentPosition.x, this.currentPosition.y);
            ctx.rotate(this.attackAngles[this.attackIndex]);
            ctx.drawImage(Resources.get(this.sprite.image), -((this.sprite.size.width * this.sprite.scale) / 2), -((this.sprite.size.height * this.sprite.scale) / 2), this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else if (this.state === 'CIRCLE' && !this.attackStart) {
            ctx.translate(this.currentPosition.x, this.currentPosition.y);
            ctx.rotate(this.attackAngles[this.attackIndex]);
            ctx.drawImage(Resources.get(this.sprite.image), -((this.sprite.size.width * this.sprite.scale) / 2), -((this.sprite.size.height * this.sprite.scale) / 2), this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            app.Entity.prototype.render.call(this, ctx);
        }
    };

    var renderDestroyed = function(enemy, ctx) {
        var frmCnt = enemy.frameCounter;
        var sp = enemy.sprite;
        var spF = sp.frames;
        var cp = enemy.currentPosition;
        console.log('Enemy: 323:  Entity id: ' + enemy.__objId + '  frameCounter: ' + enemy.frameCounter);
        ctx.drawImage(Resources.get(sp.image), spF[frmCnt].x, spF[frmCnt].y, spF[frmCnt].width, spF[frmCnt].height, cp.x, cp.y, spF[frmCnt].width, spF[frmCnt].height);
    };

    Enemy.prototype._pulseEnemy = function(enemy) {
        // console.log(enemy.type);
        switch (enemy.column) {
            case 1:
                {
                    enemy.speed = 1;
                    enemy.offset = 10;
                    break;
                }
            case 2:
                {
                    enemy.speed = 1;
                    enemy.offset = 8;
                    break;
                }
            case 3:
                {
                    enemy.speed = 1;
                    enemy.offset = 6;
                    break;
                }
            case 4:
                {
                    enemy.speed = 1;
                    enemy.offset = 4;
                    break;
                }
            case 5:
                {
                    enemy.speed = 1;
                    enemy.offset = 2;
                    break;
                }
            case 6:
                {
                    enemy.speed = 1;
                    enemy.offset = 2;
                    break;
                }
            case 7:
                {
                    enemy.speed = 1;
                    enemy.offset = 4;
                    break;
                }
            case 8:
                {
                    enemy.speed = 1;
                    enemy.offset = 6;
                    break;
                }
            case 9:
                {
                    enemy.speed = 1;
                    enemy.offset = 8;
                    break;
                }
            case 10:
                {
                    enemy.speed = 1;
                    enemy.offset = 10;
                    break;
                }
        }
    };
    app.Enemy = Enemy;
})();
