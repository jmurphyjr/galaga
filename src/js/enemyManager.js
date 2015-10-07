/**
 * Created by jack on 10/2/15.
 */
var app = app || {};
(function() {
    function EnemyManager(cWidth, cHeight) {
        // public properties
        this.brigadeState = 'SLIDE';
        /**
         * The maximum number of green enemies active in the game.
         * @property greenEnemies
         * @type Number
         * @default 10
         */
        this.maxGreen = 4;
        /**
         * Green enemies must be hit twice to be destroyed. After first
         * hit, green enemies turn blue.
         * @property greenHealthCounter
         * @type {Number}
         * @default 2
         */
        this.greenHealthCounter = 2;
        /**
         * The maximum number of blue enemies active in the game.
         * @property blueEnemies
         * @type {Number}
         * @default 20
         */
        this.maxBlue = 16;
        /**
         * The maximum number of yellow enemies active in the game.
         * @property yellowEnemies
         * @type Number
         * @default 20
         */
        this.maxYellow = 20;
        /**
         * The number of times an enemy needs to be hit in order to be destroyed.
         *   - greenEnemies require 2 hits to be destroyed
         *          * After first hit, greenEnemies become blue Enemies
         *   - All other enemies require only one hit to be destroyed.
         *
         * @property defaultHealth
         * @type {number}
         * @default 1
         */
        this.defaultHealth = 1;
        // private properties
        this._brigadeMaxWidth = 385;
        /**
         * @description The starting point for the brigade
         * @property _brigadeStartingPoint
         * @type {Point}
         * @private
         */
        this._brigadeStartingPoint = new app.Point(50, 70);
        /**
         * @description The current point where the brigade is located
         * @property _brigadeCurrentPoint
         * @type {Point}
         * @private
         */
        this._brigadeCurrentPoint = this._brigadeStartingPoint.clone();
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
         * @property _enemies
         * @private
         * @type {Array}
         */
        this._enemies = [];
        /**
         *
         * @property _row
         * @type {Number}
         * @private
         */
        this._row = null;
        this._canvasWidth = cWidth;
        this._canvasHeight = cHeight;
    }
    /**
     * Instantiates the enemy entities.
     * @method createEnemies
     */
    EnemyManager.prototype.createEnemies = function() {
        var startingX = 0;
        var startingY = 0;
        var type = '';
        var nudge = 0;
        var currentColumn = 0;
        var currentRow = 1;
        var enemy;
        type = 'green';
        currentColumn = 4;
        nudge = 0;
        for (var t = 1; t <= 4; t++) {
            // Green starts in column 4 and is only one row.
            startingX = this._brigadeStartingPoint.x + currentColumn * this._columnOffset;
            startingY = this._brigadeStartingPoint.y + currentRow * this._rowOffset + nudge;
            enemy = new app.GreenEnemy(new app.Point(startingX, startingY));
            enemy.setRow(1);
            enemy.setColumn(currentColumn);
            this._enemies.push(enemy);
            currentRow++;
            currentColumn++;
        }
        type = 'redblue';
        currentRow = 2;
        nudge = this._greenRowNudge;
        for (var i = 1; i <= 2; i++) {
            // Red Blue starts in column 2 and are located in rows 2 and 3.
            currentColumn = 2;
            for (var j = 0; j < 8; j++) {
                startingX = this._brigadeStartingPoint.x + currentColumn * this._columnOffset;
                startingY = this._brigadeStartingPoint.y + currentRow * this._rowOffset + nudge;
                enemy = new app.Enemy(new app.Point(startingX, startingY), type);
                enemy.setRow(currentRow);
                enemy.setColumn(currentColumn);
                this._enemies.push(enemy);
                currentColumn++;
            }
            currentRow++;
        }
        type = 'blueyellow';
        currentRow = 4;
        for (var k = 1; k <= 2; k++) {
            // Blue Yellow starts in column 1 and are located in rows 4 and 5.
            currentColumn = 1;
            for (var n = 0; n < 10; n++) {
                startingX = this._brigadeStartingPoint.x + currentColumn * this._columnOffset;
                startingY = this._brigadeStartingPoint.y + currentRow * this._rowOffset + nudge;
                enemy = new app.Enemy(new app.Point(startingX, startingY), type);
                enemy.setRow(currentRow);
                enemy.setColumn(currentColumn);
                this._enemies.push(enemy);
                currentColumn++;
            }
            currentRow++;
        }
    };

    /**
     * Array Filter function to retrieve all of the enemies that have been destroyed.
     *
     * @method
     * @param  {Enemy|GreenEnemy}  value An instance of either Enemy or GreenEnemy
     * @return {Boolean}       The value of the destroyed attribute.
     */
    EnemyManager.prototype.isDestroyed = function(value) {
        return value.destroyed;
    };

    /**
     * Array Filter function to retrive all of the enemies that are alive.
     *
     * @method
     * @param  {Enemy|GreenEnemy}  value An instance of either Enemy or GreenEnemy
     * @return {Boolean}       [description]
     */
    EnemyManager.prototype.isAlive = function(value) {
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
    EnemyManager.prototype.update = function(dt, lastTime) {
        var xmove = 0;
        var ymove = 0;

        var dead = this._enemies.filter(this.isDestroyed);
        var alive = this._enemies.filter(this.isAlive);

        if (dead.length > 0) {
            console.log(dead.length);
            dead.forEach(function(entity) {
                entity.setSprite('explosion');
                console.log('Frame Counter: ' + entity.frameCounter);
                entity.update(dt, lastTime);
                console.log('Entity id: ' + entity.__objId + '  frameCounter: ' + entity.frameCounter);
            });
        }
        // console.log(this._brigadeCurrentPoint);
        if (this.brigadeState === 'SLIDE') {
            if (this._brigadeSlideDirection === 1 && (this._brigadeCurrentPoint.x - this._brigadeStartingPoint.x) > 40) {
                this._brigadeSlideDirection = -1;
            } else if (this._brigadeSlideDirection === -1 && (this._brigadeStartingPoint.x - this._brigadeCurrentPoint.x) > 40) {
                this._brigadeSlideDirection = +1;
            }
            xmove = dt * 10 * this._brigadeSlideDirection;
            var bCurrent = this._brigadeCurrentPoint;
            var bColOff = this._columnOffset;
            var bRowOff = this._rowOffset;
            // this._enemies.forEach(function(entity) {
            //     entity.update(dt, lastTime, bCurrent, xmove, ymove, bColOff, bRowOff);
            // });
            alive.forEach(function(entity) {
                entity.update(dt, lastTime, bCurrent, xmove, ymove, bColOff, bRowOff);
            });
            this._brigadeCurrentPoint.x += xmove;
        } else if (this.brigadeState === 'PULSE') {
            // Enemies will move out from the center of the screen, they will begin
            // to return when
            if (this._brigadePulseStart === true) {
                this._brigadePulseStartPoint = this._brigadeCurrentPoint.clone();
                this._brigadePulseCurrentPoint = this._brigadePulseStartPoint.clone();
                this._brigadePulseStart = false;
                this._enemies.forEach(function(entity) {
                    entity.setState('PULSE');
                });
            }
        }
    };

    EnemyManager.prototype.render = function(ctx) {
        this._enemies.forEach(function(entity) {
            entity.render(ctx);
        });
    };

    EnemyManager.prototype.setCanvasSize = function(width, height) {
        this._canvasWidth = width;
        this._canvasHeight = height;
        console.log(self._canvasWidth + ', ' + self._canvasHeight);
    };

    app.EnemyManager = EnemyManager;

}());
