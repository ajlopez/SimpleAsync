var async = require('./lib/simpleasync');

async()
    .then(function (data, next) {
        console.log(data);
        next("Houston, we have a problem", null);
    })
    .catch(function (err) {
        console.log('error:', err);
    })
    .run(10);
