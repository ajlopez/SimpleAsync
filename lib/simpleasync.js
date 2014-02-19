
function Sequence() {
    var fns = [];
    
    var elsefn = function (err) {        throw err;
    }
    
    this.then = function (fn) {
        fns.push(fn);
        return this;
    }
    
    this.else = function (fn) {
        elsefn = fn;
        return this;
    }
    
    this.run = function (data) {
        setImmediate(function () {
            var k = 0;            
            var l = fns.length;
            
            doStep();
            
            function doStep() {
                if (k >= l)
                    return;
                    
                var fn = fns[k++];
                
                try {
                    if (fn.length > 1) {
                        fn(data, function (err, newdata) {
                            if (err) {
                                elsefn(err);
                                return;
                            }
                            
                            data = newdata;
                            setImmediate(doStep);
                        });
                    }
                    else {                                       data = fn(data);                        setImmediate(doStep);
                    }
                }
                catch (err) {                    elsefn(err);
                    return;
                }
            }
        });
        
        return this;
    }
}

function createSequence() {
    return new Sequence();
}

module.exports = createSequence;