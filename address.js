/** Routines to decode tail numbers from ICAO 24-bit addresses.
 * @namespace
 */
class TailNumber {
  /** Convert an ICAO address offset to a tail number.
   *
   * For countries that use 6-bit packing.
   *
   * @param {Number} icao 24-bit address.
   * @param {String} Tail number prefix to prepend to the returned value.
   * @return {String||null}
   */
  static FromOffset64(offset, prefix) {
    // Tail numbers are nice and simple. They have a predefined character set:
    const CHARSET = '?ABCDEFGHIJKLMNOPQRSTUVWXYZ?????????????????????????????????????';

    // The first digit is assigned on a 0x400 interval.
    const FIRST_DIGIT_SCALE = 0x1000;

    // The second digit is assigned on an 0x20 interval.
    const SECOND_DIGIT_SCALE = 0x40;

    // And then the third digit is assiged within those 64 characters.

    // Range check, please.
    if (offset > (FIRST_DIGIT_SCALE * SECOND_DIGIT_SCALE)) return null;

    const tail = prefix + CHARSET[Math.floor(offset / FIRST_DIGIT_SCALE)] +
        CHARSET[Math.floor((offset % FIRST_DIGIT_SCALE) / SECOND_DIGIT_SCALE)] +
        CHARSET[offset % SECOND_DIGIT_SCALE];

    if (tail.indexOf('?') >= 0) return null;
    return tail;
  }

  /** Convert an ICAO address offset to a tail number.
   *
   * For countries that use 5-bit packing.
   * Min valid offset is 0x0421, max is 0x6B5A.
   *
   * @param {Number} icao 24-bit address.
   * @param {String} Tail number prefix to prepend to the returned value.
   * @return {String||null}
   */
  static FromOffset32(offset, prefix) {
    // Tail numbers are nice and simple. They have a predefined character set:
    const CHARSET = '?ABCDEFGHIJKLMNOPQRSTUVWXYZ?????';

    // The first digit is assigned on a 0x400 interval.
    const FIRST_DIGIT_SCALE = 0x400;

    // The second digit is assigned on an 0x20 interval.
    const SECOND_DIGIT_SCALE = 0x20;

    // And then the third digit is assiged within those 32 characters.

    // Range check, please.
    if (offset > (FIRST_DIGIT_SCALE * SECOND_DIGIT_SCALE)) return null;

    const tail = prefix + CHARSET[Math.floor(offset / FIRST_DIGIT_SCALE)] +
        CHARSET[Math.floor((offset % FIRST_DIGIT_SCALE) / SECOND_DIGIT_SCALE)] +
        CHARSET[offset % SECOND_DIGIT_SCALE];

    if (tail.indexOf('?') >= 0) return null;
    return tail;
  }

  /** Convert an ICAO address offset to a tail number.
   *
   * For countries that use tight packing of the latin alphabet (keyspace of
   * 26^3) for a three-character suffix.
   *
   * @param {Number} icao 24-bit address.
   * @param {String} Tail number prefix to prepend to the returned value.
   * @return {String||null}
   */
  static FromOffset26(offset, prefix) {
    const MAX_ALPHA = (26*26*26);

    // Finnish tail letters are simple, for alphabetic range.
    const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Range check, please.
    if (offset < 0) return null;
    if (offset >= MAX_ALPHA) return null;

    return prefix + CHARSET[Math.floor(offset / (26 * 26))] +
        CHARSET[Math.floor((offset / 26) % 26)] +
        CHARSET[offset % 26];
  }

  /** Convert an ICAO address to a Argentinian tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromARICAO(icao) {
    const MIN_AR_ICAO = 0xE00000;
    const MAX_AR_ICAO = 0xE3FFFF;

    // Range check, please.
    if (icao < MIN_AR_ICAO) return null;
    if (icao > MAX_AR_ICAO) return null;

    // Calculate where we are within the AR block.
    var offset = icao - MIN_AR_ICAO;

    return TailNumber.FromOffset64(offset, 'LV-');
  }

  /** Convert an ICAO address to an Australian tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromAUICAO(icao) {
      // Australian tail numbers are encoded as a fairly basic base-36 format,
      // consisting only of the three-letter suffix to the country prefix (VH).

      var AU_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ          ';
      var AU_TABLE_LEN = AU_TABLE.length;
      var AU_MIN_ICAO = 0x7C0000;
      var AU_MAX_ICAO = AU_MIN_ICAO + Math.pow(AU_TABLE_LEN, 3) - 1;

      if (icao < AU_MIN_ICAO) return null;
      if (icao > AU_MAX_ICAO) return null;

      icao -= AU_MIN_ICAO;
      return 'VH-' +
          AU_TABLE[Math.floor(icao / Math.pow(AU_TABLE_LEN, 2))] +
          AU_TABLE[Math.floor(icao / AU_TABLE_LEN) % AU_TABLE_LEN] +
          AU_TABLE[icao % AU_TABLE_LEN];
  }

  /** Convert an ICAO address to a Belgian tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromBEICAO(icao) {
    const MIN_BE_ICAO = 0x448000;
    const MAX_BE_ICAO = 0x44FFFF;

    // Range check, please.
    if (icao < MIN_BE_ICAO) return null;
    if (icao > MAX_BE_ICAO) return null;

    // Calculate where we are within the BE block.
    var offset = icao - MIN_BE_ICAO;

    return TailNumber.FromOffset32(offset, 'OO-');
  }

  /** Decode a Canadian tail number from an ICAO 24-bit address.
   *
   * @param {Number} icao 24-bit address
   */
  static FromCAICAO(icao) {
      // Canadian tail numbers are encoded as a fairly basic base-26 format,
      // consisting of a three-(26^3) ranges corresponding to CF-AAA..CI-ZZZ.

      var CA_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var CA_PREFIX = 'FGI';
      var CA_TABLE_LEN = CA_TABLE.length;
      var CA_MIN_ICAO = 0xC00001;
      var CA_MAX_ICAO = 0xC0CDF8;

      var CA_PREFIX_BLOCK = CA_TABLE_LEN * CA_TABLE_LEN * CA_TABLE_LEN;

      if (icao < CA_MIN_ICAO) return null;
      if (icao > CA_MAX_ICAO) return null;

      icao -= CA_MIN_ICAO;
      var tail_number = 'C' + CA_PREFIX[Math.floor(icao / CA_PREFIX_BLOCK)] + '-';
      tail_number += CA_TABLE[Math.floor(icao / Math.pow(CA_TABLE_LEN, 2)) % CA_TABLE_LEN];
      tail_number += CA_TABLE[Math.floor(icao / CA_TABLE_LEN) % CA_TABLE_LEN];
      tail_number += CA_TABLE[icao % CA_TABLE_LEN];
      return tail_number;
  }

