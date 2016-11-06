var EXPECTED_TAIL_NUMBERS = [
    {icao: 0xA37646, country: 'US', tail_number: 'N322FL'},
    {icao: 0xA471AC, country: 'US', tail_number: 'N386AZ'},
    {icao: 0xA00001, country: 'US', tail_number: 'N1'},
    {icao: 0xA00002, country: 'US', tail_number: 'N1A'},
    {icao: 0xA00003, country: 'US', tail_number: 'N1AA'},
    {icao: 0xA00259, country: 'US', tail_number: 'N1ZZ'},
    {icao: 0xA0025A, country: 'US', tail_number: 'N10'},
    {icao: 0xA029D9, country: 'US', tail_number: 'N11'},
    {icao: 0xA02C31, country: 'US', tail_number: 'N11ZZ'},
    {icao: 0xA05B1F, country: 'US', tail_number: 'N122'},
    {icao: 0xA18D50, country: 'US', tail_number: 'N2'},
    {icao: 0xABFFFF, country: 'US', tail_number: 'N872YW'},
    {icao: 0xADF640, country: 'US', tail_number: 'N999YH'},
    {icao: 0xADF650, country: 'US', tail_number: 'N999YZ'},
    {icao: 0xADF68D, country: 'US', tail_number: 'N9991'},
    {icao: 0xADF790, country: 'US', tail_number: 'N9998P'},
    {icao: 0xADF7C7, country: 'US', tail_number: 'N99999'},
    {icao: 0xA471AC, country: 'US', tail_number: 'N386AZ'},
    {icao: 0x7C39B3, country: 'AU', tail_number: 'VH-LOL'},
    {icao: 0x7C4771, country: 'AU', tail_number: 'VH-OEB'},
];

testThat('Determines correct country code from ICAO addresses', EXPECTED_TAIL_NUMBERS.every(
    function(input) {
        return assertEqual('ICAOToCountry(0x' + input.icao.toString(16) + ')',
            input.country, ICAOToCountry(input.icao));
    }));

testThat('Resolves ICAO address to national tail number', EXPECTED_TAIL_NUMBERS.every(
	function(input) {
		return assertEqual('ICAOToTailNumber(0x' + input.icao.toString(16) + ')',
			input.tail_number, ICAOToTailNumber(input.icao));
	}));
