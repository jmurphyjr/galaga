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
    function Game(global) {

        var self = this;

        var loadEntities = function () {
            self.startup(self);

        };

        Resources.load([
            'images/space.png',
            'images/space-larger.png',
            'images/galaga-red-fighter.png',
            'images/galaga-white-fighter.png',
            'images/galaga-red-blue-pink-enemy.png',
            'images/galaga-blue-yellow-red-enemy.png',
            'images/galaga-blue-enemy.png',
            'images/galaga-green-enemy.png',
            'images/galaga-bullet.png',
            'images/galaga-enemy-explosion.png',
            'images/explosion-sprite.png'
        ]);
        Resources.onReady(loadEntities);

        /**
         * The Root Element
         * @property root
         * @type Object
         */
        this.root = global;

        var win = null;

        /**
         * The player array
         * @property player
         * @type Array
         *
         */
        this.player = null;

        this.playerShots = 0;
        this.enemiesKilled = 0;

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

        this.gameTimer = 0;
        this.gameMenuDelay = 5000;

        // Menu Timers
        this.introTimer = 0;     // Will wait 4000 msecs
        this.startTimerOne = 0;  // Will wait 2000 msecs
        this.startTimerTwo = 0;  // Will wait 2000 msecs
        this.summaryTimer = 0;   // Will wait 4000 msecs

        var dt = 0;
        var lastTime = Date.now();

        var running = true;

        var entities = [];

        var doc = null;
        var f = null;
        var canvas = null;
        var ctx = null;

        var whichScreen = 'start';

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

        /**
         *  The update function for the entire game. Will drive updating the entire canvas.
         * @param dt
         * @param lastTime
         * @private
         */
        function update(dt, lastTime) {
            if (self.current !== 'intro' && self.current !== 'none' && self.current !== 'summary') {
                updateEntities(dt, lastTime);
            }
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
                            if (e[i].isAlive()) {
                                e[i].killed();
                                self.enemiesKilled += 1;
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
                        // console.log('enemy missile collided with player');
                        p.setDestroy();
                        m.setDestroy();
                    }
                }

            });
        }

        function addPlayerLives() {
            for (var i = 0; i < self.player.lives - 1; i++) {
                ctx.drawImage(Resources.get('images/galaga-white-fighter.png'), ((i * 40) + 25), canvas.height - 50, 138 * 0.23, 145 * 0.23);
            }
        }

        /**
         * The single render function.
         */
        function render(lastTime) {
            screenDefault();
            ctx.textAlign = 'center';

            if (self.current === 'intro') {
                ctx.fillStyle = 'cyan';
                ctx.fillText('GALAGA', canvas.width / 2, canvas.height * 0.12);
                ctx.fillText('PUSH \'P\' TO START', canvas.width / 2, canvas.height * 0.30);
                ctx.drawImage(Resources.get('images/galaga-white-fighter.png'), canvas.width * 0.16, canvas.height * 0.37, 138 * 0.23, 145 * 0.23);
                ctx.fillStyle = 'yellow';
                ctx.fillText('1ST BONUS FOR 20000 PTS', canvas.width / 2, canvas.height * 0.405);

                ctx.drawImage(Resources.get('images/galaga-white-fighter.png'), canvas.width * 0.16, canvas.height * 0.44, 138 * 0.23, 145 * 0.23);
                ctx.fillStyle = 'yellow';
                ctx.fillText('2ND BONUS FOR 70000 PTS', canvas.width / 2, canvas.height * 0.475);

                ctx.drawImage(Resources.get('images/galaga-white-fighter.png'), canvas.width * 0.16, canvas.height * 0.51, 138 * 0.23, 145 * 0.23);
                ctx.fillStyle = 'yellow';
                ctx.fillText('AND FOR EVERY 70000 PTS', canvas.width / 2, canvas.height * 0.545);

                var c = 169; // 0xA9
                ctx.fillText(String.fromCharCode(c) + ' 1981 NAMCO LTD.', canvas.width / 2, canvas.height * 0.65);

            }
            else if (self.current === 'start') {
                ctx.fillStyle = 'red';
                ctx.fillText('STAGE ' + game.stage, canvas.width / 2, canvas.height * 0.40);

                if (lastTime > self.startTimerOne) {
                    ctx.fillStyle = 'red';
                    ctx.fillText('PLAYER 1', canvas.width / 2, canvas.height * 0.44);
                }
            }
            else if (self.current === 'summary') {
                ctx.fillStyle = 'red';
                ctx.fillText('SHOTS FIRED: ' + self.playerShots, canvas.width / 2 + 25, canvas.height * 0.44);
                ctx.fillText('ENEMIES KILLED: ' + self.enemiesKilled, canvas.width / 2, canvas.height * 0.48);
            }
            else if (self.current === 'active') {
                self.enemyManager.render(ctx);
                self.player.render(ctx);
                if (self.missiles.length > 0) {
                    self.missiles.forEach(function updateMissiles(m) {
                        m.render(ctx);
                    });

                }
                addPlayerLives();
            }
            else if (self.current === 'over') {
                ctx.fillStyle = 'red';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height * 0.30);
                ctx.fillStyle = 'cyan';
                ctx.fillText('PRESS \'R\' TO RESTART', canvas.width / 2, canvas.height * 0.50);
            }
        }

        function handleInput(key) {
            switch (key) {
                case 'startGame':
                {
                    if (self.current === 'intro') {
                        self.stageIntro();
                    }
                    break;
                }
                case 'space':
                {
                    if (self.current === 'active') {
                        // while in 'playing' state space bar is firing a player missile
                        self.fireMissile('player');
                        self.playerShots += 1;
                    }
                    break;
                }
                case 'tryAgain':
                {
                    if (self.current === 'over') {
                        self.tryagain();
                    }
                }
            }
        }

        var timerOneDone = false;

        /**
         * The main function to run the game
         *
         * @describe
         */
        function main() {
            if (!running) {
                return;
            }

            if (self.player.lives === 0 && self.current !== 'over') {
                self.gameOver();
            }

            var now = Date.now();
            dt = (now - lastTime) / 1000.0;

            if (self.current === 'intro') {
                if (lastTime > self.introTimer) {
                    self.startTimerOne = lastTime + 2000;
                    self.stageIntro();
                }

            }
            else if (self.current === 'start') {
                if (lastTime > self.startTimerOne) {
                    if (!timerOneDone) {
                        self.startTimerTwo = lastTime + 2000;
                        timerOneDone = true;
                    }
                    else if (lastTime > self.startTimerTwo) {
                        self.startStage();
                        timerOneDone = false;
                    }
                }
            }
            else if (self.current === 'summary') {
                if (lastTime > self.summaryTimer) {
                    self.stageIntro();
                }
            }
            else if (self.current === 'activate') {
                self.enemyManager.launch();
                self.play();
            }
            else if (self.current === 'active') {
                // How many enemies are left?
                var remaining = self.enemyManager.enemiesLeft();
                if (remaining.length === 0) {
                    // console.log('in active state, zero enemies are left, levelComplete');
                    self.levelComplete();
                }
            }
            update(dt, lastTime);
            render(lastTime);
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
            lastTime = Date.now();
            dt = 0;
            entities = [];
            var pStartPos = new app.Point(canvas.width / 2, canvas.height * 0.85);
            this.player = new app.Player(pStartPos, 'white');
            this.player.init(win);
            doc.getElementById('gameboard').appendChild(canvas);
            doc.addEventListener('keydown', function(e) {
                // console.log(e.keyCode);
                var allowedKeys = {
                    32: 'space',
                    37: 'left',
                    38: 'up',
                    39: 'right',
                    40: 'down',
                    80: 'startGame',
                    82: 'tryAgain'
                };

                handleInput(allowedKeys[e.keyCode]);
            });

            running = true;
            main();
        };

        /**
         * Reset game state to begin next Stage.
         *
         * @param callback
         * @method
         * @privileged
         */
        this.reset = function(callback) {
            self.missiles = [];
            self.playerShots = 0;
            self.enemiesKilled = 0;
            // console.log(callback);
            callback();
        };
    }

    Game.prototype.init = function (global) {
        // Set the root element for use throughout the rest of the
        // game.
        this.root = global;

        // Initialize some default general parameters valid across all functions of the game.
        this.initialize();
        this.enemyManager = new app.EnemyManager();

        // Change enemyManager to the 'create' state.
        this.enemyManager.start();
    };

    Game.prototype.getCanvasSize = function () {
        return this.canvasSize;
    };

    Game.prototype.fireMissile = function (who) {
        this.missiles.push(new app.Missile(this.player.currentPosition, who));
        // console.log('fired missile');
    };

    Game.prototype.onenterstate = function(event, from, to) {
        console.log('game.js - onEvent ' + event + ' from: ' + from + ' to: ' + to);
    };

    Game.prototype.onenterintro = function() {
        this.introTimer = Date.now() + 4000;
    };

    Game.prototype.onstageIntro = function() {

    };

    Game.prototype.onstartStage = function() {

    };

    Game.prototype.onlevelComplete = function() {
        this.stage += 1;
        this.summaryTimer = Date.now() + 4000;
    };

    Game.prototype.onleaveactive = function(event, from, to) {
        if (event === 'levelComplete') {
            this.enemyManager.reset(function () {
                game.transition();
            });
        }
        else if (event === 'gameOver') {
            this.restart(function() {
                game.transition();
            });
        }
        return StateMachine.ASYNC;
    };

    Game.prototype.onleavesummary = function() {
        this.reset(function leaveSummary() {
            game.transition();
        });
        return StateMachine.ASYNC;
    };

    Game.prototype.onenterstart = function(event, from, to) {
        if (from === 'summary') {
            this.startTimerOne = Date.now() + 2000;
        }
    };

    Game.prototype.onstartup = function() {
        this.init(this.root);
    };

    Game.prototype.restart = function(callback) {
        this.enemyManager.restart();
        callback();
    };

    Game.prototype.ongameOver = function() {

    };

    Game.prototype.ontryagain = function() {
        this.player.lives = 3;
        this.player.score = 0;
        this.player.currentPosition = this.player.startingPosition.clone();
    };

    app.Game = Game;
}());

StateMachine.create({
    target: app.Game.prototype,
    defer: true,
    events: [
        { name: 'startup',        from: 'none',     to: 'intro' },    // Will show welcome screen and how to get started.
        { name: 'stageIntro',     from: 'intro',    to: 'start' },    // After hitting 'p' to start, show player 1 and stage #
        { name: 'startStage',     from: 'start',    to: 'activate' },
        { name: 'play',           from: 'activate', to: 'active' },   // There isn't a key to get to this stage, only a delay of 2-3 secs
        { name: 'levelComplete',  from: 'active',   to: 'summary' },  // After completion of stage, transition to summary
        { name: 'stageIntro',     from: 'summary',  to: 'start' },
        { name: 'gameOver',       from: 'active',   to: 'over' },
        { name: 'tryagain',        from: 'over',     to: 'intro' }
    ]
});