  /** Convert an ICAO address to a Swiss tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromCHICAO(icao) {
    const MIN_CH_ICAO = 0x4B0000;
    const MAX_CH_ICAO = 0x4B7FFF;

    const MAX_CH_ICAO_ALPHA = MIN_CH_ICAO + (26*26*26);

    // Tail letters are simple, for alphabetic range.
    const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Range check, please.
    if (icao < MIN_CH_ICAO) return null;
    if (icao > MAX_CH_ICAO) return null;

    if (icao < MAX_CH_ICAO_ALPHA) {
      // Calculate where we are within the alpha block.
      var offset = icao - MIN_CH_ICAO;

      return 'HB-' + CHARSET[Math.floor(offset / (26 * 26))] +
          CHARSET[Math.floor((offset / 26) % 26)] +
          CHARSET[offset % 26];
    }

    return null;
  }

  static FromCUICAO(icao) {
    const MIN_CU_ICAO = 0x0B0000;
    const MAX_CU_ICAO = 0x0B0FFF;
    const MAX_CU_ICAO_NUM = MIN_CU_ICAO + 10000;

    // Range check, please.
    if (icao < MIN_CU_ICAO) return null;
    if (icao > MAX_CU_ICAO) return null;

    if (icao < MAX_CU_ICAO_NUM) {
      var offset = icao - MIN_CU_ICAO;
      var suffix = offset.toString(10);
      return 'CU-T' + '0000'.substr(suffix.length) + suffix;
    }

    return null;
  }

  /** Convert an ICAO address to a German tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromDEICAO(icao) {
      // German ICAO addresses are totally whacked.

      var DE_FIRST = '?AB';
      var DE_SECOND = '?ABCDEFGHIJKLMNO';
      var DE_TABLE = '?ABCDEFGHIJKLMNOPQRSTUVWXYZ         ';
      var DE_UPPER = 'CEFGHIKLMNOPQRSTUVWXYZ';

      var segment = ((icao & 0x03FFFF) >> 13);
      var prefix = 'D-??';

      switch (segment) {
      case 0x0:
          return 'D-A' +
              DE_TABLE[16 + Math.floor((icao - 0x3C0001) / (26 * 26)) % 26] +
              DE_TABLE[1 + Math.floor((icao - 0x3C0001) / 26) % 26] +
              DE_TABLE[1 + (icao - 0x3C0001) % 26];

      case 0x1:
          return 'D-B' +
              DE_TABLE[16 + Math.floor((icao - 0x3C2001) / (26 * 26)) % 26] +
              DE_TABLE[1 + Math.floor((icao - 0x3C2001) / 26) % 26] +
              DE_TABLE[1 + (icao - 0x3C2001) % 26];

      case 0x2:
      case 0x3:
          return 'D-A' + DE_SECOND[(icao >> 10) & 0xF] +
              DE_TABLE[(icao >> 5) & 0x1F] + DE_TABLE[(icao & 0x1F)];

      case 0x4:
      case 0x5:
          return 'D-B' + DE_TABLE[(icao >> 10) & 0x1F] +
              DE_TABLE[(icao >> 5) & 0x1F] + DE_TABLE[(icao & 0x1F)];

      case 0x6:
      case 0x7:
      case 0x8:
      case 0x9:
      case 0xA:
      case 0xB:
      case 0xC:
      case 0xD:
      case 0xE:
      case 0xF:
      case 0x10:
      case 0x11:
      case 0x12:
      case 0x13:
          return 'D-' +
              DE_UPPER[Math.floor((icao - 0x3CC000) / Math.pow(26, 3))] +
              DE_TABLE[1 + Math.floor((icao - 0x3CC000) / (26 * 26)) % 26] +
              DE_TABLE[1 + Math.floor((icao - 0x3CC000) / 26) % 26] +
              DE_TABLE[1 + (icao - 0x3CC000) % 26];

      case 0x16:
      case 0x17:
          if (icao <= 0x3EE097) {
              return 'D-' +
                  DE_UPPER[Math.floor((icao - 0x3D0000) / Math.pow(26, 3))] +
                  DE_TABLE[1 + Math.floor((icao - 0x3D0000) / (26 * 26)) % 26] +
                  DE_TABLE[1 + Math.floor((icao - 0x3D0000) / 26) % 26] +
                  DE_TABLE[1 + (icao - 0x3D0000) % 26];
          } else {
              // The space above 3EE097 is used for numeric tail numbers.
              return null;
          }


      case 0x1f:
          // At this point, we're no longer tightly packing tail numbers like
          // we were above. Ugh.
          return 'D-' +
              DE_UPPER[Math.floor((icao - 0x3DC5DA) / Math.pow(26, 3))] +
              DE_TABLE[1 + Math.floor((icao - 0x3DC5DA) / (26 * 26)) % 26] +
              DE_TABLE[1 + Math.floor((icao - 0x3DC5DA) / 26) % 26] +
              DE_TABLE[1 + (icao - 0x3DC5DA) % 26];
      default:
          return null;
      }
  }

  static FromDKICAO(icao) {
    const MIN_DK_ICAO = 0x458000;
    const MAX_DK_ICAO = 0x45FFFF;

    // Range check, please.
    if (icao < MIN_DK_ICAO) return null;
    if (icao > MAX_DK_ICAO) return null;

    return TailNumber.FromOffset32(icao - MIN_DK_ICAO, 'OY-');
  }

  /** Convert an ICAO address to a Finnish tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromFIICAO(icao) {
    const MIN_FI_ICAO = 0x460000;
    const MAX_FI_ICAO = 0x467FFF;

    const MAX_FI_ICAO_ALPHA = (26*26*26) + MIN_FI_ICAO;

    // Not a typo; they obviously went for a round decimal number as the base of
    // this range, instead of a round hex number.
    const MIN_FI_ICAO_NUM = 4610000; // = 0x4657D0
    // totally a guess; only observed up to OH-1024
    const MAX_FI_ICAO_NUM = MIN_FI_ICAO_NUM + 1200;

    // Finnish tail letters are simple, for alphabetic range.
    const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Range check, please.
    if (icao < MIN_FI_ICAO) return null;
    if (icao > MAX_FI_ICAO) return null;

    if (icao < MAX_FI_ICAO_ALPHA) {
      // Calculate where we are within the alpha block.
      var offset = icao - MIN_FI_ICAO;

      return 'OH-' + CHARSET[Math.floor(offset / (26 * 26))] +
          CHARSET[Math.floor((offset / 26) % 26)] +
          CHARSET[offset % 26];
    }

    if ((icao >= MIN_FI_ICAO_NUM) && (icao <= MAX_FI_ICAO_NUM)) {
      var offset = icao - MIN_FI_ICAO_NUM;
      return 'OH-' + offset.toString(10);
    }

    return null;
  }

  /** Decode a French tail number from an ICAO 24-bit address.
   *
   * @param {Number} icao 24-bit address
   */
  static FromFRICAO(icao) {
      // French tail numbers use a sensible bitmasking strategy for 24-bit
      // encoding; the bitfields are:
      //                 1       2
      // 0...,...8...,...6...,...4
      // [ fr ][2][ 3 ][ 4 ][ 5 ]

      var FR_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ??????';
      var FR_PREFIX = 'B?GHO???';
      var FR_MIN_ICAO = 0x380000;
      var FR_MAX_ICAO = 0x3A6739;

      if (icao < FR_MIN_ICAO) return null;
      if (icao > FR_MAX_ICAO) return null;

      var tail_number = 'F-' + FR_PREFIX[(icao >> 15) & 0xF] +
          FR_TABLE[(icao >> 10) & 0x1F] +
          FR_TABLE[(icao >> 5) & 0x1F] +
          FR_TABLE[icao & 0x1F];
      return tail_number;
  }

