
var async = require('..');

exports['then one step'] = function (test) {
    test.async();
    
    var total = 0;
    
    var seq = async().then(function (data) {
        total += data;
        
        test.equal(total, 10);
        test.done();
    });
    
    test.ok(seq);
    test.strictEqual(seq.run(10), seq);
}