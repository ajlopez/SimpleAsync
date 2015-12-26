
var async = require('..');

exports['exec injecting async data'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .exec(function (next) { next(null, 10); })
        .then(function (data) {
            total += data;
            
            test.equal(total, 10);
            test.done();
        });
    
    test.ok(seq);
}

exports['exec raising error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .exec(function (next) { throw "error"; })
        .then(function (data, next) {
            test.fail();
        })
        .error(function (err) {
            test.ok(err);
            test.equal(err, "error");
            test.done();            
        });
    
    test.ok(seq);
}

exports['exec generate error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .exec(function (next) { next("error"); })
        .then(function (data, next) {
            test.fail();
        })
        .error(function (err) {
            test.ok(err);
            test.equal(err, "error");
            test.done();            
        });
    
    test.ok(seq);
}
