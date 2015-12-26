var async = require('..');

async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        next("Houston, we have a problem", null);
    })
    .error(function (err) {
        console.log('error:', err);
    })
