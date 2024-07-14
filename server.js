const dgram = require('dgram');
const stun = require('stun');

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    const message = stun.decode(msg);

    if (message.method === stun.constants.methods.BINDING) {
        const response = stun.createMessage(stun.constants.methods.BINDING, message.transactionId);
        response.addXorAddress(rinfo.address, rinfo.port);

        server.send(response.toBuffer(), rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Error sending response:', err);
            } else {
                console.log('Response sent to', rinfo.address, rinfo.port);
            }
        });
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`STUN server listening on ${address.address}:${address.port}`);
});

server.bind(process.env.PORT || 3478, '0.0.0.0');
