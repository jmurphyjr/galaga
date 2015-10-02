/**
 * Created by jack on 10/2/15.
 */

var app = app || {};

(function() {
    'use strict';

    function Game() {

        /**
         * The maximum number of green enemies active in the game.
         * @property greenEnemies
         * @type Number
         * @default 10
         */
        this.maxGreenEnemies = 10;

        /**
         * Green enemies must be hit twice to be destroyed. After first
         * hit, green enemies turn blue.
         * @property greenEnemiesHP
         * @type {number}
         * @default 2
         */
        this.greenEnemiesHP = 2;

        /**
         * The maximum number of blue enemies active in the game.
         * @property blueEnemies
         * @type Number
         * @default 20
         */
        this.maxBlueEnemies = 20;

        /**
         * The maximum number of yellow enemies active in the game.
         * @property yellowEnemies
         * @type Number
         * @default 20
         */
        this.maxYellowEnemies = 20;

        /**
         * The maximum number of ACTIVE players on screen
         * @property maxPlayers
         * @type Number
         * @default 2
         */
        this.maxPlayers = 2;
    }
}());
