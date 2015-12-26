
function SimpleStep(step, fn) {
    var failfn = null;
    
    this.run = function (data, cbok, cbfail) {
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
                var objcount = { count: 0, errors: 0 };
                
                for (var j = 0; j < fnl; j++) {
                    var sfn = fn[j];
                    
                    sfn(data, makecb(j, objcount, fnl));
                }
      
                if (objcount.count >= fnl) {
                    data = newdata;
                    setImmediate(doStep);
                }
                
                function makecb(nbucket, objcount, maxcount) {
                    return function (err, newd) {
                        if (err) {
                            objcount.errors++;
                            
                            if (objcount.errors == 1)
                                failfn(err);
                                
                            return;
                        }
                        
                        newdata[nbucket] = newd;
                        objcount.count++;
                        
                        if (objcount.count >= maxcount && !objcount.errors) {
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
                                setTimeout(doStep, 0);
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

function Sequence(options) {
    var fns = [];
    options = options || {};
    var data = null;
    var running = false;
    var self = this;

    var failfn = function (err) {
        throw err;
    }
    
    function launch() {
        if (running)
            return;
        if (options.autorun === false)
            return;
        
        run(data);
    }

    function run(dt) {
        data = dt;
        
        if (running)
            return this;
        
        running = true;
        
        setImmediate(function () { 
            var runner = new Runner(fns, failfn);   
            runner.run(data);
        });

        return this;
    }
    
    this.data = function (dt) {
        data = dt;
        return this;
    }

    this.then = function (fn) {
        fns.push(fn);
        launch();
        return this;
    }
    
    this.map = function (fn) {
        fns.push({ map: fn });
        launch();
        return this;
    }
    
    this.do = function (fn) {
        if (fns.length === 0 || !Array.isArray(fns[fns.length-1]))
            fns.push([fn]);
        else
            fns[fns.length-1].push(fn);
        return this;
    }

    this.error = function (fn) {
        failfn = fn;
        launch();
        return this;
    }
    
    this.fail = function (fn) {
        console.log('fail method is deprecated, use error method');
        return this.error(fn);
    }
    
    this.run = function (dt) {
        console.log('run method is deprecated, use data method');
        return this.data(dt);
    }
}

function createSequence(options) {
    return new Sequence(options);
}

module.exports = createSequence;
