
var async = require('..');

exports['do two functions'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .do(function (data) { return data + 1; })
        .do(function (data) { return data + 2; })
        .then(function (data) {
            test.ok(data);
            test.ok(Array.isArray(data));
            test.equal(data.length, 2);
            test.equal(data[0], 2);
            test.equal(data[1], 3);
            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run(1), seq);
}

exports['do two async functions'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .do(function (data, next) { next(null, data + 1); })
        .do(function (data, next) { next(null, data + 2); })
        .then(function (data) {
            test.ok(data);
            test.ok(Array.isArray(data));
            test.equal(data.length, 2);
            test.equal(data[0], 2);
            test.equal(data[1], 3);
            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run(1), seq);
}

exports['do two async functions with error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .do(function (data, next) { next(null, data + 1); })
        .do(function (data, next) { next('error'); })
        .then(function (data) {
            test.fail();
        })
        .fail(function (err) {
            test.ok(err);
            test.equal(err, 'error');
            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run(1), seq);
}

