/**
 * Created by jack on 9/30/15.
 */
var app = app || {};

(function() {
    'use strict';

    var sprites = {
        missile: {
            image: 'images/galaga-bullet.png',
            size: { width: 26, height: 50 },
            scale: 0.25
        }
    };

    var MISSILE_SPEED = 300;
    var MISSILE_SPACING = 250;

    function Missile(playerLocation) {
        app.Entity.call(this, sprites.missile, new app.Point(playerLocation.x + 15, playerLocation.y), 'missile');
        // this.startingPosition = new app.Point(playerLocation.x + 15, playerLocation.y);
        // console.log(this.startingPosition);
    }

    Missile.prototype = Object.create(app.Entity.prototype);
    Missile.prototype.constructor = Missile;

    Missile.prototype.update = function(dt) {
        this.currentPosition.y += dt  * MISSILE_SPEED * -1;
    };

    // Missile.prototype.render = function(ctx) {
    //     ctx.drawImage(Resources.get(this.sprite), this.currentPosition.x, this.currentPosition.y, 26 * 0.25, 50 * 0.25);
    // };

    app.Missile = Missile;

})();
