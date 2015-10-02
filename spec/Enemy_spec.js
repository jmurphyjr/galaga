/**
 * Enemy test suite
**/
Resources.load('src/images/galaga-green-enemy.png');

describe('App Enemy', function() {

    var enemy;
    // var app = app || {};

    beforeEach(function() {
        enemy = new app.Enemy(new app.Point(80, 100), 'green');
        // enemy.initialize();
    });

    it('should exist', function() {
        expect(app.Enemy).toBeDefined();
    });

    it('should have a sprite attribute', function() {
        expect(enemy.sprite).toBeDefined();
    });

    it('should be able to set the sprite attribute to a string', function() {
        var spriteImage = 'images/galaga-green-enemy.png';

        enemy.setSpriteImage(spriteImage);

        expect(enemy.setSpriteImage).toBeDefined();
        expect(enemy.sprite).toBe('images/galaga-green-enemy.png');
    });

    it('should throw error if parameter is not string', function() {
        var spriteImage = 5;

        expect( function() {
            enemy.setSpriteImage(spriteImage);
        }).toThrow(new Error('spriteFileName must be string type'));
    })
});
