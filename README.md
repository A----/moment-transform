# moment-transform
A plugin for Moment.js that allows date transformation from a pattern.

## Usage

First, download the plugin by:
* cloning this repository,
* use `npm` or `bower`,
* checking the `dist/` folder.

Include it in your website/app (after moment if you don't use `require`).

Then:

```javascript
var tomorrow = moment().transform('YYYY-MM-+01');
var midnightTonight = moment().transform('YYYY-MM-+01 00:00:00.000');
var breakfirstTimeToday = moment().transform('07:30:00');

// Optional pattern argument
tomorrow = moment().transform('+01/MM/YYYY', 'DD/MM/YYYY');
// Multiple patterns, take the first that fits
midnightTonight = moment().transform('+01/MM/YYYY 00:00:00.000', ['DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss.SSS']);

// Optional strict argument
tomorrow = moment().transform('+01MMYYYY', 'DD/MM/YYYY', false); // this works
var invalid = moment().transform('+01MMYYYY', 'DD/MM/YYYY', true); // this will return an invalid date.
invalid.isValid(); // false
breakfirstTimeToday = moment().transform('07:30:00', undefined, true); // with default patterns
```

## Options

`transform()` takes up to three arguments:
* `value`: value to be checked against the pattern,
* `patterns` (optional): a string or an array of strings. Check [`format()` documentation](http://momentjs.com/docs/#/displaying/format/) for syntax. Default value is `['YYYY-MM-DD HH:mm:ss.SSS', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss.SSS', 'HH:mm:ss']`.
* `strict` (optional): non-alphabetic characters in patterns are not mandatory when not strict. Default is `false`.

## Contributing

Fork the repository and do a `npm install`.

You can check your code is correct by doing a `grunt test`.

When you're done, do a `grunt build`.
