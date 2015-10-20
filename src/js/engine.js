var app = app || {};
(app.Engine = function(global) {
    'use strict';
    var win = global.window;
    var doc = win.document;
    var f = doc.querySelector("#framespersecond");
    var canvas = doc.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var running = false;
    var lastTime = Date.now();
    var dt = 0;
    var sprite = '';
    var entities = [];
    var player = null;
    var highScore = 0;
    if (typeof this === 'object') {
        setCanvasSize(game.getCanvasSize());
    }
    /**
     * Initializes the game canvas.
     */
    function init() {
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
        // TODO: Temporarily disable focus/blur event listeners
        // win.addEventListener('focus', unPause.bind(this), false);
        // win.addEventListener('blur', pause.bind(this), false);
    }
    /**
     * Add Entity to the entities array
     * @method
     * @param {Entity} entity
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
     * @param {Object} cSize
     */
    function setCanvasSize(cSize) {
        canvas.width = cSize.width;
        canvas.height = cSize.height;
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
        return { width: canvas.width, height: canvas.height };
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
        if (player.score > highScore) {
            highScore = player.score;
        }
    }

    function updateEntities(dt, lastTime) {
        player.update(dt, lastTime);
        // entities.forEach(function(entity) {
        for (var i = entities.length - 1; i >= 0; i--) {
            // entity.update(dt, lastTime);
            // if (collisionDetection(entity)) {
            // If already destroyed, don't check again.
            if (entities[i].current !== 'destroyed') {
                collisionDetection(entities[i]);
            }
            entities[i].update(dt, lastTime);

        }
    }

    function render(ctx) {
        ctx.font = '900 24px Arial';
        ctx.fillStyle = 'red';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(Resources.get('images/space-larger.png'), 0, 0);
        // ctx.rect(0,0, canvas.width, canvas.height);
        ctx.fillText('1UP', 40, 25);
        ctx.fillText('HIGH SCORE', ((canvas.width / 2)), 25);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(player.score.toString(), 40, 50);
        ctx.fillText(highScore.toString(), ((canvas.width / 2)), 50);
        ctx.textAlign = 'center';
        if (gameState.current === 'menu') {
            ctx.fillStyle = 'red';
            ctx.fillText('Player 1', canvas.width / 2, canvas.height * 0.40);
        }
        else {
            entities.forEach(function renderEachEntity(entity) {
                entity.render(ctx);
            });
            player.render(ctx);
        }
        // TODO: The function below should only be used for debugging entity location on the screen
        // TODO: to use otherwise, will cause "jank" on the screen.
        // drawBoard();





    }


    // grid width and height
    var bw = canvas.width;
    var bh = canvas.height;
    // padding around grid
    var p = 0;
    // size of canvas
    var cw = bw + (p * 2) + 1;
    var ch = bh + (p * 2) + 1;

    // var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo('body');

    // var context = canvas.get(0).getContext("2d");

    function drawBoard() {
        for (var x = 0; x <= bw; x += 40) {
            ctx.moveTo(0.5 + x + p, p);
            ctx.lineTo(0.5 + x + p, bh + p);
        }


        for (var i = 0; i <= bh; i += 40) {
            ctx.moveTo(p, 0.5 + i + p);
            ctx.lineTo(bw + p, 0.5 + i + p);
        }

        ctx.strokeStyle = "blue";
        ctx.stroke();
    }




    function collisionDetection(e) {
        if (player.missiles.length > 0) {
            for (var i = 0; i < player.missiles.length; i++) {
                for (var t = 0; t < e.enemies.length; t++) {
                    if (player.missiles[i].currentPosition.x < e.enemies[t].currentPosition.x + e.enemies[t].rect.width &&
                        player.missiles[i].currentPosition.x + player.missiles[i].rect.width > e.enemies[t].currentPosition.x &&
                        player.missiles[i].currentPosition.y < e.enemies[t].currentPosition.y + e.enemies[t].rect.height - 10 &&
                        player.missiles[i].currentPosition.y + player.missiles[i].rect.height > e.enemies[t].currentPosition.y) {
                        // Only destroy the first entity the missile collides with and destroy the missile.
                        // e.enemies[t].setDestroy();
                        if (e.enemies[t].isAlive()) {
                            e.enemies[t].killed();
                        }
                        player.missiles[i].setDestroy();
                        player.score += e.enemies[t].getPointValue();
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
        if (game.gameTimer === 0 && gameState.current === 'menu') {
            game.gameTimer = now + game.gameMenuDelay;

        }
        else if (now > game.gameTimer && gameState.current === 'menu') {
            gameState.play();
            game.enemyManager.launch();
            game.gameTimer = 0;
        }
        if (gameState.current === 'game') {
            update(dt, lastTime);
        }
        render(ctx);
        lastTime = now;
        f.innerHTML = 'Frames / second: ' + fps.getFPS();
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
