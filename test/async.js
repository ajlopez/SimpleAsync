
var async = require('..');

exports['create async sequence'] = function (test) {
    var seq = async();
    
    test.ok(seq);
}