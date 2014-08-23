
function SimpleStep(step, fn) {
    var failfn = null;
    
    this.run = function (data, cbok, cbfail) {
        if (step)
            step.run(data, function (newdata) {
                var result = fn(newdata);
                cbok(result);
            }, function (err) {
                if (failfn)
                    failfn(err);
                else if (cbfail)
                    cbfail(err);
                else
                    throw err;
            });
        else {
            var result = fn(data);
            cbok(result);
        }
    }
    
    function dostep(step, data, cbok, cbfail) {
        step.run(data, function (newdata) {
            dofn(newdata, cbok, cbfail);
        }, function (err) {
            doerror(err, cbfail);
        });
    }
    
    function dofn(data, cbok, cbfail) {
        try {
            var result = fn(data);
            cbok(result);
        }
        catch (err) {
            doerror(err, cbfail);
        }
    }
    
    function doerror(err, cbfail) {
        if (failfn)
            failfn(err);
        else if (cbfail)
            cbfail(err);
        else
            throw err;
    }
}

function Runner(fns, failfn) {
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

                var fnl = fn.length;
                var objcount = { count: 0 };
                
                for (var j = 0; j < fnl; j++) {
                    var sfn = fn[j];
                    
                    if (sfn.length > 1) {
                        sfn(data, makecb(j, objcount, fnl));
                    }
                    else {
                        newdata[j] = sfn(data);
                        objcount.count++;
                    }
                }
      
                if (objcount.count >= fnl) {
                    data = newdata;
                    setImmediate(doStep);
                }
                
                function makecb(nbucket, objcount, maxcount) {
                    return function (err, newd) {
                        if (err) {
                            failfn(err);
                            return;
                        }
                        
                        newdata[nbucket] = newd;
                        objcount.count++;
                        
                        if (objcount.count >= maxcount) {
                            data = newdata;
                            setImmediate(doStep);
                        }
                    }
                }                

                return;
            }
            
            if (typeof fn == 'object' && fn.map) {
                var newdata = [];
                
                if (fn.map.length > 1) {
                    var count = 0;
                    var dl = data.length;
                    
                    if (!dl) {
                        data = [];
                        setImmediate(doStep);
                        return;
                    }
                    
                    for (var n in data)
                        fn.map(data[n], makecbmap(n));
                        
                    function makecbmap(n) {
                        return function (err, newvalue) {
                            if (err) {
                                failfn(err);
                                return;
                            }
                            
                            newdata[n] = newvalue;
                            count++;
                            
                            if (count >= dl) {
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
                        failfn(err);
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
            failfn(err);
            return;
        }
    }
}

function Sequence() {
    var fns = [];

    var failfn = function (err) {
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

    this.fail = function (fn) {
        failfn = fn;
        return this;
    }

    this.run = function (data) {
        var runner = new Runner(fns, failfn);   
        setImmediate(runner.run(data));

        return this;
    }
}

function createSequence() {
    return new Sequence();
}

module.exports = createSequence;
