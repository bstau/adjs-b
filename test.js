/* Testing predicate: used to validate an array-based test result.
 */
var testThat = function(name, result) {
    console.info('Testing: ' + name + ': ' + (result ? 'pass' : 'FAIL'));
};

/* Convert a hex message string into a Uint8Array.
 *
 * For example, fromHexBuf("00AAB411").
 */
var fromHexBuf = function(s) {
  if (s.length % 2 != 0) throw "Bad input.";

  var a = new Uint8Array(s.length / 2);

  for (var i = 0; i < a.length; ++i) {
    a[i] = Number.parseInt(s.substr(i * 2, 2), 16);
  }
  return a;
};

function assertEqual(test, expected, actual) {
    /* Check for array equality. */
    if (expected['keys']) {
        var arrayOK = assertEqual(test + ' array length',
                                  expected.length, actual.length);
        if (!arrayOK) return arrayOK;

        var equality = expected.map(function(value, idx) {
            return assertEqual(test + '[' + idx + ']', value, actual[idx]);
        });

        if (!equality.every(function(i) { return i; })) {
            console.error('Checking ' + test + ', not all elements matched.');
            return false;
        }
        return true;
    }

    if (expected !== actual) {
        var hexSuffix = (typeof(actual) == typeof(1)) ?
            (' (0x' + actual.toString(16) + ')') : '';

        console.error('Checking ' + test + ', expected ' + expected + ', got ' +
                      actual + hexSuffix);
    }

    return expected === actual;
}
