const Transmission = require('transmission');

module.exports = class GetTorrent {

    constructor() {
        //find a way to attach a self signed certificate
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        this.transmission = new Transmission({
            port: 443,
            host: '',
            username: '',
            password: '',
            ssl: true
        });
    }

    // Get details of all torrents currently queued in transmission app function
    getTransmissionStats(callback) {
        this.transmission.sessionStats(callback);
    }

}