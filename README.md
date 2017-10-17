# ADJS-B: Mode S parsing in JavaScript

This is a set of libraries to parse Mode S frames, and common payloads used for
aircraft identification and ADS-B (CPR location encoding, tail number to ICAO
24-bit address encoding, altitude codes).

The library is broken down into the following components:

- [Altitude Code encoding/decoding](altitude_code.js)
- [Tail number to ICAO 24-bit address conversion](callsign.js)
- [Compact Position Reporting (CPR) decoding](cpr.js)
- [ADS-B and AIS 6-bit characters to ASCII conversion](ext_squitter_callsign.js)
- [CRC generation for Mode S frames](mode_s_crc.js)
- [Decoding of packed Mode S frames](mode_s_message.js)