  /** Convert an ICAO address to a Greek tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromGRICAO(icao) {
    const MIN_GR_ICAO = 0x468000;
    const MAX_GR_ICAO = 0x46FFFF;

    // Range check, please.
    if (icao < MIN_GR_ICAO) return null;
    if (icao > MAX_GR_ICAO) return null;

    // Calculate where we are within the GR block.
    var offset = icao - MIN_GR_ICAO;

    return TailNumber.FromOffset32(offset, 'SX-');
  }

  /** Convert an ICAO address to a Greek tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromHUICAO(icao) {
    const MIN_HU_ICAO = 0x470000;
    const MAX_HU_ICAO = 0x477FFF;

    // Range check, please.
    if (icao < MIN_HU_ICAO) return null;
    if (icao > MAX_HU_ICAO) return null;

    // Calculate where we are within the HU block.
    var offset = icao - MIN_HU_ICAO;

    return TailNumber.FromOffset26(offset, 'HA-');
  }

  static FromJOICAO(icao) {
    const MIN_JO_ICAO = 0x740000;
    const MAX_JO_ICAO = 0x747FFF;

    // Range check, please.
    if (icao < MIN_JO_ICAO) return null;
    if (icao > MAX_JO_ICAO) return null;

    // Calculate where we are within the JO block.
    var offset = icao - MIN_JO_ICAO;

    return TailNumber.FromOffset32(offset, 'JY-');
  }

  static FromJPICAO(icao) {
    const MIN_JP_ICAO = 0x840000;
    const MAX_JP_ICAO = 0x87FFFF;

    // Two character sets are used; numbers cannot follow letters in a tail number
    const ALNUM = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const AL = ALNUM.substr(10);

    // Tail number structure:
    // JA
    //   [0-9]                    229840 tails
    //        [0-9]                 9160 tails
    //             [0-9]             340 tails
    //                  [0-9A-Z]      34 tails
    //             [A-Z]             576 tails
    //                  [A-Z]         24 tails
    //        [A-Z]                13824 tails
    //             [A-Z]             576 tails
    //                  [A-Z]         24 tails

    const ASSIGNED = 229840;

    // Range check, please.
    if (icao < MIN_JP_ICAO) return null;
    if (icao > MAX_JP_ICAO) return null;
    if (icao >= (MAX_JP_ICAO + ASSIGNED)) return null;

    // Japanese tail numbers are arranged as JA0000, JA000X, JA00XX.
    // The ICAO24 packing allows for JA0XXX too, but this has not been observed.

    // Get the first character, which must be a number.
    var offset = icao - MIN_JP_ICAO;
    const digit0 = Math.floor(offset / 22984);
    offset %= 22984;

    // Get the second character, which may be alphanumeric.
    const digit1num = offset < 9160;
    const digit1 = ALNUM[digit1num ? Math.floor(offset / 916) : Math.floor(10 + (offset - 9160) / 576)];
    offset -= digit1num ? 0 : 9160;
    offset %= digit1num ? 916 : 576;

    // Get the third character.
    const digit2num = digit1num ? (offset < 340) : false;
    const digit2 = (digit1num ? ALNUM : AL)[Math.floor(digit2num ? (offset / 34) : (10 + ((offset - 340)/ 24)))];
    offset -= digit2num ? 0 : 340;
    offset %= digit2num ? 34 : 24;

    // Get the final character, based on the previous character type.
    const digit3 = (digit2num ? ALNUM : AL)[offset];

    return 'JA'.concat(digit0).concat(digit1).concat(digit2).concat(digit3);
  }

  static FromKPICAO(icao) {
    const MIN_KP_ICAO = 0x720000;
    const MAX_KP_ICAO = 0x727FFF;

    // Range check, please.
    if (icao < MIN_KP_ICAO) return null;
    if (icao > MAX_KP_ICAO) return null;

    // North Korea has a simple mapping for civilian aircraft; P500 == 0x727700
    // and it goes up from there to P999.
    if ((icao >= 0x727700) && (icao - 0x727700) <= 999) {
      return 'P-' + (icao - 0x727530).toString(10);
    }

    return null;
  }

  static FromKRICAO(icao) {
    const MIN_KR_ICAO = 0x718000;
    const MAX_KR_ICAO = 0x71FFFF;

    // Range check, please.
    if (icao < MIN_KR_ICAO) return null;
    if (icao > MAX_KR_ICAO) return null;

    // Korea has an interesting scheme where they treat the ICAO code as BCD.
    // A modified BCD, at least. Gotta keep Mode S addressing interesting.
    if (icao <= 0x71CE99) {
      if ((icao & 0x0F) > 0x9) return null;
      if ((icao & 0xF0) > 0x90) return null;

      var digit0 = (icao & 0x007800) >> 11;
      var digit1 = (icao & 0x000700) >> 8;
      var digit2 = (icao & 0x0000f0) >> 4;
      var digit3 = (icao & 0x00000f);

      return 'HL' + digit0.toString(10) + digit1.toString(10) + digit2.toString(10) + digit3.toString(10);
    }

    return null;
  }

  static FromPKICAO(icao) {
    const MIN_PK_ICAO = 0x760000;
    const MAX_PK_ICAO = 0x767FFF;

    // Range check, please.
    if (icao < MIN_PK_ICAO) return null;
    if (icao > MAX_PK_ICAO) return null;

    // Calculate where we are within the PK block.
    var offset = icao - MIN_PK_ICAO;

    return TailNumber.FromOffset32(offset, 'AP-');
  }

  /** Convert an ICAO address to a Portugese tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromPTICAO(icao) {
    const MIN_PT_ICAO = 0x490000;
    const MAX_PT_ICAO = 0x497FFF;

    // Range check, please.
    if (icao < MIN_PT_ICAO) return null;
    if (icao > MAX_PT_ICAO) return null;

    // Calculate where we are within the PT block.
    var offset = icao - MIN_PT_ICAO;

    return TailNumber.FromOffset32(offset, 'CS-');
  }

  /** Convert an ICAO address to a Romanian tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromROICAO(icao) {
    const MIN_RO_ICAO = 0x4A0000;
    const MAX_RO_ICAO = 0x4A7FFF;

    // Range check, please.
    if (icao < MIN_RO_ICAO) return null;
    if (icao > MAX_RO_ICAO) return null;

    // Calculate where we are within the RO block.
    var offset = icao - MIN_RO_ICAO;

    return TailNumber.FromOffset32(offset, 'YR-');
  }

  /** Convert an ICAO address to a Finnish tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static FromRUICAO(icao) {
    const MIN_RU_ICAO = 0x140000;
    const MAX_RU_ICAO = 0x157FFF;

    // totally a guess; only observed up to RA-96022
    const MAX_RU_ICAO_NUM = MIN_RU_ICAO + 100000;

    // Range check, please.
    if (icao < MIN_RU_ICAO) return null;
    if (icao > MAX_RU_ICAO) return null;

    if (icao < MAX_RU_ICAO_NUM) {
      // Calculate where we are within the alpha block.
      var offset = icao - MIN_RU_ICAO;

      return 'RA-' + offset.toString(10);
    }

    return null;
  }

  static FromSEICAO(icao) {
    const MIN_SE_ICAO = 0x4A8000;
    const MAX_SE_ICAO = 0x4AFFFF;

    // Range check, please.
    if (icao < MIN_SE_ICAO) return null;
    if (icao > MAX_SE_ICAO) return null;

    // Calculate where we are within the SE block.
    var offset = icao - MIN_SE_ICAO;

    return TailNumber.FromOffset32(offset, 'SE-');
  }

  static FromSGICAO(icao) {
    const MIN_SG_ICAO = 0x768000;
    const MAX_SG_ICAO = 0x76FFFF;

    // Range check, please.
    if (icao < MIN_SG_ICAO) return null;
    if (icao > MAX_SG_ICAO) return null;

    return TailNumber.FromOffset32(icao - MIN_SG_ICAO, '9V-');
  }

  static FromSYICAO(icao) {
    const MIN_SY_ICAO = 0x778000;
    const MAX_SY_ICAO = 0x77FFFF;

    // Range check, please.
    if (icao < MIN_SY_ICAO) return null;
    if (icao > MAX_SY_ICAO) return null;

    // Calculate where we are within the SY block.
    var offset = icao - MIN_SY_ICAO;

    return TailNumber.FromOffset32(offset, 'YK-');
  }

  static FromTHICAO(icao) {
    const MIN_TH_ICAO = 0x880000;
    const MAX_TH_ICAO = 0x887FFF;

    // Range check, please.
    if (icao < MIN_TH_ICAO) return null;
    if (icao > MAX_TH_ICAO) return null;

    return TailNumber.FromOffset32(icao - MIN_TH_ICAO, 'HS-');
  }

  static FromTRICAO(icao) {
    const MIN_TR_ICAO = 0x4B8000;
    const MAX_TR_ICAO = 0x4BFFFF;

    // Range check, please.
    if (icao < MIN_TR_ICAO) return null;
    if (icao > MAX_TR_ICAO) return null;

    return TailNumber.FromOffset32(icao - MIN_TR_ICAO, 'TC-');
  }

  /** Decode a US tail number from an ICAO 24-bit address.
   *
   * @param {Number} icao  24-bit address
   */
  static FromUSICAO(icao) {
      // US tail numbers are variable length, and encoded as a suffix to the
      // standard country prefix (N). The first address of the US block is not
      // valid, and only a subset of the US's ICAO addresses are coded according
      // to this scheme.

      var US_MIN_ICAO = 0xA00001;
      var US_MAX_ICAO = 0xADF7C7;

      // Character space for US tail numbers. The letters I and O are deliberately
      // excluded to reduce confusion.
      var US_TABLE_DIG1 = '123456789';
      var US_TABLE_DIG2 = '0123456789';
      var US_TABLE_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

      // Each first digit has this much key space.
      var DIGIT_1 = 101711;
      var DIGIT_2 = 10111;
      var DIGIT_3 = 951;
      var DIGIT_4 = US_TABLE_ALPHA.length + US_TABLE_DIG2.length + 1;

      // Remainders of less than this specify a letter suffix.
      var LAST_DIGIT = 601;

      US_MAX_ICAO = US_MIN_ICAO + US_TABLE_DIG1.length * DIGIT_1 - 1;

      if (icao < US_MIN_ICAO) return null;
      if (icao > US_MAX_ICAO) return null;


      var tail_number = 'N';
      var trailing_letters = true;

      // Extract the first letter.
      icao -= US_MIN_ICAO;
      tail_number += US_TABLE_DIG1[Math.floor(icao / DIGIT_1)];
      icao %= DIGIT_1;

      // Extract the second digit.
      if (icao >= LAST_DIGIT) {
          tail_number += US_TABLE_DIG2[Math.floor((icao - LAST_DIGIT) / DIGIT_2)];
          icao -= LAST_DIGIT;
          icao %= DIGIT_2;
      }

      // Extract the third digit.
      if (icao >= LAST_DIGIT) {
          tail_number += US_TABLE_DIG2[Math.floor((icao - LAST_DIGIT) / DIGIT_3)];
          icao -= LAST_DIGIT;
          icao %= DIGIT_3;
      }

      // Extract the fourth digit. If present, the fifth digit may include either
      // a letter or a number. The coding scheme needs this information later on.
      if (icao >= LAST_DIGIT) {
          trailing_letters = false;
          tail_number += US_TABLE_DIG2[Math.floor((icao - LAST_DIGIT) / DIGIT_4)];
          icao -= LAST_DIGIT;
          icao %= DIGIT_4;
      }

      // If we have a digit in the fifth position, bail out without trying to find
      // any tail letters.
      if (!trailing_letters && icao > US_TABLE_ALPHA.length) {
          tail_number += US_TABLE_DIG2[icao - (US_TABLE_ALPHA.length + 1)];
          return tail_number;
      }

      if (trailing_letters && icao) {
          icao -= 1;
          tail_number += US_TABLE_ALPHA[Math.floor(icao / 25)];
          icao %= 25;
      }

      if (icao) {
          tail_number += US_TABLE_ALPHA[icao - 1];
      }

      return tail_number;
  }

