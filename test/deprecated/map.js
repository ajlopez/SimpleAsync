
var async = require('../..');

exports['map and then'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .map(function (item) {
            return item * item;
        })
        .then(function (data) {
            test.ok(data);
            test.ok(Array.isArray(data));
            test.equal(data.length, 3);
            test.equal(data[0], 1);
            test.equal(data[1], 4);
            test.equal(data[2], 9);

            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run([1,2,3]), seq);
}

exports['map with async fn and then'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .map(function (item, next) {
            next(null, item * item);
        })
        .then(function (data) {
            test.ok(data);
            test.ok(Array.isArray(data));
            test.equal(data.length, 3);
            test.equal(data[0], 1);
            test.equal(data[1], 4);
            test.equal(data[2], 9);

            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run([1,2,3]), seq);
}

exports['map empty array with async fn and then'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .map(function (item, next) {
            next(null, item * item);
        })
        .then(function (data) {
            test.ok(data);
            test.ok(Array.isArray(data));
            test.equal(data.length, 0);

            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run([]), seq);
}

exports['map with error'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async()
        .map(function (item, next) {
            if (item == 2)
                next("error", null);
            else
                next(null, item * item);
        })
        .then(function (data) {
            test.fail();
        })
        .fail(function (err) {
            test.equal(err, "error");

            test.done();
        });
    
    test.ok(seq);
    test.strictEqual(seq.run([1,2,3]), seq);
}

