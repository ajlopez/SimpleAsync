var async = require('..');

async()
    .data(1)
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .then(function (data) {
        console.dir(data);
    });