  static FromZAICAO(icao) {
    const MIN_ZA_ICAO = 0x008000;
    const MAX_ZA_ICAO = 0x00FFFF;

    // Range check, please.
    if (icao < MIN_ZA_ICAO) return null;
    if (icao > MAX_ZA_ICAO) return null;

    return TailNumber.FromOffset26(icao - 0x008011, 'ZS-');
  }
}

/** ICAO 24-bit Address-related functions.
 * @namespace
 */
class Address {
  /** Look up details about an address.
   *
   * @param {Number} icao 24-bit address
   */
  static Lookup(icao) {
      var results = Address.PREFIXES.filter(function(i) {
          return (icao & i.mask) === i.address;
      });

      if (results.length) return results[0];

      return null;
  }

  /** Determine which ISO country code an ICAO address belongs to.
   *
   * This will not necessarily be the operator's country of operation, but
   * should be the country of registration for the plane.
   *
   * @param {Number} icao 24-bit address
   * @return {String||null} 2-letter country code if found, or null.
   */
  static ToCountry(icao) {
      var result = Address.Lookup(icao);
      if (!result) return result;
      return result.country_code;
  }

  /** Derive, if possible, a tail number from an ICAO 24-bit address.
   *
   * Some countries use deterministic algorithms to generate 24-bit addresses
   * from tail numbers (aircraft registrations). For countries where the
   * algorithm is implemented, find the tail number.
   *
   * @param {Number} icao 24-bit address.
   * @return {String||null}
   */
  static ToTailNumber(icao) {
      var result = Address.Lookup(icao);
      if (!result || !result.tail_algorithm) return null;

      return result.tail_algorithm(icao);
  }
}

