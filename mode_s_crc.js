/* Routines to perform a CRC on a Mode S Message.
 */

/* The generator is 25 bits. */
var CRC_GEN_LENGTH = 25;  

/* The CRC generator, left-justified. */
var CRC_GEN = Uint8Array.from([0xFF, 0xFA, 0x04, 0x80]);


function ModeSCRC(message, encode) {
  var bitlen = message.length * 8;
  var data = Uint8Array.from(message);

  // Helper function to extract a bit from the message.
  var bit = function(a, i) {
    return (a[i >> 3] & (1 << (7 - (i & 0x7)))) ? 1 : 0;
  }

  // Helper function to set a bit in the message.
  var setbit = function(a, i, v) {
    if (v) {
      a[i >> 3] |= (1 << (7 - (i & 0x7)));
    } else {
      a[i >> 3] &= ~(1 << (7 - (i & 0x7)));
    }
  }

  // If encoding, blank out the current CRC.
  if (encode) {
    data[message.length - 3] = data[message.length - 2] =
      data[message.length - 1] = 0;
  }

  // Use the generator to xor the message.
  for (var i = 0; i < bitlen - 24; ++i) {
    if (bit(data, i)) {
      for (var j = 0; j < CRC_GEN_LENGTH; ++j) {
        setbit(data, i + j, bit(data, i + j) ^ bit(CRC_GEN, j));
      }
    }
  }

  var crc = data[message.length - 3] << 16 | data[message.length - 2] << 8 | data[message.length - 1];

  return crc;
}
