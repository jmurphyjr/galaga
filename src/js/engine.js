var app = app || {};

(app.Engine = function(global) {
    'use strict';

    var doc = global.document;
    var win = global.window;
    var canvas = doc.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var running = false;
    var lastTime = Date.now();
    var dt = 0;
    var sprite = '';
    var entities = [];
    var player;

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

        player = new app.Player(new app.Point(250, 540), 'white');
        main();
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
     * Set listeners specific to the game
     */
    win.addEventListener('focus', function () {
        unPause();
    });

    win.addEventListener('blur', function () {
        pause();
    });

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
        entities.forEach(function (entity) {
            entity.update(dt, lastTime);
        });
        // player.update(dt, lastTime);
    }

    function render() {

        ctx.font = '900 24px Arial';
        ctx.fillStyle = 'red';
        ctx.drawImage(Resources.get('images/space.png'), 0, 0);
        ctx.fillText('1UP', 40, 25);
        ctx.fillText('HIGH SCORE', ((canvas.width / 2) - 75), 25);
        ctx.fillStyle = 'white';
        ctx.fillText('######', 40, 50);
        ctx.fillText('######', ((canvas.width / 2) - 75), 50);
        entities.forEach(function (entity) {
            entity.render(ctx);
        });
        // player.render(ctx);

    }

    function collisionDetection() {

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

        update(dt, lastTime);
        render(ctx);

        lastTime = now;

        win.requestAnimationFrame(main);

    }

    // app.Engine = Engine;

    return {
        entities: entities,
        setSpriteImage: setSprite,
        init: init,
        setCanvasSize: setCanvasSize,
        getCanvasSize: getCanvasSize,
        appendCanvasToElement: appendCanvasToElement

    };


})(this);