Address.PREFIXES = ([
  {prefix: '000000000000000000000000', location_name: 'INVALID', country_code: null},
  {prefix: '00000000010000', location_name: 'Zimbabwe', country_code: 'ZW'},
  {prefix: '000000000110', location_name: 'Mozambique', country_code: 'MZ'},
  {prefix: '000000001', location_name: 'South Africa', country_code: 'ZA', tail_algorithm: TailNumber.FromZAICAO},
  {prefix: '000000010', location_name: 'Egypt', country_code: 'EG'},
  {prefix: '000000011', location_name: 'Libyan Arab Jamahiriya', country_code: 'LY'},
  {prefix: '000000100', location_name: 'Morocco', country_code: 'MA'},
  {prefix: '000000101', location_name: 'Tunisia', country_code: 'TN'},
  {prefix: '00000011000000', location_name: 'Botswana', country_code: 'BW'},
  {prefix: '000000110010', location_name: 'Burundi', country_code: 'BI'},
  {prefix: '000000110100', location_name: 'Cameroon', country_code: 'CM'},
  {prefix: '00000011010100', location_name: 'Comoros', country_code: 'KM'},
  {prefix: '000000110110', location_name: 'Congo', country_code: 'CG'},
  {prefix: '000000111000', location_name: 'Côte d Ivoire', country_code: 'CI'},
  {prefix: '000000111110', location_name: 'Gabon', country_code: 'GA'},
  {prefix: '000001000000', location_name: 'Ethiopia', country_code: 'ET'},
  {prefix: '000001000010', location_name: 'Equatorial Guinea', country_code: 'GQ'},
  {prefix: '000001000100', location_name: 'Ghana', country_code: 'GH'},
  {prefix: '000001000110', location_name: 'Guinea', country_code: 'GN'},
  {prefix: '00000100100000', location_name: 'GuineaBissau', country_code: 'GW'},
  {prefix: '00000100101000', location_name: 'Lesotho', country_code: 'LS'},
  {prefix: '000001001100', location_name: 'Kenya', country_code: 'KE'},
  {prefix: '000001010000', location_name: 'Liberia', country_code: 'LR'},
  {prefix: '000001010100', location_name: 'Madagascar', country_code: 'MG'},
  {prefix: '000001011000', location_name: 'Malawi', country_code: 'MW'},
  {prefix: '00000101101000', location_name: 'Maldives', country_code: 'MV'},
  {prefix: '000001011100', location_name: 'Mali', country_code: 'ML'},
  {prefix: '00000101111000', location_name: 'Mauritania', country_code: 'MR'},
  {prefix: '00000110000000', location_name: 'Mauritius', country_code: 'MU'},
  {prefix: '000001100010', location_name: 'Niger', country_code: 'NE'},
  {prefix: '000001100100', location_name: 'Nigeria', country_code: 'NG'},
  {prefix: '000001101000', location_name: 'Uganda', country_code: 'UG'},
  {prefix: '00000110101000', location_name: 'Qatar', country_code: 'QA'},
  {prefix: '000001101100', location_name: 'Central African Republic', country_code: 'CF'},
  {prefix: '000001101110', location_name: 'Rwanda', country_code: 'RW'},
  {prefix: '000001110000', location_name: 'Senegal', country_code: 'SN'},
  {prefix: '00000111010000', location_name: 'Seychelles', country_code: 'SC'},
  {prefix: '00000111011000', location_name: 'Sierra Leone', country_code: 'SL'},
  {prefix: '000001111000', location_name: 'Somalia', country_code: 'SO'},
  {prefix: '00000111101000', location_name: 'Swaziland', country_code: 'SZ'},
  {prefix: '000001111100', location_name: 'Sudan', country_code: 'SD'},
  {prefix: '000010000000', location_name: 'United Republic of Tanzania', country_code: 'TZ'},
  {prefix: '000010000100', location_name: 'Chad', country_code: 'TD'},
  {prefix: '000010001000', location_name: 'Togo', country_code: 'TG'},
  {prefix: '000010001010', location_name: 'Zambia', country_code: 'ZM'},
  {prefix: '000010001100', location_name: 'Democratic Republic of the Congo', country_code: 'CD'},
  {prefix: '000010010000', location_name: 'Angola', country_code: 'AO'},
  {prefix: '00001001010000', location_name: 'Benin', country_code: 'BJ'},
  {prefix: '00001001011000', location_name: 'Cape Verde', country_code: 'CV'},
  {prefix: '00001001100000', location_name: 'Djibouti', country_code: 'DJ'},
  {prefix: '000010011010', location_name: 'Gambia', country_code: 'GM'},
  {prefix: '000010011100', location_name: 'Burkina Faso', country_code: 'BF'},
  {prefix: '00001001111000', location_name: 'Sao Tome and Principe', country_code: 'ST'},
  {prefix: '000010100', location_name: 'Algeria', country_code: 'DZ'},
  {prefix: '000010101000', location_name: 'Bahamas', country_code: 'BS'},
  {prefix: '00001010101000', location_name: 'Barbados', country_code: 'BB'},
  {prefix: '00001010101100', location_name: 'Belize', country_code: 'BZ'},
  {prefix: '000010101100', location_name: 'Colombia', country_code: 'CO'},
  {prefix: '000010101110', location_name: 'Costa Rica', country_code: 'CR'},
  {prefix: '000010110000', location_name: 'Cuba', country_code: 'CU', tail_algorithm: TailNumber.FromCUICAO},
  {prefix: '000010110010', location_name: 'El Salvador', country_code: 'SV'},
  {prefix: '000010110100', location_name: 'Guatemala', country_code: 'GT'},
  {prefix: '000010110110', location_name: 'Guyana', country_code: 'GY'},
  {prefix: '000010111000', location_name: 'Haiti', country_code: 'HT'},
  {prefix: '000010111010', location_name: 'Honduras', country_code: 'HN'},
  {prefix: '00001011110000', location_name: 'Saint Vincent and the Grenadines', country_code: 'VC'},
  {prefix: '000010111110', location_name: 'Jamaica', country_code: 'JM'},
  {prefix: '000011000000', location_name: 'Nicaragua', country_code: 'NI'},
  {prefix: '000011000010', location_name: 'Panama', country_code: 'PA'},
  {prefix: '000011000100', location_name: 'Dominican Republic', country_code: 'DO'},
  {prefix: '000011000110', location_name: 'Trinidad and Tobago', country_code: 'TT'},
  {prefix: '000011001000', location_name: 'Suriname', country_code: 'SR'},
  {prefix: '00001100101000', location_name: 'Antigua and Barbuda ', country_code: 'AG'},
  {prefix: '00001100110000', location_name: 'Grenada', country_code: 'GD'},
  {prefix: '000011010', location_name: 'Mexico', country_code: 'MX'},
  {prefix: '000011011', location_name: 'Venezuela', country_code: 'VE'},
  {prefix: '0001', location_name: 'Russian Federation', country_code: 'RU', tail_algorithm: TailNumber.FromRUICAO},
  {prefix: '00100000000100', location_name: 'Namibia', country_code: 'NA'},
  {prefix: '00100000001000', location_name: 'Eritrea', country_code: 'ER'},
  {prefix: '00100', location_name: 'AFI', country_code: null},
  {prefix: '00101', location_name: 'SAM', country_code: null},
  {prefix: '001100', location_name: 'Italy', country_code: 'IT'},
  {prefix: '001101', location_name: 'Spain', country_code: 'ES'},
  {prefix: '001110', location_name: 'France', country_code: 'FR', tail_algorithm: TailNumber.FromFRICAO},
  {prefix: '001111', location_name: 'Germany', country_code: 'DE', tail_algorithm: TailNumber.FromDEICAO},
  {prefix: '010000', location_name: 'United Kingdom', country_code: 'GB'},
  {prefix: '010001000', location_name: 'Austria', country_code: 'AT'},
  {prefix: '010001001', location_name: 'Belgium', country_code: 'BE', tail_algorithm: TailNumber.FromBEICAO},
  {prefix: '010001010', location_name: 'Bulgaria', country_code: 'BG'},
  {prefix: '010001011', location_name: 'Denmark', country_code: 'DK', tail_algorithm: TailNumber.FromDKICAO},
  {prefix: '010001100', location_name: 'Finland', country_code: 'FI', tail_algorithm: TailNumber.FromFIICAO},
  {prefix: '010001101', location_name: 'Greece', country_code: 'GR', tail_algorithm: TailNumber.FromGRICAO},
  {prefix: '010001110', location_name: 'Hungary', country_code: 'HU', tail_algorithm: TailNumber.FromHUICAO},
  {prefix: '010001111', location_name: 'Norway', country_code: 'NO'},
  {prefix: '010010000', location_name: 'Netherlands, Kingdom of the', country_code: 'NL'},
  {prefix: '010010001', location_name: 'Poland', country_code: 'PL'},
  {prefix: '010010010', location_name: 'Portugal', country_code: 'PT', tail_algorithm: TailNumber.FromPTICAO},
  {prefix: '010010011', location_name: 'Czech Republic', country_code: 'CZ'},
  {prefix: '010010100', location_name: 'Romania', country_code: 'RO', tail_algorithm: TailNumber.FromROICAO},
  {prefix: '010010101', location_name: 'Sweden', country_code: 'SE', tail_algorithm: TailNumber.FromSEICAO},
  {prefix: '010010110', location_name: 'Switzerland', country_code: 'CH', tail_algorithm: TailNumber.FromCHICAO},
  {prefix: '010010111', location_name: 'Turkey', country_code: 'TR', tail_algorithm: TailNumber.FromTRICAO},
  {prefix: '010011000', location_name: 'Yugoslavia', country_code: 'YU'},
  {prefix: '01001100100000', location_name: 'Cyprus', country_code: 'CY'},
  {prefix: '010011001010', location_name: 'Ireland', country_code: 'IE'},
  {prefix: '010011001100', location_name: 'Iceland', country_code: 'IS'},
  {prefix: '01001101000000', location_name: 'Luxembourg', country_code: 'LU'},
  {prefix: '01001101001000', location_name: 'Malta', country_code: 'MT'},
  {prefix: '01001101010000', location_name: 'Monaco', country_code: 'MC'},
  {prefix: '0101', location_name: 'EUR/NAT', country_code: null},
  {prefix: '01010000000000', location_name: 'San Marino', country_code: 'SM'},
  {prefix: '01010000000100', location_name: 'Albania', country_code: 'AL'},
  {prefix: '01010000000111', location_name: 'Croatia', country_code: 'HR'},
  {prefix: '01010000001011', location_name: 'Latvia', country_code: 'LV'},
  {prefix: '01010000001111', location_name: 'Lithuania', country_code: 'LT'},
  {prefix: '01010000010011', location_name: 'Republic of Moldova', country_code: 'MD'},
  {prefix: '01010000010111', location_name: 'Slovakia', country_code: 'SK'},
  {prefix: '01010000011011', location_name: 'Slovenia', country_code: 'SI'},
  {prefix: '01010000011111', location_name: 'Uzbekistan', country_code: 'UZ'},
  {prefix: '010100001', location_name: 'Ukraine', country_code: 'UA'},
  {prefix: '01010001000000', location_name: 'Belarus', country_code: 'BY'},
  {prefix: '01010001000100', location_name: 'Estonia', country_code: 'EE'},
  {prefix: '01010001001000', location_name: 'The former Yugoslav Republic of Macedonia', country_code: 'MK'},
  {prefix: '01010001001100', location_name: 'Bosnia and Herzegovina', country_code: 'BA'},
  {prefix: '01010001010000', location_name: 'Georgia', country_code: 'GE'},
  {prefix: '01010001010100', location_name: 'Tajikistan', country_code: 'TJ'},
  {prefix: '01100', location_name: 'MID', country_code: null},
  {prefix: '01100000000000', location_name: 'Armenia', country_code: 'AM'},
  {prefix: '01100000000010', location_name: 'Azerbaijan', country_code: 'AZ'},
  {prefix: '01100000000100', location_name: 'Kyrgyzstan', country_code: 'KG'},
  {prefix: '01100000000110', location_name: 'Turkmenistan', country_code: 'TM'},
  {prefix: '01101', location_name: 'ASIA', country_code: null},
  {prefix: '01101000000000', location_name: 'Bhutan', country_code: 'BT'},
  {prefix: '01101000000100', location_name: 'Micronesia, Federated States of', country_code: 'FM'},
  {prefix: '01101000001000', location_name: 'Mongolia', country_code: 'MN'},
  {prefix: '01101000001100', location_name: 'Kazakhstan', country_code: 'KZ'},
  {prefix: '01101000010000', location_name: 'Palau', country_code: 'PW'},
  {prefix: '011100000000', location_name: 'Afghanistan', country_code: 'AF'},
  {prefix: '011100000010', location_name: 'Bangladesh', country_code: 'BD'},
  {prefix: '011100000100', location_name: 'Myanmar', country_code: 'MM'},
  {prefix: '011100000110', location_name: 'Kuwait', country_code: 'KW'},
  {prefix: '011100001000', location_name: 'Lao People\'s Democratic Republic', country_code: 'LA'},
  {prefix: '011100001010', location_name: 'Nepal', country_code: 'NP'},
  {prefix: '01110000110000', location_name: 'Oman', country_code: 'OM'},
  {prefix: '011100001110', location_name: 'Cambodia', country_code: 'KH'},
  {prefix: '011100010', location_name: 'Saudi Arabia', country_code: 'SA'},
  {prefix: '011100011', location_name: 'Republic of Korea', country_code: 'KR', tail_algorithm: TailNumber.FromKRICAO},
  {prefix: '011100100', location_name: 'Democratic People\'s Republic of Korea', country_code: 'KP', tail_algorithm: TailNumber.FromKPICAO},
  {prefix: '011100101', location_name: 'Iraq', country_code: 'IQ'},
  {prefix: '011100110', location_name: 'Iran, Islamic Republic of', country_code: 'IR'},
  {prefix: '011100111', location_name: 'Israel', country_code: 'IL'},
  {prefix: '011101000', location_name: 'Jordan', country_code: 'JO', tail_algorithm: TailNumber.FromJOICAO},
  {prefix: '011101001', location_name: 'Lebanon', country_code: 'LB'},
  {prefix: '011101010', location_name: 'Malaysia', country_code: 'MY'},
  {prefix: '011101011', location_name: 'Philippines', country_code: 'PH'},
  {prefix: '011101100', location_name: 'Pakistan', country_code: 'PK', tail_algorithm: TailNumber.FromPKICAO},
  {prefix: '011101101', location_name: 'Singapore', country_code: 'SG', tail_algorithm: TailNumber.FromSGICAO},
  {prefix: '011101110', location_name: 'Sri Lanka', country_code: 'LK'},
  {prefix: '011101111', location_name: 'Syrian Arab Republic', country_code: 'SY', tail_algorithm: TailNumber.FromSYICAO},
  {prefix: '011110', location_name: 'China', country_code: 'CN'},
  {prefix: '011111', location_name: 'Australia', country_code: 'AU', tail_algorithm: TailNumber.FromAUICAO},
  {prefix: '100000', location_name: 'India', country_code: 'IN'},
  {prefix: '100001', location_name: 'Japan', country_code: 'JP', tail_algorithm: TailNumber.FromJPICAO},
  {prefix: '100010000', location_name: 'Thailand', country_code: 'TH', tail_algorithm: TailNumber.FromTHICAO},
  {prefix: '100010001', location_name: 'Viet Nam', country_code: 'VN'},
  {prefix: '100010010000', location_name: 'Yemen', country_code: 'YE'},
  {prefix: '100010010100', location_name: 'Bahrain', country_code: 'BH'},
  {prefix: '10001001010100', location_name: 'Brunei Darussalam', country_code: 'BN'},
  {prefix: '100010010110', location_name: 'United Arab Emirates', country_code: 'AE'},
  {prefix: '10001001011100', location_name: 'Solomon Islands', country_code: 'SB'},
  {prefix: '100010011000', location_name: 'Papua New Guinea', country_code: 'PG'},
  {prefix: '10001001100100', location_name: 'Taiwan', country_code: 'TW'},
  {prefix: '100010100', location_name: 'Indonesia', country_code: 'ID'},
  {prefix: '10010000000000', location_name: 'Marshall Islands', country_code: 'MH'},
  {prefix: '10010000000100', location_name: 'Cook Islands', country_code: 'CK'},
  {prefix: '10010000001000', location_name: 'Samoa', country_code: 'WS'},
  {prefix: '1001', location_name: 'NAM/PAC', country_code: null},
  {prefix: '1010', location_name: 'United States', country_code: 'US', tail_algorithm: TailNumber.FromUSICAO},
  {prefix: '1011', location_name: 'RESERVED', country_code: null},
  {prefix: '110000', location_name: 'Canada', country_code: 'CA', tail_algorithm: TailNumber.FromCAICAO},
  {prefix: '110010000', location_name: 'New Zealand', country_code: 'NZ'},
  {prefix: '110010001000', location_name: 'Fiji', country_code: 'FJ'},
  {prefix: '11001000101000', location_name: 'Nauru', country_code: 'NR'},
  {prefix: '11001000110000', location_name: 'Saint Lucia', country_code: 'LC'},
  {prefix: '11001000110100', location_name: 'Tonga', country_code: 'TO'},
  {prefix: '11001000111000', location_name: 'Kiribati', country_code: 'KI'},
  {prefix: '11001001000000', location_name: 'Vanuatu', country_code: 'VU'},
  {prefix: '1101', location_name: 'RESERVED', country_code: null},
  {prefix: '111000', location_name: 'Argentina', country_code: 'AR', tail_algorithm: TailNumber.FromARICAO},
  {prefix: '111001', location_name: 'Brazil', country_code: 'BR'},
  {prefix: '111010000000', location_name: 'Chile', country_code: 'CL'},
  {prefix: '111010000100', location_name: 'Ecuador', country_code: 'EC'},
  {prefix: '111010001000', location_name: 'Paraguay', country_code: 'PY'},
  {prefix: '111010001100', location_name: 'Peru', country_code: 'PE'},
  {prefix: '111010010000', location_name: 'Uruguay', country_code: 'UY'},
  {prefix: '111010010100', location_name: 'Bolivia', country_code: 'BO'},
  {prefix: '111011', location_name: 'CAR', country_code: null},
  {prefix: '111100000', location_name: 'ICAO', country_code: null},
  {prefix: '11110000100100', location_name: 'ICAO', country_code: null},
  {prefix: '1111', location_name: 'RESERVED', country_code: null},
  {prefix: '111111111111111111111111', location_name: 'BROADCAST', country_code: null},
]).map(function(entry) {
    var prefix_length = entry.prefix.length;
    var shift_by = (24 - prefix_length);
    var mask_value = ((1 << prefix_length) - 1) << shift_by;

    entry.mask = mask_value;
    entry.address = Number.parseInt(entry.prefix, 2) << shift_by;
    return entry;
}).sort(function(a, b) {
    // Sort prefixes by descending prefix length, such that the first match for the
    // prefix and mask will be the most specific for any given ICAO address.
    return a.prefix.length < b.prefix.length;
});

