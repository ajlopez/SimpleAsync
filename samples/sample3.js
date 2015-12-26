var async = require('./lib/simpleasync');

async()
    .then(function (data) {
        console.log(data);
        throw "Houston, we have a problem";
    })
    .fail(function (err) {
        console.log('error:', err);
    })
    .run(10);