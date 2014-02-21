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

## Development

```
git clone git://github.com/ajlopez/SimpleAsync.git
cd SimpleAsync
npm install
npm test
```

## Samples

TBD

## Versions

- 0.0.1: Published

## License

MIT

## References
## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleAsync) and submit
[pull requests](https://github.com/ajlopez/SimpleAsync/pulls) — contributions are
welcome<

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