Address.GROUND_VEHICLES = ([
  // Source: NZ Advisory Circular AC 91-2
  {start: 0xC87E00, end: 0xC87EFF},
]).sort(function(a, b) {
  return a.start > b.start;
});

Address.MILITARY_VEHICLES = ([
  // Source: NZ Advisory Circular AC 91-2
  {start: 0xC87F00, end: 0xC87FFF},  // NZ

  // Source: live-military-mode-s.eu and some squinting at ranges
  {start: 0x447D00, end: 0x447DFF},  // AT
  {start: 0x44F000, end: 0x44F8FF},  // BE
  {start: 0x457C00, end: 0x457C0F},  // BU
  {start: 0x45F400, end: 0x45F4FF},  // DK
  {start: 0x467801, end: 0x4678FF},  // FI
  {start: 0x468001, end: 0x4683FF},  // GR
  {start: 0x46F480, end: 0x46F5FF},  // GR
  {start: 0x477FF1, end: 0x477FFF},  // HU
  {start: 0x4780C0, end: 0x47812F},  // NO
  {start: 0x480400, end: 0x4804FF},  // NL
  {start: 0x480800, end: 0x48087F},  // NL
  {start: 0x480C00, end: 0x480C3F},  // NL
  {start: 0x481000, end: 0x48107F},  // NL
  {start: 0x48D800, end: 0x48D8FF},  // PL
  {start: 0x497C00, end: 0x497CFF},  // PT
  {start: 0x498420, end: 0x498490},  // CZ
  {start: 0x4B7F50, end: 0x4B7FFF},  // CH
  {start: 0x4B8201, end: 0x4B82CF},  // TR
  {start: 0x7008F0, end: 0x700AFF},  // AF
  {start: 0x71DD00, end: 0x71DD20},  // KR
  {start: 0x71DF00, end: 0x71DF10},  // KR
  {start: 0x71F900, end: 0x71FCFF},  // KR
  {start: 0x738A00, end: 0x738AA0},  // IL
  {start: 0x738B40, end: 0x738B4F},  // IL
  {start: 0x7CF800, end: 0x7CF9FF},  // AU
  {start: 0xADFC00, end: 0xADFFFF},  // US
  {start: 0xAE0000, end: 0xAFFFFF},  // US
]).sort(function(a, b) {
  return a.start > b.start;
});
