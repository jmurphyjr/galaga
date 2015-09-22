describe('variable Integer', function() {

    it('should return integer number between 1 and 10', function() {
        var x = variableInteger(10,1);

        expect(x >= 1 && x <= 10).toBeTruthy();
    });

    it('should return integer number between 10 and 100', function() {
        var x = variableInteger(100, 10);

        expect(x >=10 && x <= 100).toBeTruthy();
    });

});

