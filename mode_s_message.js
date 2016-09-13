/* A ModeSMessage is a decoded form of a surveillance response.
 *
 * @constructor
 * @param {Number} timestamp Time at which the message was received.
 * @param {Uint8Array} data The contents of the message, starting with the
 *   downlink format. Preamble is not included. The data should be of length
 *   7 bytes (for short formats), or 14 bytes (long/extended formats).
 *
 * This function will create a number of properties on the message:
 *
 * - ca: Transponder capability field.
 * - aa: Announced Address field. 24-bit unique aircraft address.
 * - ap: Address/Parity field. Like the 'aa' field, but the address is XORed
 *       with the parity check value before being inserted in the field. A
 *       prior valid transmission of AA is required to know that the address
 *       in AP is a valid one.
 * - vs: Vertical Status field.
 * - ri: Reply Information field, 4 bits.
 * - ac: Altitude Code. 13 bits.
 * - fs: Flight Status field, 3 bits.
 * - dr: Downlink Request field, 5 bits.
 * - um: Utility Message field, 6 bits.
 * - tc: Type Code, 5 bits. Specifies the type of extended squitter payload.
 * - bds: BDS register number, 8 bits.
 * - mb: Message, Comm-B. 7-byte Uint8Array.
 * - ke: ELM Control flag. 1 bit.
 * - nd: Number of D segment, 4 bits.
 * - md: Message, Comm-D. 10-byte Uint8Array.
 *
 * - x0, x1: Bits not allocated by the Mode S specification, but used in future
 *           protocol specifications (ADS-B).
 */

var ModeSMessage = function(timestamp, data) {
  this.timestamp = timestamp;
  this.data = data;
  this.df = this.DF();
  this.crc = this.CRC();
  this.derivedAltitude = null;

  // TODO: Check that data is an array.

  switch (this.DF()) {
    case DF_ALL_CALL_REPLY:
      this.ca = this.data[0] & 0x7;
      this.aa = this.ap = (this.data[1] << 16) | (this.data[2] << 8) | this.data[3];
      break;

    case DF_TCAS_SHORT:
      this.ap = this.aa = this.CRC();
      this.vs = (this.data[0] & 0x04) >> 2;
      this.x0 = ((this.data[0] & 0x03) << 5) | (this.data[1] & 0xF8) >> 3;
      this.ri = (this.data[1] & 0x07) << 1 | (this.data[2] & 0x80) >> 7;
      this.x1 = (this.data[2] & 0x60) >> 5;
      this.ac = (this.data[2] & 0x1F) << 8 | this.data[3];
      break;

    case DF_SURV_ALTITUDE_REPLY:
      this.ap = this.aa = this.CRC();
      this.fs = this.data[0] & 0x07;
      this.dr = (this.data[1] >> 3) & 0x1F;
      this.um = ((this.data[1] & 0x07) << 3) | ((this.data[2] & 0xe0) >> 5);
      this.ac = (this.data[2] & 0x1f) << 8 | this.data[3];
      break;

    case DF_EXT_SQUITTER:
      this.aa = this.ap = (this.data[1] << 16) | (this.data[2] << 8) | this.data[3];
      this.tc = (this.data[4] & 0xF8) >> 3;
      this.decodeExtSquitter();
      break;

    case DF_COMM_B_ALT:
      this.ap = this.aa = this.CRC();
      this.fs = this.data[0] & 0x07;
      this.dr = (this.data[1] & 0xf8) >> 3;
      this.um = ((this.data[1] & 0x07) << 3) | ((this.data[2] & 0xe0) >> 5);
      this.ac = (this.data[2] & 0x1f) << 8 | this.data[3];
      this.bds = this.data[4];
      this.mb = this.data.slice(4, 11);
      break;

    case DF_SURV_MODE_A_ID:
      this.ap = this.aa = this.CRC();
      this.fs = this.data[0] & 0x07;
      this.dr = (this.data[1] >> 3) & 0x1F;
      this.um = ((this.data[1] & 0x07) << 3) | ((this.data[2] & 0xe0) >> 5);
      this.id = (this.data[2] & 0x1f) << 8 | this.data[3];
      break;

    case DF_COMM_B_MODE_A_ID:
      this.ap = this.aa = this.CRC();
      this.fs = this.data[0] & 0x07;
      this.dr = (this.data[1] & 0xf8) >> 3;
      this.um = ((this.data[1] & 0x07) << 3) | ((this.data[2] & 0xe0) >> 5);
      this.id = (this.data[2] & 0x1f) << 8 | this.data[3];

      this.bds = this.data[4];
      this.mb = this.data.slice(4, 11);
      break;

    case DF_COMM_D_ELM:
    case DF_COMM_D_ELM + 1:
    case DF_COMM_D_ELM + 2:
    case DF_COMM_D_ELM + 3:
    case DF_COMM_D_ELM + 4:
    case DF_COMM_D_ELM + 5:
    case DF_COMM_D_ELM + 6:
    case DF_COMM_D_ELM + 7:
      this.ap = this.aa = this.CRC();
      this.x0 = (this.data[0] & 0x20) ? 1 : 0;
      this.ke = (this.data[0] & 0x10) ? 1 : 0;
      this.nd = this.data[0] & 0x0f;
      this.md = this.data.slice(1, 11);
      break;
  }
};

/** Extract the downlink format for the message.
 *
 * @return {Number} Downlink format, 5 bits.
 */
ModeSMessage.prototype.DF = function() {
  return (this.data[0] >> 3) & 0x1F;
};

/** Calculate the CRC for the message.
 *
 * @return {Number} 24-bit CRC.
 */
ModeSMessage.prototype.CRC = function(shouldEncode) {
  if (!shouldEncode && typeof(this.crc) == typeof(1)) {
    return this.crc;
  }

  return this.crc = ModeSCRC(this.data);
};

/** Decode the fields within the extended squitter payload.
 */
ModeSMessage.prototype.decodeExtSquitter = function() {
  if (this.df != DF_EXT_SQUITTER) return;

  switch (this.tc) {
    case TC_AIRCRAFT_IDENTIFICATION_1:
    case TC_AIRCRAFT_IDENTIFICATION_2:
    case TC_AIRCRAFT_IDENTIFICATION_3:
    case TC_AIRCRAFT_IDENTIFICATION_4:
      this.callsign = decodeCallsign(this.data.slice(5,11));
      break;

    default:
      break;
  }
};
