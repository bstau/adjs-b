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
    {icao: 0xC00001, country: 'CA', tail_number: 'CF-AAA'},
    {icao: 0xC002A5, country: 'CA', tail_number: 'CF-BAA'},
    {icao: 0xC00AFC, country: 'CA', tail_number: 'CF-EED'},
    {icao: 0xC044A8, country: 'CA', tail_number: 'CF-ZZZ'},
    {icao: 0xC044A9, country: 'CA', tail_number: 'CG-AAA'},
    {icao: 0xC08950, country: 'CA', tail_number: 'CG-ZZZ'},
    {icao: 0xC08951, country: 'CA', tail_number: 'CI-AAA'},
    {icao: 0xC0CDF8, country: 'CA', tail_number: 'CI-ZZZ'},

    {icao: 0x380000, country: 'FR', tail_number: 'F-BAAA'},
    {icao: 0x380020, country: 'FR', tail_number: 'F-BABA'},
    {icao: 0x380400, country: 'FR', tail_number: 'F-BBAA'},
    {icao: 0x386400, country: 'FR', tail_number: 'F-BZAA'},
    {icao: 0x380332, country: 'FR', tail_number: 'F-BAZS'},
    {icao: 0x381E4C, country: 'FR', tail_number: 'F-BHSM'},

    {icao: 0x390000, country: 'FR', tail_number: 'F-GAAA'},
    {icao: 0x390083, country: 'FR', tail_number: 'F-GAED'},
    {icao: 0x398000, country: 'FR', tail_number: 'F-HAAA'},
    {icao: 0x398001, country: 'FR', tail_number: 'F-HAAB'},
    {icao: 0x39E739, country: 'FR', tail_number: 'F-HZZZ'},
    {icao: 0x3A0000, country: 'FR', tail_number: 'F-OAAA'},
    {icao: 0x3A2208, country: 'FR', tail_number: 'F-OIQI'},
    {icao: 0x3A6739, country: 'FR', tail_number: 'F-OZZZ'},

    // The UK does not have predictable tail number to ICAO mappings.
    {icao: 0x404000, country: 'GB'},
    {icao: 0x404001, country: 'GB'},

];

testThat('Determines correct country code from ICAO addresses', EXPECTED_TAIL_NUMBERS.every(
    function(input) {
        return assertEqual('ICAOToCountry(0x' + input.icao.toString(16) + ')',
            input.country, ICAOToCountry(input.icao));
    }));

testThat('Resolves ICAO address to national tail number', EXPECTED_TAIL_NUMBERS.every(
	function(input) {
        if (!input.tail_number) return true;

		return assertEqual('ICAOToTailNumber(0x' + input.icao.toString(16) + ')',
			input.tail_number, ICAOToTailNumber(input.icao));
	}));
