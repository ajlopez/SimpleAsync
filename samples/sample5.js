var async = require('./lib/simpleasync');

async()
    .do(function (data) { return data + 1; })
    .do(function (data) { return data + 2; })
    .do(function (data) { return data + 3; })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
