const SIXBIT_TEST_CASES = [
    {data: '184633C31CA0', callsign: 'FDX3012 '},
    {data: '4CB5F5CB7DA0', callsign: 'SKW5276 '},
    {data: '3B9D75220820', callsign: 'N955H   '},
];

testThat('Decodes valid 6-bit callsigns', SIXBIT_TEST_CASES.every(
    function(input) {
        var actual = Callsign.Decode(fromHexBuf(input.data));
        return assertEqual(
            'Callsign.Decode("' + input.data + '")', input.callsign, actual);
    }));
