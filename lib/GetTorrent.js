module.exports = class GetTorrent{

    constructor() {
        var Transmission = require('transmission');
        this.transmission = new Transmission({
            port: 443,
            host: '',
            username: '',
            password: '',
            ssl: true
        });
    }

    // Get details of all torrents currently queued in transmission app function

    getTransmissionStats() {
        this.transmission.sessionStats(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    }

}