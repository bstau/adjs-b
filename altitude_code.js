/** Routines to decode altitude fields
 * @namespace
 */
class AltitudeCode {
  /** Check whether an altitude is coded as metric or imperial. */
  static IsMetric(ac) {
      return !!(ac & AC_METRIC_FLAG);
  }

  /** Check whether an altitude code uses a simple format or Gillham coding. */
  static IsSimpleFormat(ac) {
      return !!(ac & AC_LOW_ALTITUDE_FLAG);
  }

  /** Decode the simple form of altitude coding. */
  static DecodeSimpleFormat(ac) {
      return (ac & 0x000f) | (ac & 0x0020) >> 1 | (ac & 0x1f80) >> 2;
  }

  /** Helper function for Gillham coding. */
  static DeGray(value) {
      value ^= (value >> 8);
      value ^= (value >> 4);
      value ^= (value >> 2);
      value ^= (value >> 1);
      return value;
  }

  /** Decode a Gillham-encoded altitude. */
  static DeGillham(ac) {
      // Unpack the AC from interleaved order to the 8-bit 500ft units, and the
      // 3-bit 100ft units, packed as octal. Interleaved order is:
      // C1 A1 C2 A2 C4 A4 M B1 Q B2 D2 B4 D4, where M is metric, Q is unit size.

      var c1, a1, c2, a2, c4, a4, m, b1, q, b2, d2, b4, d4, zero;
      c1 =   !!(ac & 0x1000);
      a1 =   !!(ac & 0x0800);
      c2 =   !!(ac & 0x0400);
      a2 =   !!(ac & 0x0200);
      c4 =   !!(ac & 0x0100);
      a4 =   !!(ac & 0x0080);
      m =    !!(ac & 0x0040);
      b1 =   !!(ac & 0x0020);
      zero = !!(ac & 0x0010);
      b2 =   !!(ac & 0x0008);
      d2 =   !!(ac & 0x0004);
      b4 =   !!(ac & 0x0002);
      d4 =   !!(ac & 0x0001);

      // Combine the bits into their 500- and 100-ft components.
      var fivehundreds = AltitudeCode.DeGray(b4      | b2 << 1 | b1 << 2 |
                                a4 << 3 | a2 << 4 | a1 << 5 |
                                d4 << 6 | d2 << 7);
      var onehundreds = AltitudeCode.DeGray(c1 << 2 | c2 << 1 | c4);

      // We expect to never receive 0, 5 or 6 100ft units.
      if (onehundreds == 0 || onehundreds == 5 || onehundreds == 6) {
          throw "Invalid Gillham-coded altitude value.";
      }

      // 5 is instead coded as 7.
      if (onehundreds == 7) onehundreds = 5;

      // Invert the 100ft units for even 500ft values.
      if (fivehundreds % 2) onehundreds = 6 - onehundreds;

      // Return multiples of 100ft.
      return fivehundreds * 5 + onehundreds;
  }

  /** Decode an altitude code into feet above sea level. */
  static ToFt(ac) {
      if (AltitudeCode.IsMetric(ac)) {
          return AltitudeCode.ToMetres(ac) * 100 / (12 * 2.54);
      } else if (AltitudeCode.IsSimpleFormat(ac)) {
          return 25 * AltitudeCode.DecodeSimpleFormat(ac) - 1000;
      } else {
          return 100 * AltitudeCode.DeGillham(ac) - 1300;
      }

      return 0;
  }

  /** Decode an altitude code into metres above sea level. */
  static ToMetres(ac) {
      if (AltitudeCode.IsMetric(ac)) {
          throw "Metric altitude decoding is not supported.";
      } else {
          return AltitudeCode.ToFt(ac) * 12 * 2.54 / 100;
      }
  }
}
