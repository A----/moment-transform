(function () {
'use strict';

var momentLib;
if (typeof moment !== 'undefined') {
  momentLib = moment;
}
else if (typeof require !== 'undefined') {
  momentLib = require('moment');
}
else {
  throw new Error('Moment is not defined.');
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

  var defaultPatterns = ['YYYY-MM-DD HH:mm:ss.SSS', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'HH:mm:ss.SSS', 'HH:mm:ss'],
      tokenRE = /([A-Za-z])\1*/g,
      unitMapping = {
        "y": "y", // year
        "Y": "y", // year
        "Q": "Q", // quarter
        "M": "M", // month
        "w": "w", // weeks
        "W": "w", // weeks
        "m": "m", // minutes
        "s": "s", // seconds
        "S": "ms" // milliseconds
      },
      unitMappingAddSubtract = {
        "d": "d", // days
        "D": "d", // days
      },
      unitMappingSet = {
        "d": "D", // days
        "D": "D", // days
      };

  var getUnit = function(token, set1, set2) {
      return set1[token] || set2[token] || moment.normalizeUnits(token);
    };

  // Try a pattern (String) on a value with the specified Moment object.
  // Returns the modified momentObject if it succeeded or null if it didn't.
  var tryPattern = function (momentObject, value, pattern, strict) {
    var tokens,
        token,
        tokenValues,
        tokenValue,
        expandedTokenValue;

    // If not strict, set non-alpha characters optional.
    if (!strict) {
      pattern = pattern.replace(/(\\?\W)/g, '(?:$1)?');
    }

    // Extract tokens, e.g. "YYYY"
    tokens = pattern.match(tokenRE);

    pattern = pattern.replace(tokenRE, '($1+|[+-]?\\d+)');

    tokenValues = value.match(new RegExp('^' + pattern + '$'));
    if (tokenValues) {
      for (var j = 0; j < tokens.length; j++) {
        token = tokens[j][0];
        tokenValue = tokenValues[j + 1];
        expandedTokenValue = tokenValue.match(/([+-]?)(\d+)/);

        if (expandedTokenValue) {
          if (expandedTokenValue[1] === '+') {
            momentObject.add(expandedTokenValue[2], getUnit(token, unitMappingAddSubtract, unitMapping));
          }
          else if (expandedTokenValue[1] === '-') {
            momentObject.subtract(expandedTokenValue[2], getUnit(token, unitMappingAddSubtract, unitMapping));
          }
          else {
            var unit = getUnit(token, unitMappingSet, unitMapping),
                number;
            if (unit === 'M') {
              number = expandedTokenValue[2] - 1;
            }
            else {
              number = expandedTokenValue[2];
            }
            momentObject.set(unit, number);
          }
        }
      }

      return momentObject;
    }

    return null;
  };

  moment.fn.transform = function(value, oPatterns, oStrict) {
    var patterns = oPatterns || defaultPatterns,
        strict = oStrict || false,
        pattern;

    if (!util.isArray(patterns)) {
      patterns = [ patterns ];
    }

    for (var i = 0; i < patterns.length; i++) {
      pattern = util.escapeRE(patterns[i]);

      var momentObject = tryPattern(this, value, pattern, strict);
      if(momentObject) {
        return momentObject;
      }
    }

    return moment.invalid();
  };

})(momentLib);


}());
