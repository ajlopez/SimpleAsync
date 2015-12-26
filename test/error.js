
var async = require('..');

exports['then with error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .data(10)
        .then(function (data) {
            total += data;
            throw "total error";
        })
        .error(function (err) {
            test.ok(err);
            test.equal(err, "total error");
            test.done();            
        });
    
    test.ok(seq);
}

exports['then with async step and error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .data(10)
        .then(function (data, next) {
            total += data;
            
            next("total error", null);
        })
        .error(function (err) {
            test.ok(err);
            test.equal(err, "total error");
            test.done();            
        });
    
    test.ok(seq);
}
