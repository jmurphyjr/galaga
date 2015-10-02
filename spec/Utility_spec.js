describe('variable Integer', function() {

    /**
     * Execute function 1000 times to provide sufficient
     * confidence the function works as expected.
     */
    it('should return integer number between 1 and 10', function() {
        var x;
        for (var i = 0; i < 1000; i++) {
            x = variableInteger(10,1);
            expect(x >= 1 && x <= 10).toBeTruthy();
        }
    });

    /**
     * Execute function 1000 times to provide sufficient
     * confidence the function works as expected.
     */
    it('should return integer number between 10 and 100', function() {
        var x;
        for (var i = 0; i < 1000; i++) {
            x = variableInteger(100, 10);
            expect(x >=10 && x <= 100).toBeTruthy();
        }
    });

});

describe('Bezier Curve Point', function() {

    var cp1;
    var cp2;
    var cp3;
    var cp4;
    var t;

    /**
     * Establish points to be used in tests.
     */
    beforeEach(function() {
        cp1 = new app.Point(1,0);
        cp2 = new app.Point(100,100);
        cp3 = new app.Point(200,250);
        cp4 = new app.Point(100,0);
        t = 0;
    });

    it('should return cp1 when t is zero cubic bezier curve', function() {
        t = 0;
        var point = bezierPoint(cp1, cp2, cp3, cp4, t);
        expect(point.x === cp1.x && point.y ===cp1.y).toBe(true);
    });

    it('should return cp4 when t is one cubic bezier curve', function() {
        t = 1;
        var point = bezierPoint(cp1, cp2, cp3, cp4, t);
        expect(point.x === cp4.x && point.y ===cp4.y).toBe(true);
    });

    it('should return cp1 when t is zero quadratic bezier curve', function() {
        t = 0;
        var point = bezierPoint(cp1, cp2, cp3, t);
        expect(point.x === cp1.x && point.y ===cp1.y).toBe(true);
    });

    it('should return cp3 when t is one quadratic bezier curve', function() {
        t = 1;
        var point = bezierPoint(cp1, cp2, cp3, t);
        expect(point.x === cp3.x && point.y ===cp3.y).toBe(true);
    });

});