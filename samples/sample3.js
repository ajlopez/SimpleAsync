var async = require('..');

async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        throw "Houston, we have a problem";
    })
    .error(function (err) {
        console.log('error:', err);
    });
