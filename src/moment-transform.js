if (typeof require !== 'undefined') {
  var moment = require('moment');
}

(function(moment) {

  var util = {
    isArray: function(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    },
    escapeRE: function(re) {
      return re.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    }
  };

  var defaultPatterns = ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss'],
      tokenRE = /([A-Za-z])\1*/g;

  moment.fn.transform = function(value, patterns, strict) {
    var patterns = patterns || defaultPatterns,
        strict = strict || false,
        pattern,
        tokens,
        token,
        tokenValues,
        tokenValue,
        expandedTokenValue;

    if (!util.isArray(patterns)) {
      patterns = [ patterns ];
    }

    for (var i = 0; i < patterns.length; i++) {
      pattern = util.escapeRE(patterns[i]);

      // If not strict, set non-alpha characters optional.
      if (!strict) {
        pattern = pattern.replace(/(\W)/g, '(?:$1)?');
      }

      // Extract tokens, e.g. "YYYY"
      tokens = pattern.match(tokenRE);

      pattern = pattern.replace(tokenRE, '($1+|[+-]?\\d+)');

      tokenValues = value.match(new RegExp('^' + pattern + '$'));
      if (tokenValues) {
        for (var j = 0; j < tokens.length; j++) {
          token = moment.normalizeUnits(tokens[j][0]);
          tokenValue = tokenValues[j + 1];
          expandedTokenValue = tokenValue.match(/([+-]?)(\d+)/);

          if (expandedTokenValue) {
            if (expandedTokenValue[1] === '+') {
              this.add(expandedTokenValue[2], token);
            }
            else if (expandedTokenValue[1] === '-') {
              this.subtract(expandedTokenValue[2], token);
            }
            else {
              this.set(token, expandedTokenValue[2]);
            }
          }
        }

        return this;
      }
    }

    return moment.invalid();
  };

})(moment);
