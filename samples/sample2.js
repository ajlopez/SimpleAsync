var async = require('..');

async()
    .exec(function (next) { next(null, 10); })
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1);
    })
    .then(function (data, next) {
        console.log(data);
    });
