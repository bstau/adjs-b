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
      this.cc = (this.data[0] & 0x02) >> 1; /* Cross-link capability */
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

    case DF_TCAS_LONG:
      this.aa = this.ap = this.CRC();
      this.vs = (this.data[0] & 0x04) >> 2;
      this.x0 = ((this.data[0] & 0x03) << 5) | (this.data[1] & 0xF8) >> 3;
      this.ri = (this.data[1] & 0x07) << 1 | (this.data[2] & 0x80) >> 7;
      this.x1 = (this.data[2] & 0x60) >> 5;
      this.ac = (this.data[2] & 0x1F) << 8 | this.data[3];
      this.mv = this.data.slice(4, 11);
      // mv contains bds
      if (this.data[4] == 0x30) {
        this.bds = this.data[4];
        this.ara = this.data[5] << 6 | (this.data[6] & 0xFC) >> 2;
        /* RAs Active */
        this.rac = (this.data[6] & 0x03) << 2 | (this.data[7] & 0xC0) >> 6;
        /* RA Terminated */
        this.rat = (this.data[7] & 0x20) ? 1 : 0;
        /* Multiple threat indicator */
        this.mti = (this.data[7] & 0x10) ? 1 : 0;
        /* Threat Type Indicator */
        this.tti = (this.data[7] & 0x0C) >> 2;
        /* Threat Identity */
        this.tid = (this.data[7] & 0x03) << 24 | (this.data[8] << 16) | (this.data[9] << 8) | this.data[10];

        switch (this.tti) {
          case TTI_ALT_RANGE_BEARING:
            this.threat_altitude_code = this.tid >> 13;
            this.threat_range = (this.tid & 0x1FC0) >> 6;
            this.threat_bearing = (this.tid & 0x3F);
            break;
        }
      }
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

    case DF_MIL_SQUITTER:
      this.af = (this.data[0] & 0x07);
      if (this.af === AF_UNENCRYPTED_SQUITTER) {
        this.aa = this.ap = (this.data[1] << 16) | (this.data[2] << 8) | this.data[3];
        this.me = this.data.slice(4, 11);
        this.pi = this.data.slice(11, 14);
      }
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

    case TC_AIRBORNE_VELOCITY:
      this.st = this.data[4] & 0x07;
      this.ic = (this.data[5] & 0x80) ? 1 : 0;
      this.resv_a = (this.data[5] & 0x40) ? 1 : 0;
      this.nac = (this.data[5] & 0x38) >> 3;
      this.we_sign = (this.data[5] & 0x04) ? 1 : 0;
      this.we = (this.data[5] & 0x03) << 8 | this.data[6];
      this.ns_sign = (this.data[7] & 0x80) ? 1 : 0;
      this.ns = (this.data[7] & 0x7F) << 3 | (this.data[8] & 0xe0) >> 5;
      this.vrsrc = (this.data[8] & 0x10) ? 1 : 0;
      this.vr_sign = (this.data[8] & 0x08) ? 1 : 0;
      this.vr = (this.data[8] & 0x07) << 6 | (this.data[9] & 0xFC) >> 2;
      this.resv_b = this.data[9] & 0x03;
      this.baro_diff_sign = (this.data[10] & 0x80) ? 1 : 0;
      this.baro_diff = this.data[10] & 0x7F;
      break;

    case TC_AIRBORNE_POSITION_9:
    case TC_AIRBORNE_POSITION_10:
    case TC_AIRBORNE_POSITION_11:
    case TC_AIRBORNE_POSITION_12:
    case TC_AIRBORNE_POSITION_13:
    case TC_AIRBORNE_POSITION_14:
    case TC_AIRBORNE_POSITION_15:
    case TC_AIRBORNE_POSITION_16:
    case TC_AIRBORNE_POSITION_17:
    case TC_AIRBORNE_POSITION_18:
      this.ss = this.data[4] & 0x06 >> 1;
      this.nicsb = this.data[4] & 0x01;
      this.alt = this.data[5] << 4 | (this.data[6] & 0xf0) >> 4;
      this.time = (this.data[6] & 0x08) ? 1 : 0;
      this.cpr_odd = (this.data[6] & 0x04) ? 1 : 0;
      this.lat_cpr = (this.data[6] & 0x03) << 15 |
                     (this.data[7] << 7) |
                     (this.data[8] & 0xFE) >> 1;
      this.lon_cpr = (this.data[8] & 0x01) << 16 |
                     this.data[9] << 8 |
                     this.data[10];
      break;

    default:
      break;
  }
};

/** Decode climb rate for airborne velocity reports.
 *
 * @return {Number}  Climb rate, in feet/minute. Positive is ascent.
 */
ModeSMessage.prototype.decodeClimbRate = function() {
  if (this.tc != TC_AIRBORNE_VELOCITY) return;

  // Check subtype to ensure that this payload contains vertical rate.
  if (this.st != ABV_SUBTYPE_GROUNDSPEED && this.st != ABV_SUBTYPE_AIRSPEED) {
    console.warn('Unrecognised AIRBORNE_VELOCITY subtype.');
    return null
  }

  // Vertical rate units are in 64ft/min. Multiply out.
  return ((this.vr - 1) * 64) * (this.vr_sign == VR_SIGN_ASCENDING ? 1 : -1);
};

