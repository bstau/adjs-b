/* Constants for decoding Mode S and ADS-B messages. */

/* Mode S Downlink formats
 *
 * These formats specify the length and payload format of messages from a Mode S
 * equipped aircraft to a ground station. There are short and long responses
 * defined in the protocol.
 */

var DF_TCAS_SHORT = 0;
var DF_SURV_ALTITUDE_REPLY = 4;
var DF_SURV_MODE_A_ID = 5;
var DF_ALL_CALL_REPLY = 11;
var DF_TCAS_LONG = 16;
var DF_EXT_SQUITTER = 17;
var DF_TIS_B = 18;
var DF_MIL_SQUITTER = 19;
var DF_COMM_B_ALT = 20;
var DF_COMM_B_MODE_A_ID = 21;
var DF_MILITARY = 22;
var DF_COMM_D_ELM = 24;


/* Short downlink formats are 56 bits, and consist of:
 *
 * 5 bits for the downlink format,
 * 27 bits for a surveillance and communication control word, and
 * 24 bits for a parity-encoded source address.
 */
var SHORT_DF_TYPES = [
    DF_TCAS_SHORT,
    DF_SURV_ALTITUDE_REPLY,
    DF_SURV_MODE_A_ID,
    DF_ALL_CALL_REPLY,
];


/* Long downlink formats are 112 bits, allowing for an additional message field
 * over the short downlink format. The message composition is:
 *
 * 5 bits for the downlink format,
 * 27 bits for a surveillance and communication control word,
 * 56 bits for a message, and
 * 24 bits for a parity-encoded source address.
 */
var LONG_DF_TYPES = [
    DF_TCAS_LONG,
    DF_EXT_SQUITTER,
    DF_TIS_B,
    DF_MIL_SQUITTER,
    DF_COMM_B_ALT,
    DF_COMM_B_MODE_A_ID,
    DF_MILITARY,
];


/* Extended-length downlink formats are 112 bits, just like long downlink
 * formats, but have a different structure within the message:
 *
 * 2 bits for the downlink format type,
 * 6 bits for a communication control word,
 * 80 bits for the message,
 * 24 bits for a parity-encoded source address.
 *
 * Given that three bits are sacrificed from the downlink format field to use in
 * communication control, all possible values of these three bits are included
 * in the downlink format list given the original 5-bit width.
 */
var EXTENDED_DF_TYPES = [
    DF_COMM_D_ELM,
    DF_COMM_D_ELM + 1,
    DF_COMM_D_ELM + 2,
    DF_COMM_D_ELM + 3,
    DF_COMM_D_ELM + 4,
    DF_COMM_D_ELM + 5,
    DF_COMM_D_ELM + 6,
    DF_COMM_D_ELM + 7,
];


/* Transponder capability field, used in the DF_ALL_CALL_REPLY. 3 bits.
 *
 * Values 4 through 7 are not defined in FAA 6365.1A.
 */
var CA_NO_EXTENDED_REPORT = 0;
var CA_COMM_A_B_REPORT = 1;
var CA_COMM_A_B_C_REPORT = 2;
var CA_COMM_A_B_C_D_REPORT = 3;


/* Type Codes for extended squitter payloads.
 *
 * When receiving a DF_EXT_SQUITTER frame, a 5-bit number following the downlink
 * format will identify the type of data included in the message field.
 */
var TC_AIRCRAFT_IDENTIFICATION_1 = 1;
var TC_AIRCRAFT_IDENTIFICATION_2 = 2;
var TC_AIRCRAFT_IDENTIFICATION_3 = 3;
var TC_AIRCRAFT_IDENTIFICATION_4 = 4;
var TC_AIRBORNE_POSITION_9 = 9;
var TC_AIRBORNE_POSITION_10 = 10;
var TC_AIRBORNE_POSITION_11 = 11;
var TC_AIRBORNE_POSITION_12 = 12;
var TC_AIRBORNE_POSITION_13 = 13;
var TC_AIRBORNE_POSITION_14 = 14;
var TC_AIRBORNE_POSITION_15 = 15;
var TC_AIRBORNE_POSITION_16 = 16;
var TC_AIRBORNE_POSITION_17 = 17;
var TC_AIRBORNE_POSITION_18 = 18;
var TC_AIRBORNE_VELOCITY = 19;

// GNSS position
var TC_AIRBORNE_POSITION_20 = 20;
var TC_AIRBORNE_POSITION_21 = 21;
var TC_AIRBORNE_POSITION_22 = 22;

var TC_EXTENDED_SQUITTER_AC_STATUS = 28;
var TC_TARGET_STATUS = 29;
var TC_AIRCRAFT_OP_STATUS = 31;


