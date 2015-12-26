var async = require('./lib/simpleasync');

async()
    .then(function (data) {
        console.log(data);
        return data + 1;
    })
    .then(function (data) {
        console.log(data);
    })
    .run(10);
