var async = require('./lib/simpleasync');

async()
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .map(function (data) { return data * 3; })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
