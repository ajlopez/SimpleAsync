var async = require('..');

async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1);
    })
    .then(function (data, next) {
        console.log(data);
    });
