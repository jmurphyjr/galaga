var app = app || {};

(function() {
    'use strict';

    /**
     * @constructor
     **/
    app.Engine = function() {

        var self = this;

        self.doc = document;
        self.win = window;
        self.canvas = self.doc.createElement('canvas');
        self.ctx = self.canvas.getContext('2d');
        self.running = false;
        self.lastTime = Date.now();
        self.dt = 0;
        self.entities = [];

        self.initialize = function() {
            self.setCanvasSize(808, 606);
            self.doc.getElementById('gameboard').appendChild(this.canvas);
            self.ctx.beginPath();
            self.ctx.rect(0, 0, self.canvas.width, self.canvas.height);
            self.ctx.fillStyle = "black";
            self.ctx.fill();
        };

        /**
         * Set the canvas size
         * @param {integer} width
         * @param {integer} height
         */
        self.setCanvasSize = function(width, height) {
            self.canvas.width = width;
            self.canvas.height = height;
        };

        /**
         * Gets the size of the canvas
         * @returns {Array} width, height
         */
        self.getCanvasSize = function() {
            return [self.canvas.width, self.canvas.height];
        };

        /**
         * Append child to element with specific ID
         *
         * @param {string} id Selector for element canvas to be added to
         */
        self.appendCanvasToElement = function(id) {
            self.doc.getElementById(id).appendChild(this.canvas);
        };

        self.toggleRunning = function() {
            self.running = !self.running;
        };

        this.win.addEventListener('focus', function() {
            self.unPause();
        });

        this.win.addEventListener('blur', function() {
            self.pause();
        });

        self.pause = function() {
            self.toggleRunning();
        };

        self.unPause = function() {
            self.toggleRunning();
        };

        self.update = function(dt) {

        };

        self.render = function() {


        };

        /**
         * The main function to run the game
         *
         * @describe
         */
        self.main = function() {

            if (!self.running) {
                return;
            }

            var now = Date.now();
            self.dt = (now - self.lastTime) / 1000.0;

            self.update(self.dt);
            self.render();

            self.lastTime = now;

            self.win.requestAnimationFrame(self.main);
        };
    };

})();

