var app = app || {};


// var engine = app.Engine(this);
// var em = new app.EnemyManager(500, 644);

// engine.setSpriteImage('images/space.png');
var game = null;
var loadEntities = function() {
    // em.createEnemies();
    // player = new app.Player(new app.Point(250, 540), 'white');
    // player.init(document);
    // engine.entities.push(player);
    // engine.entities.push(em);
    // engine.init();
    game = new app.Game();
    // game.setCanvasBackground('images/space.png');
    game.init(this);

};

Resources.load([
    'images/space.png',
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

var handleInput = function(key) {
    switch (key) {
        case 'space':
            {
                if (gameState == 'INTRO') {
                    console.log('Draw the canvas');
                    engine.initialize();
                    gameState = 'PLAY';
                } else if (gameState == 'PLAY') {
                    // Fire the missiles.
                    // console.log('fire');
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
gameState = 'PLAY';
