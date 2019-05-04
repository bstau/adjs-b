const EXPECTED_TAIL_NUMBERS = [
    {icao: 0xA37646, country: 'US', tail_number: 'N322FL'},
    {icao: 0xA471AC, country: 'US', tail_number: 'N386AZ'},
    {icao: 0xA00725, country: 'US', tail_number: 'N10000'},
    {icao: 0xA41743, country: 'US', tail_number: 'N36280'},
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
    {icao: 0x392AE7, country: 'FR', tail_number: 'F-GKXH'},
    {icao: 0x398000, country: 'FR', tail_number: 'F-HAAA'},
    {icao: 0x398001, country: 'FR', tail_number: 'F-HAAB'},
    {icao: 0x39E739, country: 'FR', tail_number: 'F-HZZZ'},
    {icao: 0x3A0000, country: 'FR', tail_number: 'F-OAAA'},
    {icao: 0x3A2208, country: 'FR', tail_number: 'F-OIQI'},
    {icao: 0x3A6739, country: 'FR', tail_number: 'F-OZZZ'},

    {icao: 0x3C4586, country: 'DE', tail_number: 'D-AALF'},
    {icao: 0x3C4A21, country: 'DE', tail_number: 'D-ABQA'},
    {icao: 0x3C4B4B, country: 'DE', tail_number: 'D-ABZK'},
    {icao: 0x3C5061, country: 'DE', tail_number: 'D-ADCA'},
    {icao: 0x3C5422, country: 'DE', tail_number: 'D-AEAB'},
    {icao: 0x3C5423, country: 'DE', tail_number: 'D-AEAC'},
    {icao: 0x3C5443, country: 'DE', tail_number: 'D-AEBC'},
    {icao: 0x3C5461, country: 'DE', tail_number: 'D-AECA'},
    {icao: 0x3C5EE4, country: 'DE', tail_number: 'D-AGWD'},
    {icao: 0x3C5EEE, country: 'DE', tail_number: 'D-AGWN'},
    {icao: 0x3C5EF0, country: 'DE', tail_number: 'D-AGWP'},
    {icao: 0x3C5EFA, country: 'DE', tail_number: 'D-AGWZ'},
    {icao: 0x3C6501, country: 'DE', tail_number: 'D-AIHA'},
    {icao: 0x3C6581, country: 'DE', tail_number: 'D-AILA'},
    {icao: 0x3C658E, country: 'DE', tail_number: 'D-AILN'},
    {icao: 0x3C682E, country: 'DE', tail_number: 'D-AJAN'},
    {icao: 0x3C742A, country: 'DE', tail_number: 'D-AMAJ'},
    {icao: 0x3C6675, country: 'DE', tail_number: 'D-AISU'},
    {icao: 0x3C7D82, country: 'DE', tail_number: 'D-AOLB'},
    {icao: 0x3C001D, country: 'DE', tail_number: 'D-APBC'},
    {icao: 0x3C00AF, country: 'DE', tail_number: 'D-APGS'},
    {icao: 0x3C0121, country: 'DE', tail_number: 'D-APLC'},
    {icao: 0x3C01EF, country: 'DE', tail_number: 'D-APTA'},
    {icao: 0x3C065B, country: 'DE', tail_number: 'D-ARKO'},
    {icao: 0x3C073B, country: 'DE', tail_number: 'D-ARTE'},
    {icao: 0x3C07CA, country: 'DE', tail_number: 'D-ARYR'},
    {icao: 0x3C0A4F, country: 'DE', tail_number: 'D-ASXM'},
    {icao: 0x3C0CA4, country: 'DE', tail_number: 'D-ATUL'},
    {icao: 0x3C12D6, country: 'DE', tail_number: 'D-AWDL'},
    {icao: 0x3C1524, country: 'DE', tail_number: 'D-AXAD'},
    {icao: 0x3C1529, country: 'DE', tail_number: 'D-AXAI'},
    {icao: 0x3C153A, country: 'DE', tail_number: 'D-AXAZ'},
    {icao: 0x3C17CD, country: 'DE', tail_number: 'D-AYAI'},
    {icao: 0x3C1A75, country: 'DE', tail_number: 'D-AZAM'},
    {icao: 0x3C1C82, country: 'DE', tail_number: 'D-AZUR'},
    {icao: 0x3C1C8A, country: 'DE', tail_number: 'D-AZUZ'},
    {icao: 0x3C1D0C, country: 'DE', tail_number: 'D-AZZZ'},
    {icao: 0x3C848F, country: 'DE', tail_number: 'D-BADO'},
    {icao: 0x3CB424, country: 'DE', tail_number: 'D-BMAD'},
    {icao: 0x3CBC49, country: 'DE', tail_number: 'D-BOBI'}, 
    {icao: 0x3c2001, country: 'DE', tail_number: 'D-BPAA'},
    {icao: 0x3C27ED, country: 'DE', tail_number: 'D-BSAA'},
    {icao: 0x3C2909, country: 'DE', tail_number: 'D-BSKY'},
    {icao: 0x3C290B, country: 'DE', tail_number: 'D-BSLA'},
    {icao: 0x3C293F, country: 'DE', tail_number: 'D-BSNA'},
    {icao: 0x3c2a91, country: 'DE', tail_number: 'D-BTAA'},
    {icao: 0x3c2af9, country: 'DE', tail_number: 'D-BTEA'},
    {icao: 0x3C2B06, country: 'DE', tail_number: 'D-BTEN'},
    {icao: 0x3CC013, country: 'DE', tail_number: 'D-CAAT'},
    {icao: 0x3CC01B, country: 'DE', tail_number: 'D-CABB'},
    {icao: 0x3CD7C9, country: 'DE', tail_number: 'D-CJAF'},
    {icao: 0x3CE629, country: 'DE', tail_number: 'D-COLT'},
    {icao: 0x3CE8DC, country: 'DE', tail_number: 'D-CPMI'},
    {icao: 0x3CEF8E, country: 'DE', tail_number: 'D-CSAG'},
    {icao: 0x3CF4EA, country: 'DE', tail_number: 'D-CUBA'},
    {icao: 0x3CF68E, country: 'DE', tail_number: 'D-CURE'},
    {icao: 0x3CF69D, country: 'DE', tail_number: 'D-CURT'},
    {icao: 0x3CF77C, country: 'DE', tail_number: 'D-CVAI'},
    {icao: 0x3CF9AB, country: 'DE', tail_number: 'D-CVVV'},
    {icao: 0x3CFAFB, country: 'DE', tail_number: 'D-CWIT'},
    {icao: 0x3CFDEC, country: 'DE', tail_number: 'D-CXLS'},
    {icao: 0x3D0073, country: 'DE', tail_number: 'D-CYKP'},
    {icao: 0x3D04A7, country: 'DE', tail_number: 'D-CZZZ'},
    {icao: 0x3D04EE, country: 'DE', tail_number: 'D-EACS'},
    {icao: 0x3D08E4, country: 'DE', tail_number: 'D-EBPS'},
    {icao: 0x3D08E4, country: 'DE', tail_number: 'D-EBPS'},
    {icao: 0x3D1725, country: 'DE', tail_number: 'D-EHAB'},
    {icao: 0x3D471C, country: 'DE', tail_number: 'D-EZEI'},
    {icao: 0x3D4959, country: 'DE', tail_number: 'D-FAAJ'},
    {icao: 0x3D8E25, country: 'DE', tail_number: 'D-GABT'},
    {icao: 0x3DDD72, country: 'DE', tail_number: 'D-HECO'},
    {icao: 0x3E1766, country: 'DE', tail_number: 'D-IABE'},
    {icao: 0x3E6858, country: 'DE', tail_number: 'D-KESE'},
    {icao: 0x3E7968, country: 'DE', tail_number: 'D-KLEE'},
    {icao: 0x3E7ECD, country: 'DE', tail_number: 'D-KNFH'},
    {icao: 0x3E7F2B, country: 'DE', tail_number: 'D-KNIX'},
    {icao: 0x3EC0FA, country: 'DE', tail_number: 'D-KOAS'},
    {icao: 0x3EDE68, country: 'DE', tail_number: 'D-KZEM'},
    {icao: 0x3EE07E, country: 'DE', tail_number: 'D-KZZA'},
    {icao: 0x3EE097, country: 'DE', tail_number: 'D-KZZZ'},

    /* Mappings for German registrations get weird from here on.
     * M-numbers are for ultralights, O-numbers for balloons, and digits for
     * gliders and sailplanes. Still to be implemented. */

    {icao: 0x448421, country: 'BE', tail_number: 'OO-AAA'},
    {icao: 0x448432, country: 'BE', tail_number: 'OO-AAR'},
    {icao: 0x448441, country: 'BE', tail_number: 'OO-ABA'},
    {icao: 0x448463, country: 'BE', tail_number: 'OO-ACC'},
    {icao: 0x448483, country: 'BE', tail_number: 'OO-ADC'},
    {icao: 0x448616, country: 'BE', tail_number: 'OO-APV'},
    {icao: 0x44AC21, country: 'BE', tail_number: 'OO-KAA'},
    {icao: 0x44C0A7, country: 'BE', tail_number: 'OO-PEG'},
    {icao: 0x44C831, country: 'BE', tail_number: 'OO-RAQ'},
    {icao: 0x44D024, country: 'BE', tail_number: 'OO-TAD'},
    {icao: 0x44D5FA, country: 'BE', tail_number: 'OO-UOZ'},
    {icao: 0x44D841, country: 'BE', tail_number: 'OO-VBA'},
    {icao: 0x44D8D2, country: 'BE', tail_number: 'OO-VFR'},
    {icao: 0x44D962, country: 'BE', tail_number: 'OO-VKB'},
    {icao: 0x44E193, country: 'BE', tail_number: 'OO-XLS'},
    {icao: 0x44DED3, country: 'BE', tail_number: 'OO-WVS'},

    /* Belgium has a whole range (0xDD9A/DD9B) for gliders too. */

    {icao: 0x460041, country: 'FI', tail_number: 'OH-ACN'},
    {icao: 0x46005A, country: 'FI', tail_number: 'OH-ADM'},
    {icao: 0x460074, country: 'FI', tail_number: 'OH-AEM'},
    {icao: 0x4601E0, country: 'FI', tail_number: 'OH-ASM'},
    {icao: 0x46053A, country: 'FI', tail_number: 'OH-BZM'},
    {icao: 0x461FA5, country: 'FI', tail_number: 'OH-LZP'},
    {icao: 0x461F49, country: 'FI', tail_number: 'OH-LWB'},
    {icao: 0x463F27, country: 'FI', tail_number: 'OH-XXV'},
    {icao: 0x46427F, country: 'FI', tail_number: 'OH-ZET'},
    {icao: 0x46594F, country: 'FI', tail_number: 'OH-383'},
    {icao: 0x465958, country: 'FI', tail_number: 'OH-392'},
    {icao: 0x465A56, country: 'FI', tail_number: 'OH-646'},
    {icao: 0x465BBA, country: 'FI', tail_number: 'OH-1002'},
    {icao: 0x465BC2, country: 'FI', tail_number: 'OH-1010'},

    {icao: 0x4B0034, country: 'CH', tail_number: 'HB-ACA'},
    {icao: 0x4B02C7, country: 'CH', tail_number: 'HB-BBJ'},
    {icao: 0x4B02CE, country: 'CH', tail_number: 'HB-BBQ'},
    {icao: 0x4B02DE, country: 'CH', tail_number: 'HB-BCG'},
    {icao: 0x4B17F9, country: 'CH', tail_number: 'HB-JCB'},
    {icao: 0x4B445C, country: 'CH', tail_number: 'HB-ZXC'},
    {icao: 0x4B448D, country: 'CH', tail_number: 'HB-ZYZ'},

    {icao: 0x49106C, country: 'PT', tail_number: 'CS-DCL'},
    {icao: 0x495285, country: 'PT', tail_number: 'CS-TTE'},
    {icao: 0x4952C2, country: 'PT', tail_number: 'CS-TVB'},

    {icao: 0x4690EE, country: 'GR', tail_number: 'SX-DGN'},
    {icao: 0x46B428, country: 'GR', tail_number: 'SX-MAH'},

    // The UK does not have predictable tail number to ICAO mappings.
    {icao: 0x404000, country: 'GB'},
    {icao: 0x404001, country: 'GB'},

    // A few common planes spotted in the skies over SFO.
    {icao: 0x71BF32, country: 'KR'},
    {icao: 0x7800EB, country: 'CN'},
    {icao: 0x89901A, country: 'TW'},
    {icao: 0x484006, country: 'NL'},
    {icao: 0x47C5C9, country: 'NO'},
    {icao: 0x4B18FF, country: 'CH'},
    {icao: 0x345115, country: 'ES'},

];

testThat('Determines correct country code from ICAO addresses', EXPECTED_TAIL_NUMBERS.every(
    function(input) {
        return assertEqual('Address.ToCountry(0x' + input.icao.toString(16) + ')',
            input.country, Address.ToCountry(input.icao));
    }));

testThat('Resolves ICAO address to national tail number', EXPECTED_TAIL_NUMBERS.every(
    function(input) {
        if (!input.tail_number) return true;

        return assertEqual('Address.ToTailNumber(0x' + input.icao.toString(16) + ')',
            input.tail_number, Address.ToTailNumber(input.icao));
    }));
