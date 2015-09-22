var app = app || {};

(function() {
    'use strict';

    var Enemy = function() {

        this.initialize = function() {
            this.sprite = '';
        };

        this.setSpriteImage = function(spriteFileName) {

            if (typeof spriteFileName !== 'string') {
                throw new Error('spriteFileName must be string type');
            }
            this.sprite = spriteFileName;
        };

    };

    app.Enemy = new Enemy();
})();

