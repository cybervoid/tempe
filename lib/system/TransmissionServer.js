const Transmission = require('transmission');

module.exports = class TransmissionServer {

    constructor(logger) {
        //find a way to attach a self signed certificate
        this.transmission = new Transmission({
            port: 443,
            host: process.env.TRANSMISSION_HOST,
            username: process.env.TRANSMISSION_USER,
            password: process.env.TRANSMISSION_PASSWORD,
            ssl: true
        });
        this.logger = logger;
    }

    healthCheck() {
        this.logger("Initiating transmission server healthcheck ...");
        return process.env.APP_ENV !== 'local' ? new Promise((resolve, reject) => {
            this.transmission.sessionStats((err, data) => {
                if (err) {
                    console.log("Transmission server healthcheck failed!", err);
                    return reject(false);
                }
                console.log(`Found server at ${process.env.TRANSMISSION_HOST}, useful stats:
    Actives Torrents: ${data.activeTorrentCount}
    Paused Torrents: ${data.pausedTorrentCount}
    Total Torrents: ${data.torrentCount}`);
                resolve(true);
            });
        }) : true;
    }
}