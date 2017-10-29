// All Call Replies and Extended Squitter messages contain plaintext addresses
// and a valid CRC. These can be used as test cases to validate CRC calculation.
const VALID_ENCODED_MESSAGES = [
    '59A057B92BB985',
    '5DA25D05F5FCB9',
    '5FA9E89A332929',
    '59A7B574566A8E',
    '8DAAA83F99116F0E00C01A3AC50D',
    '8D780994E109010000000011D482',
    '8FAB3CFA9910AE9A906421152456',
];

// Messages that make use of the combined Address/Parity field, along with a
// pre-decoded address that we can use to validate the CRC implementation.
const MESSAGES_WITH_PARITY_ENCODED_ADDRESSES = [
    {msg: '000001915FB76D', address: 0xA9A8FC},
    {msg: '00A1833B1082DB', address: 0xA791AC},
    {msg: '0261819ACE890E', address: 0xABB459},
    {msg: '0281821B0CC57A', address: 0xA69CB2},
    {msg: '02A183BAB1CEFC', address: 0xA9D5E4},
    {msg: '200003923128CD', address: 0xA4A211},
    {msg: '2000059C14DCCC', address: 0xA52F51},
    {msg: '282803BCB8FF76', address: 0xA720EB},
    {msg: 'A020078002010000000000459607', address: 0xAD9C8D},
    {msg: 'C68C91A40C7DE4', address: 0xA8029D},
    {msg: 'CE3EE0A1DC459C0FE719FD84C119', address: 0x0},
    {msg: 'DAA275C8929A9D', address: 0x0},
];


testThat('Decodes CRCs from valid messages',
    VALID_ENCODED_MESSAGES.every(function(input) {
        var expected = 0;
        var actual = ModeSCRC(fromHexBuf(input));

        if (expected != actual) {
            console.error('Tried ModeSCRC("' + input + '"), got ' + actual +
                          ', expected ' + expected);
        }

        return expected == actual;
    }));

testThat('Extracts addresses from valid messages with address/parity',
    MESSAGES_WITH_PARITY_ENCODED_ADDRESSES.every(function(input) {
        var expected = input.address;
        var actual = ModeSCRC(fromHexBuf(input.msg));
        if (expected != actual) {
            console.error('Tried ModeSCRC("' + input.msg + '"), got 0x' +
                          actual.toString(16) + ', expected 0x' +
                          expected.toString(16));
        }

        return expected == actual;
    }));
