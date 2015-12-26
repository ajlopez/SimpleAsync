# SimpleAsync

Simple library to chain and run functions with asynchronous calls.

## Installation

Via npm on Node:

```
npm install simpleasync
```

## Usage

Reference in your program:

```js
var async = require('simpleasync');
```

In the following samples, `next` is a function `function (err, data)...`

Define and run steps with data and then:
```js
async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1);
    })
    .then(function (data, next) {
        console.log(data);
    });
```

Expected output
```
10
11
```

Use exec to inject asynchronous data:
```js
async()
    .exec(function (next) { next(null, 10); })
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1);
    })
    .then(function (data, next) {
        console.log(data);
    });
```

Expected output
```
10
11
```

Use `error` for catch errors:
```js
async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        throw "Houston, we have a problem";
    })
    .error(function (err) {
        console.log('error:', err);
    });
```

Expected output
```
10
error: Houston, we have a problem
```

Raise an error in an step with callback
```js
async()
    .data(10)
    .then(function (data, next) {
        console.log(data);
        next("Houston, we have a problem", null);
    })
    .error(function (err) {
        console.log('error:', err);
    })
```

Expected output
```
10
error: Houston, we have a problem
```

`do` function generate an element of an array, to be received by the next `then` or `map` in sequence:
```js
async()
    .data(1)
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .then(function (data) {
        console.dir(data);
    });
```

Expected output
```
[ 2, 3, 4 ]
```

`map` take each element of the previous array and generate a new element
```js
async()
    .data(1)
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .map(function (data, next) { next(null, data * 3); })
    .then(function (data) {
        console.dir(data);
    });
```

Expected output
```
[ 6, 9, 12 ]
```

The asynchronous functions accepted by a consecutive series of `do` are executed with concurrency. The data collected
by the functions are assembled in an array, that is the data feeded into the next step.


## Development

```
git clone git://github.com/ajlopez/SimpleAsync.git
cd SimpleAsync
npm install
npm test
```

## To do

- `map` accepting async functions

## Samples

TBD

## Versions

- 0.0.1: Published
- 0.0.2: Published
- 0.0.3: Published. do with sync and async functions. map async function support
- 0.0.4: Published, fail function
- 0.0.5: Published, fix async map with empty array
- 0.0.6: Published, use setTimeout instead setImmediate
- 0.0.7: Published, improved do implementation, engine versions updated
- 0.0.8: Published, fail and run deprecated, new data method, removing support for sync functions, autorun, exec method to inject async data

## License

MIT

## References
## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleAsync) and submit
[pull requests](https://github.com/ajlopez/SimpleAsync/pulls) — contributions are
welcome<

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

