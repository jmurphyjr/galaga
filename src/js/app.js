var app = app || {};

var engine = new app.Engine(window);
engine.setSpriteImage('images/space.png');

var loadEntities = function() {
    engine.entities.push(new app.Enemy(new app.Point(80, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(110, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(140, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(170, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(200, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(230, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(260, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(290, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(320, 100), 'green'));
    engine.entities.push(new app.Enemy(new app.Point(350, 100), 'green'));

    engine.entities.push(new app.Enemy(new app.Point(80, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(110, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(140, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(170, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(200, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(230, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(260, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(290, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(320, 140), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(350, 140), 'redblue'));

    engine.entities.push(new app.Enemy(new app.Point(80, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(110, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(140, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(170, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(200, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(230, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(260, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(290, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(320, 170), 'redblue'));
    engine.entities.push(new app.Enemy(new app.Point(350, 170), 'redblue'));

    engine.entities.push(new app.Enemy(new app.Point(80, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(110, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(140, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(170, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(200, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(230, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(260, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(290, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(320, 200), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(350, 200), 'blueyellow'));

    engine.entities.push(new app.Enemy(new app.Point(80, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(110, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(140, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(170, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(200, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(230, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(260, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(290, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(320, 230), 'blueyellow'));
    engine.entities.push(new app.Enemy(new app.Point(350, 230), 'blueyellow'));

    player = new app.Player(new app.Point(250, 540), 'white');
    engine.entities.push(player);
};

Resources.load([
    'images/space.png',
    'images/galaga-red-fighter.png',
    'images/galaga-white-fighter.png',
    'images/galaga-red-blue-pink-enemy.png',
    'images/galaga-blue-yellow-red-enemy.png',
    'images/galaga-blue-enemy.png',
    'images/galaga-green-enemy.png',
    'images/galaga-green-enemy-spriteSheet.png',
    'images/galaga-bullet.png'
]);
Resources.onReady(loadEntities);
Resources.onReady(engine.init);


var gameState = 'INTRO';

var handleInput = function (key) {
    switch (key) {
        case 'space':
        {
            if (gameState == 'INTRO') {
                console.log('Draw the canvas');
                engine.initialize();
                gameState = 'PLAY';
            }
            else if (gameState == 'PLAY') {
                // Fire the missiles.
                console.log('fire');
            }
            // engine.main();
            break;
        }
        case 'up':
        {
            console.log('Move up');
            break;
        }
        case 'down':
        {
            console.log('Move down');
            break;
        }
    }
};
// });

var keys = [];

// key events
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.keys[e.keyCode] = true;
    handleInput(allowedKeys[e.keyCode]);
});

var breakMovement = function(key) {
    switch (key) {
        case 'left':
        {
            player.move = false;
            break;
        }
        case 'right':
        {
            player.move = false;
            break;
        }
    }
};

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        39: 'right'
    };

    breakMovement(allowedKeys[e.keyCode]);
    player.keys[e.keyCode] = false;
});
// engine.initialize();
gameState = 'PLAY';
