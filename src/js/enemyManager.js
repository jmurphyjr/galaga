/**
 * Created by jack on 10/2/15.
 */
var app = app || {};
(function () {
    function EnemyManager(cWidth, cHeight) {
        // public properties
        // Valid brigadeState = 'SLIDE', 'PULSE', 'BEGIN'
        this.brigadeState = 'OFF';

        this._game = game instanceof app.Game ? game : new app.Game();

        this.greenStartRow = 3;

        this.brigadeStartRow = 2;

        this.brigadeStartColumn = 2;

        this.brigadePulseTimer = 0;

        this.brigadePulseDelay = 5000;

        this.brigadePulseDirection = 'in';

        /**
         * @description The starting point for the brigade
         * @property _brigadeStartingPoint
         * @type {Point}
         * @private
         */
        this.brigadeStartingPoint = new app.Point(this.brigadeStartColumn * this._game.cellSize, this.brigadeStartRow * this._game.cellSize);
        /**
         * @description The current point where the brigade is located
         * @property brigadeCurrentPoint
         * @type {Point}
         * @private
         */
        this.brigadeCurrentPoint = new app.Point();
        this.brigadeCurrentPoint.copy(this.brigadeStartingPoint);
        /**
         * @description For the brigade slide, the direction of the slide.
         * @property _brigadeSlideDirection
         * @type {Number}
         * @private
         */
        this._brigadeSlideDirection = +1;
        this._brigadePulseStartPoint = new app.Point(cWidth / 2, 70);
        this._brigadePulseMaxOffset = 20;
        this._brigadePulseCurrentPoint = new app.Point();
        /**
         * @description The y offset between rows
         * @property _rowOffset
         * @type {Number}
         * @private
         */
        this._rowOffset = 30;
        /**
         * @description The top row green enemies are slightly larger
         * thus need to nudge the green enemies starting location
         * @property _greenRowNudge
         * @type {Number}
         * @private
         */
        this._greenRowNudge = 10;
        /**
         * @description The x offset between columns
         * @property _columnOffset
         * @type {Number}
         * @private
         */
        this._columnOffset = 30;
        /**
         * @property enemies
         * @type {Array}
         */
        this.enemies = [];
        this._destroyedEnemies = [];

        this.csize = this._game.getCanvasSize();

        // The following variables will be used for bringing the enemies onto the screen.
        this.group = [];
        this.group[1] = [];
        this.group[2] = [];
        this.group[3] = [];
        this.group[4] = [];
        this.group[5] = [];
        this.group[6] = [];
        this.groupCounter = 1;
        this.groupElementCounter = 0;
        this.groupLength = 0;
        this.groupLaunchTimer = 0;
        this.groupLaunchDelay = 3000;

        this.groupEnemyTimer = 0;
        this.groupEnemyDelay = 100;
    }

    /**
     * Instantiates the enemy entities.
     * @method createEnemies
     */
    EnemyManager.prototype.createEnemies = function () {
        var startingX = 0;
        var startingY = 0;
        var enemy;
        var g1Location = 0;
        var g2Location = 0;
        var g3Location = 0;
        var g4Location = 0;
        var g5Location = 0;
        var g6Location = 0;

        for (var t = 6; t <= 9; t++) {
            // Green starts in column 6 and is only one row.
            startingX = t * game.cellSize;
            startingY = this.greenStartRow * game.cellSize;
            enemy = new app.GreenEnemy(new app.Point(startingX, startingY));
            enemy.setRow(3);
            enemy.setColumn(t);
            // All GreenEnemies are in Group 3, they need to be added to the array in all even locations.
            enemy.group = 3;
            this.group[3][g3Location] = enemy;
            this.enemies.push(enemy);
            g3Location += 2;
        }

        g3Location = 1;  // For red enemies in group 2 they go in the odd slots.
        for (var row = 4; row <= 5; row++) {
            // Red Blue starts in column 2 and are located in rows 2 and 3.
            for (var j = 4; j <= 11; j++) {
                startingX = j * game.cellSize;
                startingY = row * game.cellSize;
                enemy = new app.Enemy(new app.Point(startingX, startingY), 'redblue');
                enemy.setRow(row);
                enemy.setColumn(j);
                if (j === 6 || j === 9) {
                    enemy.group = 3;
                    this.group[3][g3Location] = enemy;
                    g3Location += 2;
                }
                else if (j === 7 || j === 8) {
                    enemy.group = 1;
                    this.group[1][g1Location] = enemy;
                    g1Location += 1;
                }
                else if (j === 4 || j === 5 || j === 10 || j === 11) {
                    enemy.group = 4;
                    this.group[4][g4Location] = enemy;
                    g4Location += 1;
                }
                this.enemies.push(enemy);
            }
        }

        for (var k = 6; k <= 7; k++) {
            // Blue Yellow starts in column 1 and are located in rows 4 and 5.

            for (var n = 3; n <= 12; n++) {
                startingX = n * game.cellSize;
                startingY = k * game.cellSize;
                enemy = new app.Enemy(new app.Point(startingX, startingY), 'blueyellow');
                enemy.setRow(k);
                enemy.setColumn(n);
                if (n === 7 || n === 8) {
                    enemy.group = 2;
                    this.group[2][g2Location] = enemy;
                    g2Location += 1;
                }
                else if (n === 5 || n === 6 || n === 9 || n === 10) {
                    enemy.group = 5;
                    this.group[5][g5Location] = enemy;
                    g5Location += 1;
                }
                else if (n === 3 || n === 4 || n == 11 || n === 12) {
                    enemy.group = 6;
                    this.group[6][g6Location] = enemy;
                    g6Location += 1;
                }
                this.enemies.push(enemy);
            }
        }
        var ul = game.root.document.createElement('ul');
        ul.setAttribute('id', 'list');
        this.enemies.forEach(function addTestData(e) {
            var li = game.root.document.createElement('li');
            li.setAttribute('id', e.__objId);
            li.appendChild(game.root.document.createTextNode('x: ' + e.currentPosition.x.toFixed(1) + ' y: ' + e.currentPosition.y.toFixed(1)));
            ul.appendChild(li);

        });
        // game.root.document.getElementById('enemyInfo').appendChild(ul);
    };

    /**
     * Array Filter function to retrieve all of the enemies that have been destroyed.
     *
     * @method
     * @param  {Enemy|GreenEnemy}  value An instance of either Enemy or GreenEnemy
     * @return {Boolean}       The value of the destroyed attribute.
     */
    EnemyManager.prototype.isDestroyed = function (value) {
        return value.destroyed;
    };

    /**
     * Array Filter function to retrive all of the enemies that are alive.
     *
     * @method
     * @param  {Enemy|GreenEnemy}  value An instance of either Enemy or GreenEnemy
     * @return {Boolean}       [description]
     */
    EnemyManager.prototype.isAlive = function (value) {
        return !value.destroyed;
    };

    /**
     * Update entity to latest position. Position is determined on the
     * current state of the Brigade. This logic controls only the Brigade.
     * Individual enemies may be on a bombing run, thus their actions are
     * controlled internally.
     *
     * @method update
     * @param dt
     * @param lastTime
     */
    EnemyManager.prototype.update = function (dt, lastTime) {
        var alive = this.enemies.filter(this.isAlive);
        if (alive.length === 0) {
            // this.reset();
            // this.reset();
            gameState.reset();
        }
        if (this.current === 'group1') {
            if (lastTime > this.groupEnemyTimer) {
                if (this.groupElementCounter === this.groupLength) {

                    // if (lastTime > this.groupLaunchTimer) {
                    // Check that all group1 elements are home before calling next group.
                    if (this.groupHome(1)) {
                        this.nextgroup();
                        this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                        return;
                    }
                }
                else {
                    this.group[this.groupCounter][this.groupElementCounter].start();
                    this.group[this.groupCounter + 1][this.groupElementCounter].start();
                    this.groupEnemyTimer = lastTime + this.groupEnemyDelay;
                    this.groupElementCounter++;
                    this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                }
            }

        }
        else if (this.current === 'group3') {

            if (lastTime > this.groupEnemyTimer) {
                if (this.groupElementCounter === this.groupLength) {
                    if (this.groupHome(3)) {
                        this.nextgroup();
                        this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                        return;
                    }
                }
                else {
                    this.group[this.groupCounter][this.groupElementCounter].start();
                    this.groupEnemyTimer = lastTime + this.groupEnemyDelay;
                    this.groupElementCounter++;
                    this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                }
            }

        }
        else if (this.current === 'group4') {

            if (lastTime > this.groupEnemyTimer) {
                if (this.groupElementCounter === this.groupLength) {
                    if (this.groupHome(4)) {
                        this.nextgroup();
                        this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                        return;
                    }
                }
                else {
                    this.group[this.groupCounter][this.groupElementCounter].start();
                    this.groupEnemyTimer = lastTime + this.groupEnemyDelay;
                    this.groupElementCounter++;
                    this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                }
            }

        }
        else if (this.current === 'group5') {

            if (lastTime > this.groupEnemyTimer) {
                if (this.groupElementCounter === this.groupLength) {
                    if (this.groupHome(5)) {
                        this.nextgroup();
                        this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                        return;
                    }
                }
                else {
                    this.group[this.groupCounter][this.groupElementCounter].start();
                    this.groupEnemyTimer = lastTime + this.groupEnemyDelay;
                    this.groupElementCounter++;
                    this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                }
            }

        }
        else if (this.current === 'group6') {

            if (lastTime > this.groupEnemyTimer) {
                if (this.groupElementCounter === this.groupLength) {
                    if (this.groupHome(6)) {
                        this.nextgroup();
                        this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                        return;
                    }
                }
                else {
                    this.group[this.groupCounter][this.groupElementCounter].start();
                    this.groupEnemyTimer = lastTime + this.groupEnemyDelay;
                    this.groupElementCounter++;
                    this.groupLaunchTimer = lastTime + this.groupLaunchDelay;
                }
            }

        }
        else if (this.current === 'slide') {
            this.setBrigadeWidth();

            if (this._brigadeSlideDirection === 1 && (this.brigadeXMax) > this.csize.width) {
                this._brigadeSlideDirection = -1;
            }
            else if (this._brigadeSlideDirection === -1 && (this.brigadeXMin < 0)) {
                this._brigadeSlideDirection = +1;
            }
            xmove = dt * 10 * this._brigadeSlideDirection;
            var bCurrent = this.brigadeCurrentPoint;

            this.enemies.forEach(function emUpdateEnemies(entity) {
                entity.state = 'SLIDE';
                entity.update(dt, lastTime, bCurrent);
            });
            this.brigadeCurrentPoint.x += xmove;
        }
        else if (this.current === 'pulse') {
            // Enemies will move out from the center of the screen, they will begin
            // to return when
            if (lastTime > this.brigadePulseTimer) {

                if (this.brigadePulseDirection === 'in') {
                    this.brigadePulseDirection = 'out';
                }
                else {
                    this.brigadePulseDirection = 'in';
                }
                this.brigadePulseTimer = lastTime + this.brigadePulseDelay;
            }

            this.enemies.forEach(function setEnemyPulseDirection(entity) {
                entity.state = 'PULSE';
                entity.pulseDirection = this.brigadePulseDirection;
                entity.update(dt, lastTime);
                // game.root.document.getElementById(entity.__objId).innerHTML = 'Column: ' + entity.column + ' x: ' + entity.currentPosition.x.toFixed(1) + ' y: ' + entity.currentPosition.y.toFixed(1);;

            });
        }
        this.enemies.forEach(function updateEnemyBegin(entity) {
            entity.update(dt, lastTime);
            // game.root.document.getElementById(entity.__objId).innerHTML = 'Column: ' + entity.column + ' x: ' + entity.currentPosition.x.toFixed(1) + ' y: ' + entity.currentPosition.y.toFixed(1);;

        });

    };

    EnemyManager.prototype.render = function (ctx) {
        this.enemies.forEach(function renderEachEntity(entity) {
            entity.render(ctx);
        });
    };

    EnemyManager.prototype.groupHome = function(g, callback) {
        var home = true;
        var i = 0;

        if (callback) {
            for (i = 0; i < this.group[g].length; i++) {
                console.log('var i in groupHome = ' + i);
                if (this.group[g][i].current !== 'removed') {
                    while (!this.group[g][i].atHome()) {

                    }
                }
            }
            callback();
        }
        else {
            for (i = 0; i < this.group[g].length; i++) {
                if (this.group[g][i].current !== 'removed') {
                    if (!this.group[g][i].atHome()) {
                        return false;
                    }
                }
            }
            return home;
        }
    };

    EnemyManager.prototype.setBrigadeWidth = function() {
        var cEnemy = null;
        var xMin = 1000;
        var xMax = 0;

        for (var e = 0; e < this.enemies.length; e++) {
            cEnemy = this.enemies[e];
            if (cEnemy.current === 'brigade') {
                if (cEnemy.currentPosition.x < xMin) {
                    this.brigadeXMin = cEnemy.currentPosition.x;
                    xMin = cEnemy.currentPosition.x;
                }

                if (cEnemy.currentPosition.x > xMax) {
                    this.brigadeXMax = (cEnemy.currentPosition.x + game.cellSize);
                    xMax = cEnemy.currentPosition.x;
                }
            }
        }
    };

    EnemyManager.prototype.onenterstate = function(event, from, to) {
        console.log('EnemyManager transitioned from: ' + from + ' to: ' + to + ' because of event: ' + event);
    };

    /**
     * On start the enemies will be created. Once all enemies are created, the EnemyManager will transition to
     * the 'begin' state.
     * @param event
     * @param from
     * @param to
     */
    EnemyManager.prototype.onstart = function(event, from, to) {
        this.createEnemies(); // Just creates the enemies. Does not put them on the canvas. Enemies are created once.
        // this.launch();
    };

    EnemyManager.prototype.onlaunch = function(event, from, to) {
        // Brigade state starts with SLIDE. As the enemies enter the scene and join the brigade
        // they will slide back and forth until all enemies are on screen.
        this.brigadeState = 'PULSE';
        // Start with Group 1, set the groupLength attribute to the length of group 1.
        this.groupLength = this.group[1].length;
        this.groupElementCounter = 0;
        this.groupCounter = 1;
    };

    EnemyManager.prototype.onnextgroup = function(event, from, to) {
        if (to === 'group1') {
            this.groupCounter = 1;
            this.groupLength = this.group[1].length;
            this.groupElementCounter = 0;
        }
        if (to === 'group2') {
            this.groupCounter = 2;
            this.groupLength = this.group[2].length;
            this.groupElementCounter = 0;
        }
        else if (to === 'group3') {
            this.groupCounter = 3;
            this.groupLength = this.group[3].length;
            this.groupElementCounter = 0;

        }
        else if (to === 'group4') {
            this.groupCounter = 4;
            this.groupLength = this.group[4].length;
            this.groupElementCounter = 0;
        }
        else if (to === 'group5') {
            this.groupCounter = 5;
            this.groupLength = this.group[5].length;
            this.groupElementCounter = 0;
        }
        else if (to === 'group6') {
            this.groupCounter = 6;
            this.groupLength = this.group[6].length;
            this.groupElementCounter = 0;
        }
    };

    EnemyManager.prototype.onmarch = function(event, from, to) {

    };

    EnemyManager.prototype.onattack = function(event, from, to) {

    };

    /**
     * On reset the state of the EnemyManager will transition to 'levelcomplete'.
     * The EnemyManager will remain in this state until the screen has been updated to show
     * the level complete information, as well as the beginning of the next level.
     * @param event
     * @param from
     * @param to
     */
    EnemyManager.prototype.onreset = function(event, from, to) {
        this.brigadeCurrentPoint.copy(this.brigadeStartingPoint);
    };

    EnemyManager.prototype.onleavegroup1 = function() {
        var self = this;
        this.groupHome(1, function() {
            self.transition();
            console.log('transition from group1 complete');
        });
        return StateMachine.ASYNC;
    };

    EnemyManager.prototype.onleavegroup3 = function() {
        var self = this;
        this.groupHome(3, function() {
            self.transition();
            console.log('transition from group3 complete');
        });
        return StateMachine.ASYNC;
    };

    EnemyManager.prototype.onleavegroup4 = function() {
        var self = this;
        this.groupHome(4, function() {
            self.transition();
        });
        return StateMachine.ASYNC;
    };

    EnemyManager.prototype.onleavegroup5 = function() {
        var self = this;
        this.groupHome(5, function() {
            self.transition();
        });
        return StateMachine.ASYNC;
    };

    EnemyManager.prototype.onleavegroup6 = function() {
        var self = this;
        this.groupHome(6, function() {
            self.transition();
        });
        return StateMachine.ASYNC;
    };


    app.EnemyManager = EnemyManager;

}());

StateMachine.create({
    target: app.EnemyManager.prototype,
    initial: 'init',
    events: [
        { name: 'start',     from: 'init',          to: 'create' },        // This is executed only once during the game.
        { name: 'launch',    from: 'create',        to: 'group1' },         // This transition occurs only once during the game.
        // { name: 'nextgroup', from: 'group1',        to: 'group2' },
        { name: 'nextgroup', from: 'group1',        to: 'group3' },
        { name: 'nextgroup', from: 'group3',        to: 'group4' },
        { name: 'nextgroup', from: 'group4',        to: 'group5' },
        { name: 'nextgroup', from: 'group5',        to: 'group6' },
        { name: 'nextgroup', from: 'group6',        to: 'pulse' },
        { name: 'attack',    from: 'slide',         to: 'pulse' },
        { name: 'march',     from: 'pulse',         to: 'slide' },
        { name: 'pulse',     from: 'slide',         to: 'pulse' },
        { name: 'reset',     from: 'begin',         to: 'levelcomplete' },
        { name: 'reset',     from: 'slide',         to: 'levelcomplete' },
        { name: 'reset',     from: 'pulse',         to: 'levelcomplete' },
        { name: 'launch',    from: 'levelcomplete', to: 'group1' }
    ]
});
