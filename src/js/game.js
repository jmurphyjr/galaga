/**
 * Created by jack on 10/2/15.
 */
var app = app || {};

(function () {
    'use strict';

    /**
     * Game is setup in the following manner:
     *
     * G = Green Enemy
     * B = Blue Enemy
     * Y = Yellow Enemy
     * F = The Hero
     * S = Shields
     *
     *                              column
     *          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
     *
     *  Row 0      1UP               HIGH SCORE
     *
     *      1   ##########           ##########
     *
     *      2
     *
     *      3                        G  G  G  G
     *
     *      4                  B  B  B  B  B  B  B  B
     *
     *      5                  B  B  B  B  B  B  B  B
     *
     *      6            Y  Y  Y  Y  Y  Y  Y  Y  Y  Y  Y  Y
     *
     *      7            Y  Y  Y  Y  Y  Y  Y  Y  Y  Y  Y  Y
     *
     *      8
     *
     *      9
     *
     *     10
     *
     *     11
     *
     *     12                             F
     *
     *     13   F  F  F  F  F                            S  S  S  S  S
     *
     * @constructor
     */
    function Game() {

        /**
         * The Root Element
         * @property root
         * @type Object
         */
        this.root = null;

        /**
         * The engine that will animate the game objects.
         * @property _engine
         * @type Engine
         */
        this.engine = null;

        /**
         * The maximum number of ACTIVE players on screen
         * @property maxPlayers
         * @type Number
         * @default 1
         */
        this.maxPlayers = 1;

        /**
         * The player array
         * @property player
         * @type Array
         *
         */
        this.player = [];

        /**
         * The enemyManager object
         * @property enemyManager
         * @type Array
         */
        this.enemyManager = {};

        /**
         * The Game Canvas Dimensions, evenly divisible by 40.
         * @property canvasSize
         * @type {{width: number, height: number}}
         */
        this.canvasSize = {
            width: 640,
            height: 760
        };

        this.cellSize = 40;

        /**
         * Maximum number of Rows (divide canvas height by 40)
         * @property maxRows
         * @type {number}
         */
        this.maxRows = this.canvasSize.height / this.cellSize;

        /**
         * Maximum number of Columns (divide canvas width by 40)
         * @property maxColumns
         * @type {number}
         */
        this.maxColumns = this.canvasSize.width / this.cellSize;
        console.log('Max Rows: ' + this.maxRows + ' Columns: ' + this.maxColumns);

        this.gameTimer = 0;
        this.gameMenuDelay = 5000;
    }

    Game.prototype.init = function (global) {

        this.root = global;
        this.engine = new app.Engine(this.root);

        this.addPlayer();
        this.enemyManager = new app.EnemyManager();
        // this.enemyManager.createEnemies();
        this.enemyManager.start();

        this.engine.addEntity(this.enemyManager);

        this.setCanvasBackground('images/space.png');
        this.engine.init();
    };

    Game.prototype.setCanvasBackground = function (bg) {
        this.engine.setSpriteImage(bg);
    };

    Game.prototype.addPlayer = function () {
        var canvasSize = this.getCanvasSize();
        var pStartPos = new app.Point(canvasSize.width / 2, canvasSize.height * 0.85);
        this.player = new app.Player(pStartPos, 'white');
        this.player.init(this.root);
        this.engine.addPlayer(this.player);
    };

    Game.prototype.getCanvasSize = function() {
        return this.canvasSize;
    };

    Game.prototype.reset = function() {
        this.enemyManager.forEach(function(e) {
            e.reset();
        })
    };

    Game.prototype.showStartScreen = function() {

    };

    app.Game = Game;
}(this));
