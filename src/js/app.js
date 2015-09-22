var app = app || {};

var document = this;

$(function () {
    'use strict';

    var engine = new app.Engine();

    var gameState = '';

    document.handleInput = function(key) {
        switch (key) {
            case 'space':
            {
                console.log('Draw the canvas');
                engine.initialize();
                break;
            }
            case 'left':
            {
                console.log('Move left');
                break;
            }
            case 'right':
            {
                console.log('Move right');
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
});


document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    document.handleInput(allowedKeys[e.keyCode]);
});

