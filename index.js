process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

require('dotenv').config();
const Transmission = require("./lib/system/TransmissionServer");
const Plex = require("./lib/system/Plex");
const DB = require("./lib/system/DB");
const async = require('async');

//PARSERS
const MejorEnVo = require("./lib/parsers/MejorEnVo");
const axios = require("axios");
const cheerio = require('cheerio');

//todo use bunyan as logger system
(async () => {

    // plex.search("Anunnaki");
    // client.query("/library/metadata/304222").then(function (directories) {
    //     console.log(directories);
    //     // directories would be an array of sections whose type are "movie"
    // }, function (err) {
    //     console.error("Could not connect to server", err);
    // });

    const logger = function (message, logParser = '') {
        let today = new Date().toISOString().replace(/T/, ' ').      // replace T with a space
            replace(/\..+/, '');

        const parser = logParser ? `parser.${logParser}` : 'app.system';
        console.log(`[${today}] ${parser}: ${message}`);
    }

    logger("Initiate DB and check connection ...");
    const db = new DB(logger);
    // await db.runSync();

    const plex = new Plex(logger);
    const transmission = new Transmission(logger);

    //make sure essential services are reachable
    if (await plex.healthCheck() && await transmission.healthCheck() && await db.auth()) {
        logger("Initializing parsers ...");
        runMejorEnVo()
            .then(() => {
                logger("MejorEnVo parser finished")
            })
            .catch(err => {
                logger(`Error with parser: MejorEnVo, more info: ${err}`)
            });
        // runKat();
    }

    //DEFINE PARSERS
    async function runMejorEnVo() {
        const mejorEnVo = new MejorEnVo(axios, cheerio, logger);
        mejorEnVo.log("Running Parser on MejorEnVo");

        //start on the main page
        const pepe = await mejorEnVo.gotoPage(mejorEnVo.mainUrl)
            .then(res => {
                return mejorEnVo.getPageInfo(res);
            })
            .then(mainPage => {
                const torrentList = mainPage.torrents;
                const promiseList = [];
                torrentList.forEach(currTorrent => promiseList.push(mejorEnVo.gotoPage(mejorEnVo.mainUrl + currTorrent.href)));
                return Promise.all(promiseList)
                    .then(torrentList => {
                        const movieList = [];
                        torrentList.forEach(currEl => {
                            movieList.push(mejorEnVo.getMovieInfo(currEl));
                        })
                        return movieList;
                    });
            })
            // .then( mainPage => mejorEnVo.getMovieInfo(mainPage.torrents) )
            .catch((err) => {
                mejorEnVo.log(`Error getting page for MejorEnVo: ${err}`);
            });

        // got movie details for current torrent, save it
        const queue = async.queue(db.saveMovie, 20);
        queue.push(pepe, err => {
            if (err) logger(`Error in queue to write in DB. More info: ${err}`);
        })

        function done() {
            queue.drain = null;
            logger('queue processed successfully');
        };

        queue.drain = done;

        console.log(pepe);
    }

    async function runKat() {
        console.log("Running Parser on Kick Ass Torrent");
        setTimeout(function () {
            console.log("Kick Ass Torrent finished");
        }, 3000);
    }


    // const search = await plex.search("superman");


    // const fetchData = async (url) => {
    //     const result = await axios.get(url);
    //     return cheerio.load(result.data);
    // };

    // const $ = await fetchData("https://kat.am/movies/?rss=1");
    //
    // $('.cellMainLink').each( function (i, el) {
    //     fetchData("https://kat.am/" + $(el).attr('href'))
    //         .then( (res) => {
    //             // res('.novertmarg').text()
    //             console.log( "\n" + res(".kaGiantButton ").attr('href'));
    //             // console.log(response);
    //         })
    //     // $(el).attr('href')
    //
    //     // console.log($(this).text())
    // });

})();