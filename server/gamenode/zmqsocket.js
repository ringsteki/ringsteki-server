const EventEmitter = require('events');
const zmq = require('zeromq');
const config = require('./nodeconfig.js');
const logger = require('../log.js');
const { spawnSync } = require('child_process');

class ZmqSocket extends EventEmitter {
    constructor(listenAddress, protocol, version) {
        super();

        this.listenAddress = listenAddress;
        this.protocol = protocol;
        this.version = version;

        this.socket = zmq.socket('dealer');
        this.socket.identity = process.env.SERVER || config.nodeIdentity;
        this.socket.monitor(500, 0);

        this.socket.connect(config.mqUrl, err => {
            if(err) {
                logger.info(err);
            }
        });

        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    }

    send(command, arg) {
        this.socket.send(JSON.stringify({ command: command, arg: arg }));
    }

    onConnect() {
        console.log('onConnect called')
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    onGameSync(games) {
        console.log('sending HELLO')
        this.send('HELLO', {
            maxGames: config.maxGames,
            version: this.version,
            address: this.listenAddress,
            port: process.env.NODE_ENV === 'production' ? 80 : (process.env.PORT || config.socketioPort),
            protocol: this.protocol,
            games: games });
    }

    onMessage(x, msg) {
        var message = undefined;

        try {
            message = JSON.parse(msg.toString());
        } catch(err) {
            logger.info(err);
            return;
        }

        switch(message.command) {
            case 'PING':
                this.send('PONG');
                break;
            case 'STARTGAME':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR':
                this.emit('onSpectator', message.arg.game, message.arg.user);
                break;
            case 'CONNECTFAILED':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
            case 'CLOSEGAME':
                this.emit('onCloseGame', message.arg.gameId);
                break;
            case 'CARDDATA':
                this.emit('onCardData', message.arg);
                break;
            case 'RESTART':
                logger.error('Got told to restart, executing pm2 restart..');
                spawnSync('pm2', ['restart', this.socket.identity]);
                break;
        }
    }
}

module.exports = ZmqSocket;
