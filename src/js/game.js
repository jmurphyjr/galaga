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

        var self = this;

        /**
         * The Root Element
         * @property root
         * @type Object
         */
        this.root = null;

        var win = null;

        /**
         * The player array
         * @property player
         * @type Array
         *
         */
        this.player = null;

        this.missiles = [];

        this.stage = 1;

        var highScore = 0;

        /**
         * @description Firebase URL
         * @private
         * @type {string}
         */
        var firebaseURL = 'https://galaga.firebaseio.com/highscore';
        var hsRef = new Firebase(firebaseURL);

        // Creates a callback on the highscore element with Firebase
        // When the data updates in the database, an update is read.
        hsRef.on('value', function(snapshot) {
            console.log(snapshot.val());
            highScore = snapshot.val();

        }, function(errorObject) {
            console.log('The read failed: ' + errorObject.code);
        });

        /**
         * @description Sets the highscore on the firebase database.
         * @param updated
         * @private
         * @method
         */
        function setHighScore(updated) {
            hsRef.set(
                self.player.score
            );
        }

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

        var dt = 0;
        var lastTime = Date.now();

        var running = true;

        var entities = [];

        var doc = null;
        var f = null;
        var canvas = null;
        var ctx = null;

        this.startPlay = function () {
            running = true;
            main();
        };

        function screenDefault() {
            ctx.font = '900 24px Arial';
            ctx.fillStyle = 'red';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(Resources.get('images/space-larger.png'), 0, 0);
            // ctx.rect(0,0, canvas.width, canvas.height);
            ctx.textAlign = 'center';
            ctx.fillText('1UP', 40, 25);
            ctx.fillText('HIGH SCORE', ((canvas.width / 2)), 25);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(self.player.score.toString(), 40, 50);
            ctx.fillText(highScore.toString(), ((canvas.width / 2)), 50);
        }

        this.showSplashScreen = function(which) {
            console.log('which = ' + which);
            if (which === 'start') {
                doc.getElementById('gameboard').appendChild(canvas);
                screenDefault();

                ctx.fillStyle = 'red';
                ctx.fillText('Press \'p\' to play', canvas.width / 2, canvas.height * 0.40);
            }
            else if (which === 'stage') {
                screenDefault();
                ctx.fillStyle = 'red';
                ctx.fillText('Stage ' + game.stage, canvas.width / 2, canvas.height * 0.40);
            }
        };

        /**
         *  The update function for the entire game. Will drive updating the entire canvas.
         * @param dt
         * @param lastTime
         * @private
         */
        function update(dt, lastTime) {
            updateEntities(dt, lastTime);
            if (self.player.score > highScore) {
                highScore = self.player.score;
                setHighScore(highScore);
            }
        }

        /**
         * Update function specific to updating all game entities
         * @param dt
         * @param lastTime
         * @private
         */
        function updateEntities(dt, lastTime) {
            self.player.update(dt, lastTime);
            if (self.missiles.length > 0) {
                for (var i = self.missiles.length - 1; i >= 0; i--) {
                    var m = self.missiles[i];
                    if (m.destroyed) {
                        self.missiles.splice(i, 1);
                    }
                    else if (m.currentPosition.y < 0) {
                        self.missiles.splice(i, 1);
                    }
                    else {
                        m.update(dt, lastTime);
                    }
                }
            }
            // if (entities[i].current !== 'destroyed') {
            //     collisionDetection(entities[i]);
            // }
            collissionDetection();
            self.enemyManager.update(dt, lastTime);
        }

        function collissionDetection() {
            var e = self.enemyManager.enemies;
            var p = self.player;
            // Check enemy collission with player

            // Check enemy collission with player missiles

            // Check enemy collission with player missiles
            self.missiles.forEach(function (m) {
                if (m.owner === 'player') {
                    for (var i = e.length - 1; i >= 0; i--) {

                        if (m.currentPosition.x < e[i].currentPosition.x + e[i].rect.width &&
                            m.currentPosition.x + m.rect.width > e[i].currentPosition.x &&
                            m.currentPosition.y < e[i].currentPosition.y + e[i].rect.height - 10 &&
                            m.currentPosition.y + m.rect.height > e[i].currentPosition.y) {
                            console.log('player missile collided with enemy');
                            if (e[i].isAlive()) {
                                e[i].killed();
                            }
                            m.setDestroy();
                            self.player.score += e[i].getPointValue();
                        }
                    }
                }
                else if (m.owner === 'enemy') {
                    if (m.currentPosition.x < p.currentPosition.x + p.rect.width &&
                        m.currentPosition.x + m.rect.width > p.currentPosition.x &&
                        m.currentPosition.y < p.currentPosition.y + p.rect.height - 10 &&
                        m.currentPosition.y + m.rect.height > p.currentPosition.y) {
                        console.log('enemy missile collided with player');
                        p.setDestroy();
                        m.setDestroy();
                    }
                }

            });
            self.enemyManager.enemies.forEach(function checkColission(e) {


            })
        }

        /**
         * The single render function.
         */
        function render() {
            screenDefault();
            ctx.textAlign = 'center';

            if (gameState.current === 'menu') {
                ctx.fillStyle = 'red';
                ctx.fillText('Press \'p\' to play', canvas.width / 2, canvas.height * 0.40);
            }
            else {
                self.enemyManager.render(ctx);
                self.player.render(ctx);
                if (self.missiles.length > 0) {
                    self.missiles.forEach(function updateMissiles(m) {
                        m.render(ctx);
                    });

                }
            }
        }


        /**
         * The main function to run the game
         *
         * @describe
         */
        function main() {
            if (!running) {
                return;
            }
            var now = Date.now();
            dt = (now - lastTime) / 1000.0;
            if (self.gameTimer === 0 && gameState.current === 'start') {
                self.gameTimer = now + self.gameMenuDelay;

            }
            else if (now > game.gameTimer && gameState.current === 'start') {
                // gameState.play();
                self.enemyManager.launch();
                gameState.activate();
                self.gameTimer = 0;
            }
            update(dt, lastTime);
            render(ctx);
            lastTime = now;
            f.innerHTML = 'Frames / second: ' + fps.getFPS();
            win.requestAnimationFrame(main);
        }

        this.initialize = function () {
            win = this.root.window;
            doc = this.root.document;
            f = doc.querySelector("#framespersecond");
            canvas = doc.createElement('canvas');
            canvas.width = this.canvasSize.width;
            canvas.height = this.canvasSize.height;
            ctx = canvas.getContext('2d');
            running = false;
            lastTime = Date.now();
            dt = 0;
            entities = [];
            var pStartPos = new app.Point(canvas.width / 2, canvas.height * 0.85);
            this.player = new app.Player(pStartPos, 'white');
            this.player.init(win);
            // getHighScore();

        };

        /**
         * Reset game state to begin next Stage.
         *
         * @param callback
         */
        this.reset = function (callback) {
            self.enemyManager.enemies.forEach(function (e) {
                e.reset();
            });
            this.enemyManager.reset();
            this.missiles = [];
            running = false;
            callback();
        };



    }

    Game.prototype.init = function (global) {
        // Set the root element for use throughout the rest of the
        // game.
        this.root = global;

        // Initialize some default general parameters valid across all functions of the game.
        this.initialize();
        // this.addPlayer();
        this.enemyManager = new app.EnemyManager();

        // Change enemyManager to the 'create' state.
        this.enemyManager.start();
    };

    Game.prototype.setCanvasBackground = function (bg) {
        // this.engine.setSpriteImage(bg);
    };

    Game.prototype.addPlayer = function () {
        var canvasSize = this.getCanvasSize();
        var pStartPos = new app.Point(canvasSize.width / 2, canvasSize.height * 0.85);
        // player = new app.Player(pStartPos, 'white');
        // this.player.init(this.root);
        // this.engine.addPlayer(this.player);
    };

    Game.prototype.getCanvasSize = function () {
        return this.canvasSize;
    };

    Game.prototype.fireMissile = function (who) {
        this.missiles.push(new app.Missile(this.player.currentPosition, who));
        console.log('fired missile');
    };

    /**
     * Displays the start screen.
     */
    Game.prototype.showStartScreen = function () {
        this.startScreen();
    };

    app.Game = Game;
}(this));
