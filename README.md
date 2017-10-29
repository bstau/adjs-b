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

## Alternate Implementations

These projects implement decoders for Mode S and ADS-B payloads:

- [pyModeS](https://github.com/junzis/pyModeS)
- [java-adsb](https://github.com/openskynetwork/java-adsb)
- [dump1090](https://github.com/antirez/dump1090)

## References

- [FAA 6360.15A - Mode S Project Implementation Plan](https://www.faa.gov/documentLibrary/media/Order/6360.15A.pdf)
- [ADS-B Decoding Guide](http://adsb-decode-guide.readthedocs.io/en/latest/index.html)
- [ICAO Doc 9871 - Mode S Services and Extended Squitter](https://store.icao.int/publications/technical-provisions-for-mode-s-services-and-extended-squitter-doc-9871-english-printed.html)
- [AIS Character Set](http://www.catb.org/gpsd/AIVDM.html#_ais_payload_data_types)
