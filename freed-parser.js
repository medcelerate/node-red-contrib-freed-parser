module.exports = function(RED) {
    function ParseFreeDNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = parseFreeD(msg.payload);
            node.send(msg);
        });
    }
    RED.nodes.registerType("freed-parse", ParseFreeDNode);
}


function parseFreeD(packet) {
    let arrByte = Uint8Array.from(packet)
    let parsedObject = {};
    parsedObject.id    =    arrByte[1];
    parsedObject.pan   = (((arrByte[2]  << 24) | (arrByte[3]  << 16) | (arrByte[4]  << 8)) >> 8) / 32768; // 1/900 of a degree
    parsedObject.tilt  = (((arrByte[5]  << 24) | (arrByte[6]  << 16) | (arrByte[7]  << 8)) >> 8) / 32768; // 1/900 of a degree
    parsedObject.roll  = (((arrByte[8]  << 24) | (arrByte[9]  << 16) | (arrByte[10] << 8)) >> 8) / 32768; // 1/900 of a degree
    parsedObject.x     = (((arrByte[11] << 24) | (arrByte[12] << 16) | (arrByte[13] << 8)) >> 8) / 64; // movement is expressed in 1/64 of millimeter
    parsedObject.y     = (((arrByte[14] << 24) | (arrByte[15] << 16) | (arrByte[16] << 8)) >> 8) / 64; // movement is expressed in 1/64 of millimeter
    parsedObject.z     = (((arrByte[17] << 24) | (arrByte[18] << 16) | (arrByte[19] << 8)) >> 8) / 64; // movement is expressed in 1/64 of millimeter
    parsedObject.zoom  = ((((arrByte[20] << 24) | (arrByte[21] << 16) | (arrByte[22] << 8)) >> 8) - 1365)/2.73; // just a magic number
    parsedObject.focus = ((((arrByte[23] << 24) | (arrByte[24] << 16) | (arrByte[25] << 8)) >> 8) - 1365)/2.73; // just a magic number
    return parsedObject;
}