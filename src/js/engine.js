var app = app || {};
(app.Engine = function(global) {
    'use strict';
    var win = global.window;
    var doc = win.document;
    var canvas = doc.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var running = false;
    var lastTime = Date.now();
    var dt = 0;
    var sprite = '';
    var entities = [];
    var player = null;
    console.trace();
    /**
     * Initializes the game canvas.
     */
    function init() {
        setCanvasSize(500, 644);
        doc.getElementById('gameboard').appendChild(canvas);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.drawImage(Resources.get(sprite), 0, 0);
        running = true;
        lastTime = Date.now();
        main();
        /**
         * Set listeners specific to the game
         */
        win.addEventListener('focus', unPause.bind(this), false);
        win.addEventListener('blur', pause.bind(this), false);
    }
    /**
     * Add Entity to the entities array
     * @method
     * @param {Entity}
     *
     */
    function addEntity(entity) {
        entities.push(entity);
    }

    function addPlayer(p) {
        player = p;
        // entities.push(player);
    }
    /**
     * Set the canvas size
     * @param {integer} width
     * @param {integer} height
     */
    function setCanvasSize(width, height) {
        canvas.width = width;
        canvas.height = height;
    }
    /**
     * Set the background image file for the canvas
     *
     * @param imageSrc
     */
    function setSprite(imageSrc) {
        sprite = imageSrc;
    }
    /**
     * Gets the size of the canvas
     * @returns {Array} width, height
     */
    function getCanvasSize() {
        return [canvas.width, canvas.height];
    }

    function getDt() {
        return dt;
    }

    function getLastTime() {
        return lastTime;
    }
    /**
     * Append child to element with specific ID
     *
     * @param {string} id Selector for element canvas to be added to
     */
    function appendCanvasToElement(id) {
        doc.getElementById(id).appendChild(canvas);
    }
    /**
     * Toggles the running attribute between true and false
     */
    function toggleRunning() {
        running = !running;
    }
    /**
     * @describe Pauses the engine
     */
    function pause() {
        running = false;
    }
    /**
     * @describe Unpauses the engine
     */
    function unPause() {
        running = true;
        lastTime = Date.now();
        main();
    }

    function update(dt, lastTime) {
        updateEntities(dt, lastTime);
    }

    function updateEntities(dt, lastTime) {
        player.update(dt, lastTime);
        // entities.forEach(function(entity) {
        for (var i = 0; i < entities.length; i++) {
            // entity.update(dt, lastTime);
            // if (collisionDetection(entity)) {
            if (collisionDetection(entities[i])) {
                console.log('Collission Detected');
                console.log(entities[i]);
            }
            entities[i].update(dt, lastTime);

        }
    }

    function render(ctx) {
        ctx.font = '900 24px Arial';
        ctx.fillStyle = 'red';
        ctx.drawImage(Resources.get('images/space.png'), 0, 0);
        ctx.fillText('1UP', 40, 25);
        ctx.fillText('HIGH SCORE', ((canvas.width / 2) - 75), 25);
        ctx.fillStyle = 'white';
        ctx.fillText('######', 40, 50);
        ctx.fillText('######', ((canvas.width / 2) - 75), 50);
        entities.forEach(function(entity) {
            entity.render(ctx);
        });
        player.render(ctx);
    }

    function collisionDetection(e) {
        if (player.missiles.length > 0) {
            for (var i = 0; i < player.missiles.length; i++) {
                for (var t = 0; t < e._enemies.length; t++) {
                    if (e._enemies[t].destroyed) {
                        // Can't be destroyed again, thus return false
                        console.log('already destroyed');
                    } else if (player.missiles[i].currentPosition.x < e._enemies[t].currentPosition.x + e._enemies[t].rect.width &&
                        player.missiles[i].currentPosition.x + player.missiles[i].rect.width > e._enemies[t].currentPosition.x &&
                        player.missiles[i].currentPosition.y < e._enemies[t].currentPosition.y + e._enemies[t].rect.height - 10 &&
                        player.missiles[i].currentPosition.y + player.missiles[i].rect.height > e._enemies[t].currentPosition.y) {
                        // Only destroy the first entity the missile collides with and destroy the missile.
                        e._enemies[t].setDestroy();
                        player.missiles[i].setDestroy();
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function purgeDestroyedEnemies(value) {
        return !value.deleteMe;
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
        entities[0]._enemies = entities[0]._enemies.filter(purgeDestroyedEnemies);
        update(dt, lastTime);
        render(ctx);
        lastTime = now;
        win.requestAnimationFrame(main);
    }
    // app.Engine = Engine;
    return {
        entities: entities,
        addPlayer: addPlayer,
        addEntity: addEntity,
        setSpriteImage: setSprite,
        init: init,
        setCanvasSize: setCanvasSize,
        getCanvasSize: getCanvasSize,
        appendCanvasToElement: appendCanvasToElement
    };
})(this);
