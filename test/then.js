
var async = require('..');

exports['then one step'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .data(10)
        .then(function (data) {
            total += data;
            
            test.equal(total, 10);
            test.done();
        });
    
    test.ok(seq);
}

exports['then with two sync steps'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .data(6)
        .then(function (data) {
            total += data;
            return data;
        })
        .then(function (data) {
            total += data;
            
            test.equal(total, 12);
            test.done();
        });
    
    test.ok(seq);
}

exports['then with one async step and one sync step'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .data(6)
        .then(function (data, next) {
            total += data;
            setImmediate(function () {
                next(null, data);
            });
        })
        .then(function (data) {
            total += data;
            
            test.equal(total, 12);
            test.done();
        });
    
    test.ok(seq);
}

