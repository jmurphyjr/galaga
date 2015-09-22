/**
 * @description Game Engine Test suite.
**/

describe('Application Engine', function() {
    var engine;

    beforeEach(function() {
       setFixtures('<div id="gameboard"></div>');
        engine = new app.Engine();
    });

    describe("should have", function() {
        it('app.Engine attribute', function () {
            expect(app.Engine).toBeDefined();
        });

        it('initialize attribute', function() {
            expect(engine.initialize).toBeDefined();
        });

        it('doc attribute', function() {
            expect(engine.doc).toBeDefined();
        });

        it('win attribute', function() {
            expect(engine.win).toBeDefined();
        });

        it('canvas attribute', function() {
            expect(engine.canvas).toBeDefined();
        });

        it('ctx attribute', function() {
            expect(engine.ctx).toBeDefined();
        });

        it('running attribute and should be false', function() {
            expect(engine.running).toBeDefined();
            expect(engine.running).toBe(false);
        });

        it('toggleRunning function', function() {
            expect(engine.toggleRunning).toBeDefined();
        });

        it('lastTime attribute', function() {
            expect(engine.lastTime).toBeDefined();
        });

        it('main  attribute', function() {
            expect(engine.main).toBeDefined();
        });

        it('render attribute', function() {
            expect(engine.render).toBeDefined();
        });

        it('entities attribute', function() {
            expect(engine.entities).toBeDefined();
        });


    });

    describe('toggleRunning', function() {

        it('running default is false', function() {
            expect(engine.running).toBe(false);
        });

        it('should set running to true', function() {
            // now toggle running to be true
            engine.toggleRunning();

            expect(engine.running).toBe(true);
        });

        it('should execute toggleRunning when pause/unPause are executed', function() {
            spyOn(engine, 'toggleRunning');
            engine.pause();
            expect(engine.toggleRunning).toHaveBeenCalled();
        });

        it('unpause should make running true', function() {
            spyOn(engine, 'toggleRunning');
            engine.unPause();
            expect(engine.toggleRunning).toHaveBeenCalled();

        })
    });

    describe('canvas', function() {

        it('should be able to set canvas size', function() {
            engine.setCanvasSize(800, 600);

            expect(engine.canvas.width).toBe(800);
            expect(engine.canvas.height).toBe(600);
        });

        it('should be able to get canvas size', function() {
            var width = 0;
            var height = 0;
            var rtnValue = [];
            engine.setCanvasSize(800, 600);

            rtnValue = engine.getCanvasSize();
            width = rtnValue[0];
            height = rtnValue[1];

            expect(rtnValue.length).toBe(2);
            expect(width).toBe(800);
            expect(height).toBe(600);
        });

        it('should append canvas to element', function() {
            engine.appendCanvasToElement('gameboard');
            expect('#gameboard').toBeInDOM();
            expect('canvas').toBeInDOM();
        });
    });

    it('calls the render function', function() {
        spyOn(engine, 'render');
        engine.main();
        expect(engine.render).not.toHaveBeenCalled();
        engine.toggleRunning();
        engine.main();
        expect(engine.render).toHaveBeenCalled();
    });

    it('entities should be of type array', function() {
        var type = Array.isArray(engine.entities);
        expect(type).toBe(true);
    });
});


