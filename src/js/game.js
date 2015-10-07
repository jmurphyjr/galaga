/**
 * Created by jack on 10/2/15.
 */

var app = app || {};

(function() {
    'use strict';

    function Game(global) {

        /**
         * The Root Element
         * @property root
         * @type Object
         */
        var _root = null;

        /**
         * The engine that will animate the game objects.
         * @property _engine
         * @type Engine
         */
        var _engine = null;

        /**
         * The maximum number of ACTIVE players on screen
         * @property maxPlayers
         * @type Number
         * @default 1
         */
        var maxPlayers = 1;

        /**
         * The player array
         * @property player
         * @type Array
         *
         */
        var _player = [];

        /**
         * The enemyManager object
         * @property enemyManager
         * @type Array
         */
        var enemyManager = {};


    }

    Game.prototype.init = function(global) {

        this.root = global;
        this._engine = new app.Engine(global);
        this._engine.setCanvasSize(500, 644);

        this.addPlayer();
        // this._engine.addEntity(this._player);
        this.enemyManager = new app.EnemyManager(500, 644);
        this.enemyManager.createEnemies();

        // this.player = new app.Player(new app.Point(250, 540), 'white');
        this._engine.addEntity(this.enemyManager);

        this.setCanvasBackground('images/space.png');
        this._engine.init();
    };

    Game.prototype.setCanvasBackground = function(bg) {
        this._engine.setSpriteImage(bg);
    };

    Game.prototype.addPlayer = function() {
        var pStartPos = new app.Point(this._engine.getCanvasSize()[0] / 2, this._engine.getCanvasSize()[1] * 0.85);
        this._player = new app.Player(pStartPos, 'white');
        this._player.init(this.root);
        this._engine.addPlayer(this._player);
    };

    app.Game = Game;
}(this));
