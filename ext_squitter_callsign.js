/** Decode a callsign from a 6-bit-per-character encoding.
 *
 * @param {Uint8Array} Extended squitter payload
 */
function decodeCallsign(payload) {
    if (payload.length !== 6) {
        throw "Encoded callsign value must be 6 bytes.";
    }

    var table = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_ !"#$%&\'()*+,-./0123456789:;<=>?';

    /* Extract the callsign characters. */
    return [0,1,2,3,4,5,6,7].map(function(i) {
        /* Determine which bit/byte to start with */
        var bitOffset = i * 6;
        var byteOffset = Math.floor(bitOffset / 8);
        /* And the offset/length within that byte. */
        var bitStart = bitOffset - (byteOffset * 8);
        var bitsFromFirst = Math.min(6, 8 - bitStart);
        var bitsFromSecond = 6 - bitsFromFirst;
        var bitsToDrop = 8 - bitsFromSecond;

        var sixBitChar = payload[byteOffset] & ((1 << (8 - bitStart)) - 1);
        sixBitChar >>= Math.max(0, 8 - (bitsFromFirst + bitStart));

        /* And if we need to snarf follow-up bits from a second char.. */
        if (bitsFromFirst < 6) {
            sixBitChar <<= bitsFromSecond;
            sixBitChar |= (payload[byteOffset + 1] & ~((1 << bitsToDrop) - 1)) >> bitsToDrop;
        }

        return table[sixBitChar];
    }).join('');
}
