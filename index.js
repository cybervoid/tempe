process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
const axios = require("axios");
const cheerio = require('cheerio');
require('dotenv').config();

const MejorEnVo = require("./lib/MejorEnVo");
const Transmission = require("./lib/GetTorrent");
const Plex = require("./lib/Plex");

(async () => {

    // plex.search("Anunnaki");
    // client.query("/library/metadata/304222").then(function (directories) {
    //     console.log(directories);
    //     // directories would be an array of sections whose type are "movie"
    // }, function (err) {
    //     console.error("Could not connect to server", err);
    // });

    // client.query("/").then(function (result) {
    //     console.log(result);
    // }, function (err) {
    //     console.error("Could not connect to server", err);
    // });


    const plex = new Plex();
    const transmission = new Transmission();

    if (await plex.healthCheck()) {


        // transmission.getTransmissionStats(function (err, result) {
        //     if (!err) {
        //         console.log(result);
        //     } else {
        //         console.log("Could not contact transmission server", err);
        //     }
        // });


        console.log("Script continues");
    }


    // const search = await plex.search("superman");
    // console.log("Search result", plexHealthCheck);

    // const mejorEnVo = new MejorEnVo(axios, cheerio);
    // mejorEnVo.init().then((response) => {
    //     console.log(response);
    // });
    // console.log(await mejorEnVo.init());

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

    // const transmission = new Transmission();
    // console.log("test");
    // transmission.getTransmissionStats();


})();