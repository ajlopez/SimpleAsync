var async = require('./lib/simpleasync');

async()
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1); // callback(err, newdata);
    })
    .then(function (data) {
        console.log(data);
    })
    .run(10);
