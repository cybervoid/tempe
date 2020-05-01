const PlexAPI = require("plex-api");
module.exports = class Plex {
    constructor() {
        this.client = new PlexAPI({
            hostname: process.env.PLEX_HOST,
            token: process.env.PLEX_TOKEN
        });
    }

    healthCheck() {
        console.log("Initiating plex server healthcheck ...")
        return this.client.query("/").then((serverInfo) => {
            console.log(`Found ${serverInfo.MediaContainer.friendlyName} running Plex Media Server v${serverInfo.MediaContainer.version}`);
            return true;
        })
            .catch((err) => {
                console.log("Plex server healthcheck failed!", err);
                return false;
            })
    }

    search(term) {
        return this.client.query(`/search?query=${term}`).then((response) => {
            const res = response.MediaContainer.Metadata;
            console.log(`Searched for ${term}, result: `, res);
            return res;
        }, function (err) {
            console.log("Error performing search, more info: ", err);
            return false;
        });
    }
}