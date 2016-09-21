/** Utility functions to decode the Compact Position Reporting format.
 *
 * CPR uses a latitude-aware mapping to better optimise the use of bits
 */


var NUM_BITS_AIRBORNE = 17;
var NUM_BITS_SURFACE = 19;
var NUM_BITS_TCP = 14;

// Defines the unambiguous range for decoding. For example, given that
// the distance from the equator to the poles is 5410 nautical miles, having
// 15 zones means that the unambiguous range is 360nm.
var NUM_LATITUDE_ZONES = 15;

// The number of longitude zones varies from equator to pole, and ranges from
// 1 to 59 for CPR in ADS-B. This function calculates the number of zones,
// given a latitude.
function NL(latitude) {
    var nz = 15;
    var nl = Math.floor(
        2 * Math.PI / Math.acos(
        1 - (
            (1 - Math.cos(0.5 * Math.PI / nz)) 
              / 
            Math.pow(Math.cos(Math.PI / 180 * Math.abs(latitude)), 2))));

    if (isNaN(nl)) return 1;
    return Math.min(59, Math.max(1, nl));
}

// A compact position representation consists of two different
// encodings; an odd and an even encoding which alter the number
// of zones in both axes. The position representation only refers
// to the position with the local zone, which is roughly 360 nm
// by 360 nm, except at the poles.
//
// Using N and N-1 zones allows the receiver to unambiguously
// determine the global position based on a pair of odd and even
// position reports that are received for the same zone.
// 
// Specifically, the difference between the odd and even CPR for
// the same coordinate ranges from 0 to 2^bits from 0 to 90 deg.
// 
// If the rough location of the vehicle is known, to the
// precision of the CPR zone, either position report is
// sufficient to determine the global coordinate.
function EncodeCPR(lat, lng, is_odd, bits) {
    var i = is_odd ? 1 : 0;
    var zone_lat_height = 90.0 / (NUM_LATITUDE_ZONES - i);
    var zone_lng_width = 360.0 / Math.max(1, NL(lat) - i);

    var xz = Math.floor(0.5 + Math.pow(2, bits) *
                        (lng % zone_lng_width) / zone_lng_width);
    var yz = Math.floor(0.5 + Math.pow(2, bits) *
                        (lat % zone_lat_height) / zone_lat_height);

    xz %= Math.pow(2, bits);
    yz %= Math.pow(2, bits);

    return {lng: xz, lat: yz};
}
