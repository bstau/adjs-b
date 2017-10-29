const TEST_CASES = [
    {data: '184633C31CA0', callsign: 'FDX3012 '},
    {data: '4CB5F5CB7DA0', callsign: 'SKW5276 '},
    {data: '3B9D75220820', callsign: 'N955H   '},
];

testThat('Decodes valid 6-bit callsigns', TEST_CASES.every(
    function(input) {
        var actual = decodeCallsign(fromHexBuf(input.data));
        return assertEqual(
            'decodeCallsign("' + input.data + '")', input.callsign, actual);
    }));
