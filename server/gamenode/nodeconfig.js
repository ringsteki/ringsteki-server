var config = {
    secret: process.env.RINGSTEKI_SECRET,
    mqUrl: process.env.RINGSTEKI_MQURL || 'tcp://127.0.0.1:6000',
    socketioPort: process.env.SOCKET_IO_PORT || 9500, // This is the port for the game node to listen on
    nodeIdentity: process.env.RINGSTEKI_NODE_IDENTITY || 'test1', // This is the identity of the node,
    host: process.env.RINGSTEKI_NODE_HOST || 'localhost'
};

module.exports = config;
