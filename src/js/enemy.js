var app = app || {};

(function() {
    'use strict';

    /**
     *
     * @param {String} sprite
     * @param {Array} startingPosition
     * @constructor
     */
    function Enemy(sprite, startingPosition) {
        this.sprite = sprite || '';
        this.startingPosition = startingPosition;
        this.x = startingPosition[0];
        this.y = startingPosition[1];
        this.speed = 0;
        this.direction = +1;
    }

    Enemy.prototype = {

        initialize: function() {
            this.sprite = '';
        },

        setSpriteImage: function(spriteFileName) {

            if (typeof spriteFileName !== 'string') {
                throw new Error('spriteFileName must be string type');
            }
            this.sprite = spriteFileName;
        },

        update: function(dt) {
            // In the original game, the enemies would spreadout
            var xmove = 0;
            var ymove = 0;

            if (this.x > (this.startingPosition[0] + 40)) {
                this.direction = -1;
            }
            else if (this.x < (this.startingPosition[0] - 40)) {

                this.direction = +1;
            }

            if (this.startingPosition[0] === 80 && this.startingPosition[1] === 100) {
                // First row of enemy, so move them in the +x direction, no y movement.

                if (this.x < (this.startingPosition[0] - 60)) {
                    xmove = dt * 30;
                    console.log('entity 1');
                }
                else if (this.x > (this.startingPosition[0] + 10)) {
                    xmove = dt * 30 * -1;
                    console.log('entity 2');
                }
            }
            // xmove = this.direction * 1 * 10 * dt;
            this.x += xmove;
            this.y += ymove;

        },

        render: function(ctx) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 120*0.3, 128*0.3);
        }

    };

    app.Enemy = Enemy;
})();

