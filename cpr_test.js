var NL_TEST_VECTORS = [
    {lat: 0, nl: 59},
    {lat: -0, nl: 59},
    {lat: 1, nl: 59},
    {lat: -1, nl: 59},
    {lat: 10, nl: 59},
    {lat: -10, nl: 59},
    {lat: 11, nl: 58},
    {lat: -11, nl: 58},
    {lat: 15, nl: 57},
    {lat: -15, nl: 57},
    {lat: 25, nl: 54},
    {lat: -25, nl: 54},
    {lat: 40, nl: 45},
    {lat: -40, nl: 45},
    {lat: 43, nl: 43},
    {lat: -43, nl: 43},
    {lat: 60, nl: 29},
    {lat: -60, nl: 29},
    {lat: 80, nl: 10},
    {lat: -80, nl: 10},
    {lat: 90, nl: 1},
    {lat: -90, nl: 1},

    /* Test bad inputs - wraparound. */
    {lat: 120, nl: 29},
    {lat: -120, nl: 29},
    {lat: 137, nl: 43},
    {lat: -137, nl: 43},
];

var AIRBORNE = CPR.NUM_BITS_AIRBORNE;

var CPR_TEST_VECTORS = [
    {lat: 0, lng: 0, bits: AIRBORNE, is_odd: false, cpr_lat: 0, cpr_lng: 0},
    {lat: 0, lng: 0, bits: AIRBORNE, is_odd: true,  cpr_lat: 0, cpr_lng: 0},
    // Test that almost-90 degrees is the maximal value.
    {lat: 89.99995, lng: 0, bits: AIRBORNE, is_odd: false,
     cpr_lat: 131071, cpr_lng: 0},
    {lat: 89.99995, lng: 0, bits: AIRBORNE, is_odd: true,
     cpr_lat: 131071, cpr_lng: 0},
    {lat: 90, lng: 0, bits: AIRBORNE, is_odd: false, cpr_lat: 0, cpr_lng: 0},
    {lat: 90, lng: 0, bits: AIRBORNE, is_odd: true,  cpr_lat: 0, cpr_lng: 0},
];

testThat('Calculates correct number of longitude zones', NL_TEST_VECTORS.every(
    function(input) {
        return assertEqual('CPR.NL(' + input.lat + ')', input.nl,
            CPR.NL(input.lat));
    }));

testThat('Calculates CPR for coordinates', CPR_TEST_VECTORS.every(
    function(input) {
        var output = CPR.Encode(input.lat, input.lng, input.is_odd, input.bits);
        var call = ('CPR.Encode(' + input.lat + ', ' + input.lng + ', ' +
                    input.is_odd + ', ' + input.bits + ')');
        return (
            assertEqual(call + '.lat', input.cpr_lat, output.lat) &&
            assertEqual(call + '.lng', input.cpr_lng, output.lng));
    }));
