var app = app || {};

(function() {
    'use strict';

    var MISSILE_TIMER = 0;
    var MISSILE_SPEED = 300;
    var MISSILE_SPACING = 250;


    function Player(sprite, startingPosition) {
        this.sprite = sprite || '';
        this.startingPosition = startingPosition;
        this.x = startingPosition[0];
        this.y = startingPosition[1];
        this.speed = 0;
        this.direction = +1;
        this.move = false;
        this.keys = [];
        this.missiles = [];
    }

    Player.prototype = {

        update: function(dt, lastTime) {

            if (this.missiles.length > 0) {
                for (var i = 0; i < this.missiles.length; i++) {
                    if (this.missiles[i].y < 0) {
                        // Bullet has left the screen destroy it.
                        this.missiles.splice(i, 1);
                    }
                    else {
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
                if (lastTime > MISSILE_TIMER) {
                    this.missiles.push(new Missile([this.x, this.y]));
                    MISSILE_TIMER = lastTime + MISSILE_SPACING;
                }
            }


            if (!player.move) {
                return;
            }

            this.x = this.x + xmove;
            if (this.x < 40) {
                this.x = 40;
            }
            else if (this.x > 520) {
                this.x = 520;
            }
            // this.y = 50;
            this.move = false;


        },

        render: function(ctx) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 120*0.3, 128*0.3);
            if (this.missiles.length > 0) {
                for (var i = 0; i < this.missiles.length; i++) {
                    this.missiles[i].render(ctx);
                }
            }
        }


    };

    function Missile(playerLocation) {
        this.sprite = 'images/galaga-bullet.png';
        this.x = playerLocation[0];
        this.y = playerLocation[1];
    }

    Missile.prototype = {
        update: function(dt) {
            var ymove = dt  * MISSILE_SPEED * -1;
            this.y += ymove;
        },

        render: function(ctx) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 26*0.25, 50 *0.25);
        }
    };

    app.Player = Player
})();