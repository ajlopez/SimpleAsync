
var async = require('..');

exports['then with else'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .then(function (data) {
            total += data;
            throw "total error";
        })
        .else(function (err) {
            test.ok(err);
            test.equal(err, "total error");
            test.done();            
        });
    
    test.ok(seq);
    test.strictEqual(seq.run(10), seq);
}

exports['then with async step and else'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .then(function (data, next) {
            total += data;
            
            next("total error", null);
        })
        .else(function (err) {
            test.ok(err);
            test.equal(err, "total error");
            test.done();            
        });
    
    test.ok(seq);
    test.strictEqual(seq.run(10), seq);
}
