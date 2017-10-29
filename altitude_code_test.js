const TEST_CASES = [
    {ac: 0x0F4F, metric: true, simple: false},
    {ac: 0x0100, metric: false, simple: false, altitude_ft:  -1200},
    {ac: 0x0500, metric: false, simple: false, altitude_ft:  -1100},
    {ac: 0x0400, metric: false, simple: false, altitude_ft:  -1000},
    {ac: 0x1400, metric: false, simple: false, altitude_ft:   -900},
    {ac: 0x1000, metric: false, simple: false, altitude_ft:   -800},
    {ac: 0x1002, metric: false, simple: false, altitude_ft:   -700},
    {ac: 0x1402, metric: false, simple: false, altitude_ft:   -600},
    {ac: 0x0402, metric: false, simple: false, altitude_ft:   -500},
    {ac: 0x0502, metric: false, simple: false, altitude_ft:   -400},
    {ac: 0x0102, metric: false, simple: false, altitude_ft:   -300},
    {ac: 0x010a, metric: false, simple: false, altitude_ft:   -200},
    {ac: 0x050a, metric: false, simple: false, altitude_ft:   -100},
    {ac: 0x040a, metric: false, simple: false, altitude_ft:      0},
    {ac: 0x0108, metric: false, simple: false, altitude_ft:    700},
    {ac: 0x0128, metric: false, simple: false, altitude_ft:    800},
    {ac: 0x0120, metric: false, simple: false, altitude_ft:   2700},
    {ac: 0x01a0, metric: false, simple: false, altitude_ft:   2800},
    {ac: 0x0180, metric: false, simple: false, altitude_ft:   6700},
    {ac: 0x0380, metric: false, simple: false, altitude_ft:   6800},
    {ac: 0x1620, metric: false, simple: false, altitude_ft:  11100},
    {ac: 0x0300, metric: false, simple: false, altitude_ft:  14700},
    {ac: 0x0b00, metric: false, simple: false, altitude_ft:  14800},
    {ac: 0x1e22, metric: false, simple: false, altitude_ft:  18100},
    {ac: 0x0e82, metric: false, simple: false, altitude_ft:  22000},
    {ac: 0x0900, metric: false, simple: false, altitude_ft:  30700},
    {ac: 0x0901, metric: false, simple: false, altitude_ft:  30800},
    {ac: 0x0101, metric: false, simple: false, altitude_ft:  62700},
    {ac: 0x0105, metric: false, simple: false, altitude_ft:  62800},
    {ac: 0x0905, metric: false, simple: false, altitude_ft:  94700},
    {ac: 0x0904, metric: false, simple: false, altitude_ft:  94800},
    {ac: 0x10a6, metric: false, simple: false, altitude_ft: 122200},
    {ac: 0x0104, metric: false, simple: false, altitude_ft: 126700},
    {ac: 0x0010, metric: false, simple: true,  altitude_ft:  -1000},
    {ac: 0x001f, metric: false, simple: true,  altitude_ft:   -625},
    {ac: 0x0030, metric: false, simple: true,  altitude_ft:   -600},
    {ac: 0x003f, metric: false, simple: true,  altitude_ft:   -225},
    {ac: 0x0090, metric: false, simple: true,  altitude_ft:   -200},
    {ac: 0x0098, metric: false, simple: true,  altitude_ft:      0},
    {ac: 0x06b8, metric: false, simple: true,  altitude_ft:  10000},
    {ac: 0x1fbf, metric: false, simple: true,  altitude_ft:  50175},
];

testThat('Detects metric altitude codes', TEST_CASES.every(
    function(input) {
        return assertEqual(
            'AltitudeCode.IsMetric(0x' + input.ac.toString(16) + ')',
            input.metric, AltitudeCode.IsMetric(input.ac));
    }));

testThat('Detects simple altitude format', TEST_CASES.every(
    function(input) {
        return assertEqual(
            'AltitudeCode.IsSimpleFormat(0x' + input.ac.toString(16) + ')',
            input.simple, AltitudeCode.IsSimpleFormat(input.ac));
    }));

testThat('Decodes imperial altitudes', TEST_CASES.every(
    function(input) {
        if (input.metric) return true;
        if (input.altitude_ft === undefined) return true;

        return assertEqual(
            'AltitudeCode.ToFt(0x' + input.ac.toString(16) + ')',
            input.altitude_ft, AltitudeCode.ToFt(input.ac));
    }));
