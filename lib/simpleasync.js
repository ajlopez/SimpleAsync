
function Runner(fns, catchfn) {
    var k = 0;            
    var l = fns.length;
    
    var data = null;
    
    this.run = function (initialdata) {
        data = initialdata;
        doStep();
    }

    function doStep() {
        if (k >= l)
            return;
            
        var fn = fns[k++];
        
        try {
            if (Array.isArray(fn)) {
                var newdata = [];
                var fnl = fn.length;                var objcount = { count: 0 };                
                for (var j = 0; j < fnl; j++) {                    var sfn = fn[j];                                        if (sfn.length > 1) {                        sfn(data, makecb(j, objcount, fnl));                    }                    else {
                        newdata[j] = fn[j](data);                        objcount.count++;                    }                }
                                    if (objcount.count >= fnl) {
                    data = newdata;
                    setImmediate(doStep);                }                                function makecb(nbucket, objcount, count) {                    return function (err, newd) {                        if (err) {                            catchfn(err);                            return;                        }                                                newdata[nbucket] = newd;                        objcount.count++;                                                if (objcount.count >= count) {                            data = newdata;                            setImmediate(doStep);                        }                    }                }                
                return;
            }
            
            if (typeof fn == 'object' && fn.map) {
                var newdata = [];
                
                if (fn.map.length > 1) {
                    var count = 0;
                    var l = data.length;
                    
                    for (var n in data)
                        fn.map(data[n], makecb(n));
                        
                    function makecb(n) {
                        return function (err, newvalue) {
                            if (err) {
                                catchfn(err);
                                return;
                            }
                            
                            newdata[n] = newvalue;
                            count++;
                            
                            if (count >= l) {
                                data = newdata;
                                setImmediate(doStep);
                            }   
                        }
                    }
                    
                    return;
                }
                
                for (var n in data)
                    newdata[n] = fn.map(data[n]);
                
                data = newdata;
                setImmediate(doStep);
                
                return;
            }
            
            if (fn.length > 1) {
                fn(data, function (err, newdata) {
                    if (err) {
                        catchfn(err);
                        return;
                    }
                    
                    data = newdata;
                    setImmediate(doStep);
                });
            }
            else {               
                data = fn(data);
                setImmediate(doStep);
            }
        }
        catch (err) {
            catchfn(err);
            return;
        }
    }
}


function Sequence() {
    var fns = [];

    var catchfn = function (err) {
        throw err;
    }

    this.then = function (fn) {
        fns.push(fn);
        return this;
    }
    
    this.map = function (fn) {
        fns.push({ map: fn });
        return this;
    }
    
    this.do = function (fn) {
        if (fns.length == 0 || !Array.isArray(fns[fns.length-1]))
            fns.push([fn]);
        else
            fns[fns.length-1].push(fn);
        return this;
    }

    this.catch = function (fn) {
        catchfn = fn;
        return this;
    }

    this.run = function (data) {
        var runner = new Runner(fns, catchfn);   
        setImmediate(runner.run(data));

        return this;
    }
}



function createSequence() {
    return new Sequence();
}

module.exports = createSequence;
