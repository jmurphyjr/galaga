var app = app || {};


gameState = StateMachine.create({
    defer: true,
    events: [
        { name: 'startup', from: 'none', to: 'menu' },
        { name: 'play', from: 'menu', to: 'start' },
        { name: 'activate', from: 'start', to: 'playing' },
        { name: 'reset', from: 'playing', to: 'menu' }
    ],

    callbacks: {
        onstartup: function (event, from, to, msg) {
            game.init(msg);
            game.showSplashScreen('start');
        },
        onleavemenu: function(event, from, to) {

        },
        onreset: function (event, from, to, msg) {
            console.log('onreset ' + event);
            // game.reset(function() {
            //     gameState.transition();
            // });
            if (from === 'playing') {
                // We are starting a new level
                game.stage++;
                game.showSplashScreen('stage');
            }
            // game.stage++;
            // game.showSplashScreen('stage');
            // return StateMachine.ASYNC;

        },
        onleaveplaying: function() {
            game.reset(function() {
                gameState.transition();
            });
            return StateMachine.ASYNC;
        },
        onplay: function(event, from, to) {
            console.log('onplay ' + event);
            game.startPlay();
        },
        onenterstate: function(event, from, to) {
            console.log('gameState transitioned from: ' + from + ' to: ' + to + ' because of event: ' + event);
        }
    }
});

var game = null;
game = new app.Game();

var loadEntities = function () {
    gameState.startup(this);

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
// Resources.onReady(engine.init);

function handleInput(key) {
    switch (key) {
        case 'startGame':
        {
            if (gameState.current === 'menu') {
                gameState.play();
            }
            break;
        }
        case 'space':
        {
            if (gameState.current === 'playing') {
                // while in 'playing' state space bar is firing a player missile
                game.fireMissile('player');
            }
            break;
        }
    }
}

document.addEventListener('keydown', function(e) {
    // console.log(e.keyCode);
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'startGame'
    };

    handleInput(allowedKeys[e.keyCode]);
});
