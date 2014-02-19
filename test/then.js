
var async = require('..');

exports['then one step'] = function (test) {
    test.async();
    
    var total;
    
    var seq = async().then(function (data) {
        total += data;
        
        test.equal(total, 10);
        test.done();
    });
    
    test.ok(seq);
    seq.run(10);
}