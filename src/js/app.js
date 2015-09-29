var app = app || {};

// var document = this.window;

// $(function () {

var engine = new app.Engine(this.window);
engine.setSpriteImage('images/space.png');

engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [80,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [110,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [140,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [170,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [200,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [230,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [260,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [290,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [320,100]));
engine.entities.push(new app.Enemy('images/galaga-green-enemy.png', [350,100]));

engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [80,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [110,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [140,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [170,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [200,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [230,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [260,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [290,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [320,140]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [350,140]));

engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [80,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [110,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [140,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [170,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [200,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [230,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [260,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [290,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [320,170]));
engine.entities.push(new app.Enemy('images/galaga-red-blue-pink-enemy.png', [350,170]));

engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [80,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [110,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [140,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [170,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [200,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [230,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [260,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [290,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [320,200]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [350,200]));

engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [80,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [110,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [140,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [170,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [200,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [230,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [260,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [290,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [320,230]));
engine.entities.push(new app.Enemy('images/galaga-blue-yellow-red-enemy.png', [350,230]));

player = new app.Player('images/galaga-white-fighter.png', [300,500]);
engine.entities.push(player);
Resources.load([
    'images/space.png',
    'images/galaga-red-fighter.png',
    'images/galaga-white-fighter.png',
    'images/galaga-red-blue-pink-enemy.png',
    'images/galaga-blue-yellow-red-enemy.png',
    'images/galaga-blue-enemy.png',
    'images/galaga-green-enemy.png',
    'images/galaga-green-enemy-filmstrip.png',
    'images/galaga-bullet.png'
]);

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
        //case 'left':
        //{
        //    console.log('Move left');
        //    // player.direction = -1;
        //    // player.move = true;
        //    break;
        //}
        //case 'right':
        //{
        //    console.log('Move right');
        //    // player.direction = +1;
        //    // player.move = true;
        //    break;
        //}
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
    switch(key) {
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