var app = app || {};


gameState = StateMachine.create({
    defer: true,
    events: [
        { name: 'startup', from: 'none', to: 'menu' },
        { name: 'play', from: 'menu', to: 'game' },
        { name: 'game', from: 'game', to: 'menu' }
    ],

    callbacks: {
        onstartup: function (event, from, to, msg) {
            game.init(msg);
        },
        ongame: function (event, from, to, msg) {
            console.log(event);
        },
        onenterstate: function(event, from, to) {
            console.log('gameState transitioned from: ' + from + ' to: ' + to + ' because of event: ' + event);
        }
    }
});

// var engine = app.Engine(this);
// var em = new app.EnemyManager(500, 644);

// engine.setSpriteImage('images/space.png');
var game = null;
var loadEntities = function () {
    // em.createEnemies();
    // player = new app.Player(new app.Point(250, 540), 'white');
    // player.init(document);
    // engine.entities.push(player);
    // engine.entities.push(em);
    // engine.init();
    game = new app.Game();
    // game.setCanvasBackground('images/space.png');
    // game.init(this);
    gameState.startup(this);
    // gameState.play(this);

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

