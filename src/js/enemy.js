var app = app || {};

(function() {
    'use strict';

    // Define enemy sprites and their attributes
    var sprites = {
        green: {
            image: 'images/galaga-green-enemy.png',
            size: { width: 160, height: 145 },
            scale: 0.23
        },
        blue: {
            image: 'images/galaga-blue-enemy.png',
            size: { width: 160, height: 145 },
            scale: 0.23
        },
        redblue: {
            image: 'images/galaga-red-blue-pink-enemy.png',
            size: { width: 160, height: 145 },
            scale: 0.23
        },
        blueyellow: {
            image: 'images/galaga-blue-yellow-red-enemy.png',
            size: { width: 160, height: 145 },
            scale: 0.23
        }
    };

    var states = {
        // attack the start point is currentPosition.
        attack: {
            controlPoints: {
                p1: new app.Point(70, -50),
                p2: new app.Point(0, 250),
                p3: new app.Point(140, 350)
            }
        }
    };

    /**
     * @description Represents a Game Enemey
     * @param {Point} startingPosition
     * @param {string} sprite
     * @constructor
     */
    var Enemy = function(startingPosition, type) {
        app.Entity.call(this, sprites[type], startingPosition, type);

        this.state = 'SLIDE';

        this.offset = 0;
        // Enemies are evenly spaced apart finding which column
        // the enemy exists in
        this.column = ((this.startingPosition.x - 80) / 30) + 1;

        // Initial direction is set the same for all entities.
        this.direction = +1;

        // Attack related variables
        this.attackStart = false;
        this.attackPoints = [];
        this.attackAngles = [];
        this.attackIndex = 0;
        this.attackTimer = 0;
        this.attackMovementSpacing = 20;

    };

    Enemy.prototype = Object.create(app.Entity.prototype);
    Enemy.prototype.constructor = Enemy;

    /**
     * Update location of enemy object.
     * @param {number} dt
     */
    Enemy.prototype.update = function(dt, lastTime) {
        // In the original game, the enemies would spread out
        var xmove = 0;
        var ymove = 0;

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
        }
        else if (this.state === 'SLIDE') {
            // slide moves all enemies side to side at constant rate and step size.
            if (this.direction === 1 && (this.currentPosition.x - this.startingPosition.x) > 40) {
                this.direction = -1;
            }
            else if (this.direction === -1 && (this.startingPosition.x - this.currentPosition.x) > 40) {
                this.direction = +1;
            }
            xmove = dt * 10 * this.direction;
            this.currentPosition.x += xmove;
        }
        else if (this.state === 'ATTACK') {
            // attack causes the enemy to rise up, rotate either right or left depending
            // column, and continue to attack.
            if (this.attackStart) {
                // this.currentPosition.y -= dt * 20;
                this.attackStart = false;
                console.log(states.attack);

                // this.attackPoints = calculateBezierCurvePoints(this.currentPosition,states.attack.controlPoints.p1,states.attack.controlPoints.p2,states.attack.controlPoints.p3);
                for (var i = 0; i < 1; i += 0.01) {
                    this.attackPoints.push(bezierPoint(this.currentPosition, states.attack.controlPoints.p1,states.attack.controlPoints.p2,states.attack.controlPoints.p3, i));
                    this.attackAngles.push(bezierTangent(this.currentPosition, states.attack.controlPoints.p1,states.attack.controlPoints.p2,states.attack.controlPoints.p3, i));
                }
            }
            else {
                if (this.attackPoints.length != 0) {
                    if (lastTime > this.attackTimer) {
                        this.currentPosition.x = this.attackPoints[this.attackIndex].x;
                        this.currentPosition.y = this.attackPoints[this.attackIndex].y;
                        this.spriteFrame = this.attackAngles[this.attackIndex];
                        this.attackIndex++;
                        if (this.attackIndex === this.attackPoints.length) {
                            this.attackPoints = [];
                            this.attackAngles = [];
                            this.attackIndex = 0;
                            this.state = 'SLIDE';
                            this.currentPosition.x = this.startingPosition.x;
                            this.currentPosition.y = this.startingPosition.y;
                        }
                        this.attackTimer = lastTime + this.attackMovementSpacing;
                    }
                }
            }
        }

    };

    Enemy.prototype.render = function(ctx) {
        // console.log(this.currentPosition);
        if (this.state === 'ATTACK' && !this.attackStart) {
            // app.Entity.prototype.render.call(this, ctx);
            // ctx.save();
            // ctx.translate(this.currentPosition.x + (this.sprite.size.width / 2), this.currentPosition.y + (this.sprite.size.height / 2));
            ctx.translate(this.currentPosition.x, this.currentPosition.y);
            ctx.rotate(this.attackAngles[this.attackIndex]);
            ctx.drawImage(Resources.get(this.sprite.image), -((this.sprite.size.width * this.sprite.scale) / 2), -((this.sprite.size.height * this.sprite.scale) / 2), this.sprite.size.width * this.sprite.scale, this.sprite.size.height * this.sprite.scale);
            ctx.setTransform(1, 0, 0, 1, 0 ,0);
            // ctx.restore();
        }
        else {
            app.Entity.prototype.render.call(this, ctx);
        }
    };


    Enemy.prototype._pulseEnemy = function(enemy) {
        // console.log(enemy.type);
        switch (enemy.column) {
            case 1:
                enemy.speed = 1;
                enemy.offset = 10;
                break;
            case 2:
                enemy.speed = 1;
                enemy.offset = 8;
                break;
            case 3:
                enemy.speed = 1;
                enemy.offset = 6;
                break;
            case 4:
                enemy.speed = 1;
                enemy.offset = 4;
                break;
            case 5:
                enemy.speed = 1;
                enemy.offset = 2;
                break;
            case 6:
                enemy.speed = 1;
                enemy.offset = 2;
                break;
            case 7:
                enemy.speed = 1;
                enemy.offset = 4;
                break;
            case 8:
                enemy.speed = 1;
                enemy.offset = 6;
                break;
            case 9:
                enemy.speed = 1;
                enemy.offset = 8;
                break;
            case 10:
                enemy.speed = 1;
                enemy.offset = 10;
                break;
        }

    };


    app.Enemy = Enemy;
})();

