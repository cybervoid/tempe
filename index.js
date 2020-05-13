process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

require('dotenv').config();
const Transmission = require("./lib/system/TransmissionServer");
const Plex = require("./lib/system/Plex");
const DB = require("./lib/system/DB");

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

    try {
        await db.auth();
        logger('Connection has been established to the DB successfully');
    } catch (error) {
        logger('Unable to connect to the database:', error);
    }

    const plex = new Plex(logger);
    const transmission = new Transmission(logger);

    //make sure essential services are reachable
    if (await plex.healthCheck() && await transmission.healthCheck()) {

        // const Movie = db.movie;
        // Post.findAll({
        //     where: {
        //         authorId: 2
        //     }
        // });
        // const Movie = db.movie.build({ Name: "John", Year: 2015, Quality: "BlueRay" });
        // await Movie.save();

        // await jane.save();
        // console.log(Movie.name + ' was saved to the database!');

        //Initiate parsers
        runMejorEnVo();
        // runKat();
    }

    //DEFINE PARSERS
    async function runMejorEnVo() {
        const mejorEnVo = new MejorEnVo(axios, cheerio, logger);
        mejorEnVo.log("Running Parser on MejorEnVo");

        //start on the main page
        mejorEnVo.gotoPage(mejorEnVo.mainUrl)
            .then($ => {
                const page = mejorEnVo.processPage($);

                page.torrents.forEach((torrent) => {
                    //go to the torrent page and get movie info
                    const urlTorrent = mejorEnVo.mainUrl + torrent.href;
                    mejorEnVo.log(`Torrent found: ${torrent.text} Visiting: ${urlTorrent}`);
                    mejorEnVo.gotoPage(urlTorrent)
                        .then($ => {
                            //get movie details

                            const date = $('table span').first().parent().contents().filter(function () {
                                return this.nodeType == 3;
                            }).text().replace(/[\r\n]+/gm, "").trim();
                            const titleWithYear = $('table span').eq(2).text();
                            const title = $('table span').eq(3).text();
                            const format = $('table span').eq(11).text();
                            const torrent = $('table[style="margin-bottom:10px;"] a').first().attr('href');

                            const movie = db.Movie.create({
                                name: title,
                                year: date,
                                quality: format
                            }).catch((err) => {
                                mejorEnVo.log('Error inserting in DB, more info: ', err);
                            });

                            mejorEnVo.log(`Torrent info: ${title} format: ${format} Download link: ${torrent}`);
                        })
                        .catch(err => {
                            mejorEnVo.log(`Error: ${err}`);
                        });
                });

                //visit all found pages
                page.pages.forEach((page) => {
                    mejorEnVo.log(`Found page: ${page.name} visiting url: ${page.url}`);
                    mejorEnVo.gotoPage(mejorEnVo.mainUrl + page.url)
                        .then($ => {
                            const subPage = mejorEnVo.processPage($);

                            subPage.torrents.forEach((torrent) => {
                                console.log(torrent.text);
                            });
                        })
                        .catch(err => {
                            mejorEnVo.log(err);
                        });
                });

            })
            .catch((err) => {
                mejorEnVo.log(`Error getting page for MejorEnVo: ${err}`);
            });
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