/* Binary Data Store register numbers.
 *
 * Avionics hardware maintains state in a set of registers known as Binary Data
 * Store registers. Typically, they are viewed as a pair of hex numbers, packed
 * together in a single byte. For example, BDS 0,5 will be addressed as 0x05,
 * and contains the position of the vehicle.
 */
var BDS_NOT_VALID = 0x00;
var BDS_UNASSIGNED = 0x01;
var BDS_COMM_B_SEGMENT_2 = 0x02;
var BDS_COMM_B_SEGMENT_3 = 0x03;
var BDS_COMM_B_SEGMENT_4 = 0x04;
var BDS_ES_AIRBORNE_POS = 0x05;
var BDS_ES_SURFACE_POS = 0x06;
var BDS_ES_STATUS = 0x07;
var BDS_ES_AC_ID_CATEGORY = 0x08;
var BDS_ES_AIRBORNE_VELOCITY = 0x09;
var BDS_ES_EVENT_REPORT = 0x0A;
var BDS_AIR_AIR_STATE = 0x0B;
var BDS_AIR_AIR_INTENT = 0x0C;
var BDS_AIR_AIR_STATE_RES1 = 0x0D;
var BDS_AIR_AIR_STATE_RES2 = 0x0E;
var BDS_ACAS_RESERVED = 0x0F;

var BDS_DATA_LINK_CAPABILITY = 0x10;
var BDS_DATA_LINK_CAP_RESERVED = 0x11;
var BDS_DATA_LINK_CAP_RESERV_2 = 0x12;
var BDS_DATA_LINK_CAP_RESERV_3 = 0x13;
var BDS_DATA_LINK_CAP_RESERV_4 = 0x14;
var BDS_DATA_LINK_CAP_RESERV_5 = 0x15;
var BDS_DATA_LINK_CAP_RESERV_6 = 0x16;
var BDS_GICB_CAPABILITY = 0x17;
var BDS_MODE_S_CAPABILITY_1 = 0x18;
var BDS_MODE_S_CAPABILITY_2 = 0x19;
var BDS_MODE_S_CAPABILITY_3 = 0x1A;
var BDS_MODE_S_CAPABILITY_4 = 0x1B;
var BDS_MODE_S_CAPABILITY_5 = 0x1C;
var BDS_MODE_S_CAPABILITY_6 = 0x1D;
var BDS_MODE_S_CAPABILITY_7 = 0x1E;
var BDS_MODE_S_CAPABILITY_8 = 0x1F;

var BDS_AIRCRAFT_IDENTITY = 0x20;
var BDS_AIRCRAFT_MARKINGS = 0x21;
var BDS_ANTENNA_POSITIONS = 0x22;
var BDS_ANTENNA_POSITION_RESERVED = 0x23;
var BDS_AIRCRAFT_PARAMS_RESERVED = 0x24;
var BDS_AIRCRAFT_TYPE = 0x25;

var BDS_ACAS_RESOLUTION = 0x30;
var BDS_VERTICAL_INTENT = 0x40;
var BDS_NEXT_WAYPOINT_ID = 0x41;
var BDS_NEXT_WAYPOINT_POS = 0x42;
var BDS_NEXT_WAYPOINT_INFO = 0x43;
var BDS_MET_AIR_REPORT = 0x44;
var BDS_MET_HAZARD_REPORT = 0x45;
var BDS_FMS_MODE_1 = 0x46;
var BDS_FMS_MODE_2 = 0x47;
var BDS_VHF_CHAN_REPORT = 0x48;

var BDS_TRACK_AND_TURN = 0x50;
var BDS_POSITION_COARSE = 0x51;
var BDS_POSITION_FINE = 0x52;
var BDS_AIR_REF_STATE = 0x53;
var BDS_WAYPOINT_1 = 0x54;
var BDS_WAYPOINT_2 = 0x55;
var BDS_WAYPOINT_3 = 0x56;
var BDS_STATIC_PARAM_MON = 0x58;

var BDS_HEADING_AND_SPEED = 0x60;
var BDS_ES_EMERGENCY_STATUS = 0x61;
var BDS_TRAJ_CHANGE_POINT = 0x62;
var BDS_NEXT_TRAJ_CHANGE_PT = 0x63;
var BDS_OPERATIONAL_COORD = 0x64;
var BDS_OPERATIONAL_STATUS = 0x65;
var BDS_MODE_S_BITE_1 = 0xE1;
var BDS_MODE_S_BITE_2 = 0xE2;
var BDS_MILITARY_1 = 0xF1;
var BDS_MILITARY_2 = 0xF2;


