const Transmission = require('transmission');

module.exports = class GetTorrent {

    constructor() {
        //find a way to attach a self signed certificate
        this.transmission = new Transmission({
            port: 443,
            host: process.env.TRANSMISSION_HOST,
            username: process.env.TRANSMISSION_USER,
            password: process.env.TRANSMISSION_PASSWORD,
            ssl: true
        });
    }

    healthCheck() {
        console.log("Initiating transmission server healthcheck ...");
        return new Promise((resolve, reject) => {
            this.transmission.sessionStats((err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }

    // Get details of all torrents currently queued in transmission app function
    getTransmissionStats(callback) {
        this.transmission.sessionStats(callback);
    }

}