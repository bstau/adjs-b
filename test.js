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
