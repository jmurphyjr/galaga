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

        enemy.setSprite('green');

        expect(enemy.setSprite).toBeDefined();
        expect(enemy.sprite.image).toBe('images/galaga-green-enemy.png');
    });

    it('should throw error if parameter is not string', function() {
        var spriteImage = 5;

        expect( function() {
            enemy.setSprite(1);
        }).toThrow(new Error('sprite must be string type'));
    });

    describe('state transitions', function() {
        it('starting state should be removed', function() {
            expect(enemy.current).toBe('removed');
        });

        it('should transition to entering when start() is executed', function() {
            enemy.start();
            expect(enemy.current).toBe('entering');
        });

        it('should transition to brigade when lineup() is executed', function() {
            console.log(enemy);
            enemy.start();
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
        });

        it('from brigade state', function() {
            enemy.start();
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
            enemy.attack();
            expect(enemy.current).toBe('attacking');
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
            enemy.fly();
            expect(enemy.current).toBe('flying');
            enemy.lineup();
            enemy.killed();
            expect(enemy.current).toBe('destroyed');
        });

        it('from entering state', function() {
            enemy.start();
            expect(enemy.current).toBe('entering');
            enemy.killed();
            expect(enemy.current).toBe('destroyed');
            enemy.leave();
            enemy.start();
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
        });

        it('from attacking state', function() {
            enemy.start();
            enemy.lineup();
            enemy.attack();
            expect(enemy.current).toBe('attacking');
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
            enemy.attack();
            enemy.killed();
            expect(enemy.current).toBe('destroyed');
        });

        it('from flying state', function() {
            enemy.start();
            enemy.lineup();
            enemy.fly();
            expect(enemy.current).toBe('flying');
            enemy.lineup();
            expect(enemy.current).toBe('brigade');
            enemy.fly();
            enemy.killed();
            expect(enemy.current).toBe('destroyed');
        })

    });
});
