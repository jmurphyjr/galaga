/**
 * Enemy test suite
**/

describe('App Enemy', function() {

    // var enemy;
    // var app = app || {};

    beforeEach(function() {
         app.Enemy.initialize();
    });

    it('should exist', function() {
        expect(app.Enemy).toBeDefined();
    });

    it('should have a sprite attribute', function() {
        expect(app.Enemy.sprite).toBeDefined();
    });

    it('should be able to set the sprite attribute to a string', function() {
        var spriteImage = 'images/enemy-bug.png';

        app.Enemy.setSpriteImage(spriteImage);

        expect(app.Enemy.setSpriteImage).toBeDefined();
        expect(app.Enemy.sprite).toBe('images/enemy-bug.png');
    });

    it('should throw error if parameter is not string', function() {
        var spriteImage = 5;

        //app.Enemy.setSpriteImage(spriteImage);

        expect( function() {
            app.Enemy.setSpriteImage(spriteImage);
        }).toThrow(new Error('spriteFileName must be string type'));
    })
});
