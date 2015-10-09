/*
 * The MIT License
 *
 * Copyright 2015 Jack Murphy <jmurphy.jr@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var app = app || {};

(function () {
    'use strict';

    function GreenEnemy(startingPosition) {
        app.Enemy.call(this, startingPosition, 'green');

        /**
         * All GreenEnemy's exist in the first row.
         * @type Arguments
         */
        this.setRow(1);
        this.scoreValue = 400;

        /**
         * Green enemies must be hit twice to be destroyed. After first
         * hit, green enemies turn blue.
         * @property greenHealthCounter
         * @type {Number}
         * @default 2
         */
        this.HealthCounter = 2;


    }

    GreenEnemy.prototype = Object.create(app.Enemy.prototype);
    GreenEnemy.prototype.constructor = GreenEnemy;

    // GreenEnemy.prototype.update = function() {
    //   this.currentPosition.x = 100;
    //   this.currentPosition.y = 400;
    // };

    /**
     * Set destroy to true on entity.
     * @method
     */
    GreenEnemy.prototype.setDestroy = function () {
        this.HealthCounter--;
        if (this.HealthCounter === 0) {
            this.destroyed = true;
        }
        else {
            this.sprite = this.sprites.blue;
        }
    };

    GreenEnemy.prototype.getPointValue = function () {
        if (this.destroyed) {
            return this.scoreValue;
        }
        else {
            return 0;
        }
    };

    GreenEnemy.prototype.reset = function () {
        this.destroyed = false;
        this.deleteMe = false;
        this.sprite = this.sprites[this.type];
        this.HealthCounter = 2;
        this.frameCounter = 0;
        this.state = 'SLIDE';
    };


    app.GreenEnemy = GreenEnemy;
}());
