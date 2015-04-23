
describe('moment-transform', function() {

  var momentEquality = function (first, second) {
    if(moment.isMoment(first) && moment.isMoment(second)) {
      return first.isSame(second);
    }
  };

  var momentMatchers = {
    toBeMoment: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var momentActual = moment(actual, 'YYYY-MM-DD HH:mm:ss'),
              momentExpected = moment(expected,'YYYY-MM-DD HH:mm:ss');

          var result = {};
          result.pass = util.equals(momentActual, momentExpected, customEqualityTesters);
          result.message = "Expected " + momentActual.format('YYYY-MM-DD HH:mm:ss') + " to be " + momentExpected.format('YYYY-MM-DD HH:mm:ss');
          return result;
        }
      }
    },
    toBeValidMoment: function(util, customEqualityTesters) {
      return {
        compare: function(actual) {
          var momentActual = moment(actual, 'YYYY-MM-DD HH:mm:ss');

          var result = {};
          result.pass = momentActual.isValid();
          result.message = "Expected " + momentActual.format('YYYY-MM-DD HH:mm:ss') + " to be valid";
          return result;
        }
      }
    }
  }

  beforeEach(function() {
    jasmine.addCustomEqualityTester(momentEquality);
    jasmine.addMatchers(momentMatchers);
  });

  it('defines a transform method', function() {
    expect(moment).toBeDefined();
    expect(moment().transform).toBeDefined();
  });

  it('operates valid non-strict transformations', function() {
    var testValue = function () { return moment('2000-10-05 04:30:20'); };

    expect(testValue().transform("YYYY-MM-DD 00:00:00")).toBeMoment('2000-10-05 00:00:00');
    expect(testValue().transform("YYYY-MM-01 00:00:00")).toBeMoment('2000-10-01 00:00:00');
    expect(testValue().transform("YYYY-+01-01 00:00:00")).toBeMoment('2000-11-01 00:00:00');
    expect(testValue().transform("YYYY--01-01 00:00:00")).toBeMoment('2000-09-01 00:00:00');
  });

  it('operates valid strict transformations', function() {
    var testValue = function () { return moment('2000-10-05 04:30:20'); };

    expect(testValue().transform("YYYY-MM-DD 00:00:00", undefined, true)).toBeMoment('2000-10-05 00:00:00');
    expect(testValue().transform("YYYY-MM-01 00:00:00", undefined, true)).toBeMoment('2000-10-01 00:00:00');
    expect(testValue().transform("YYYY-+01-01 00:00:00", undefined, true)).toBeMoment('2000-11-01 00:00:00');
    expect(testValue().transform("YYYY--01-01 00:00:00", undefined, true)).toBeMoment('2000-09-01 00:00:00');
  });

  it('allows non-strict transformations with non-strict values', function() {
    var testValue = function () { return moment('2000-10-05 04:30:20'); };

    expect(testValue().transform("YYYYMMDD00:00:00")).toBeMoment('2000-10-05 00:00:00');
    expect(testValue().transform("YYYYMM-01 HH+30:00")).toBeMoment('2000-10-01 05:00:00');
  });

  it('doesn\'t allow strict transformations with non-strict values', function() {
    var testValue = function () { return moment('2000-10-05 04:30:20'); };

    expect(testValue().transform("YYYYMMDD00:00:00", undefined, true)).not.toBeValidMoment();
    expect(testValue().transform("YYYYMM-01 HH+30:00", undefined, true)).not.toBeValidMoment();
  });

  it('handles invalid moment objects', function() {
    expect(moment.invalid().transform("YYYYMMDD00:00:00", undefined, true)).not.toBeValidMoment();
  });

  it('handles custom patterns', function() {
    var testValue = function () { return moment('2000-10-05 04:30:20'); };
    // w = Week of year
    expect(testValue().transform("+1 +3", 'w HH', true)).toBeMoment('2000-10-12 07:30:20');
    expect(testValue().transform("+1 +3", ['w HH'], true)).toBeMoment('2000-10-12 07:30:20');
  });
});
