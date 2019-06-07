var config = {
    secret: process.env.RINGSTEKI_SECRET,
    hmacSecret: process.env.RINGSTEKI_HMAC_SECRET,
    dbPath: process.env.RINGSTEKI_DBPATH || 'mongodb://mongo:27017/ringsteki',
    mqUrl: process.env.RINGSTEKI_MQURL || 'tcp://127.0.0.1:6000' // This is the host/port of the Zero MQ server which does the node load balancing
};

module.exports = config;
