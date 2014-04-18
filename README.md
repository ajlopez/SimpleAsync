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

Define and run steps with then:
```js
async()
    .then(function (data) {
        console.log(data);
        return data + 1;
    })
    .then(function (data) {
        console.log(data);
    })
    .run(10);
```

Expected output
```
10
11
```

Define and run steps with one step using a callback. Then, you can write async steps:
```js
async()
    .then(function (data, next) {
        console.log(data);
        next(null, data + 1); // callback(err, newdata);
    })
    .then(function (data) {
        console.log(data);
    })
    .run(10);
```

Expected output
```
10
11
```

Use catch for catch errors:
```js
async()
    .then(function (data) {
        console.log(data);
        throw "Houston, we have a problem";
    })
    .catch(function (err) {
        console.log('error:', err);
    })
    .run(10);
```

Expected output
```
10
error: Houston, we have a problem
```

Raise an error in an step with callback
```js
async()
    .then(function (data, next) {
        console.log(data);
        next("Houston, we have a problem", null);
    })
    .catch(function (err) {
        console.log('error:', err);
    })
    .run(10);
```

Expected output
```
10
error: Houston, we have a problem
```

`do` function generate an element of an array, to be received by the next `then` or `map` in sequence:
```js
async()
    .do(function (data) { return data + 1; })
    .do(function (data) { return data + 2; })
    .do(function (data) { return data + 3; })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
```

Expected output
```
[ 2, 3, 4 ]
```

`map` take each element of the previous array and generate a new element
```js
async()
    .do(function (data) { return data + 1; })
    .do(function (data) { return data + 2; })
    .do(function (data) { return data + 3; })
    .map(function (data) { return data * 3; })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
```

Expected output
```
[ 6, 9, 12 ]
```

`do` accepts function with callback:
```js
async()
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .map(function (data) { return data * 3; })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
```

Expected output
```
[ 6, 9, 12 ]
```

`map` accepts function with callback, too:
```js
async()
    .do(function (data, next) { next(null, data + 1); })
    .do(function (data, next) { next(null, data + 2); })
    .do(function (data, next) { next(null, data + 3); })
    .map(function (data, next) { next(null, data * data); })
    .then(function (data) {
        console.dir(data);
    })
    .run(1);
```

Expected output
```
[ 4, 9, 16 ]
```

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

## License

MIT

## References
## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleAsync) and submit
[pull requests](https://github.com/ajlopez/SimpleAsync/pulls) — contributions are
welcome<

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

