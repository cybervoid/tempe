process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

require('dotenv').config();
const Transmission = require("./lib/system/TransmissionServer");
const Plex = require("./lib/system/Plex");

//PARSERS
const MejorEnVo = require("./lib/parsers/MejorEnVo");
const axios = require("axios");
const cheerio = require('cheerio');


(async () => {

    // plex.search("Anunnaki");
    // client.query("/library/metadata/304222").then(function (directories) {
    //     console.log(directories);
    //     // directories would be an array of sections whose type are "movie"
    // }, function (err) {
    //     console.error("Could not connect to server", err);
    // });

    const plex = new Plex();
    const transmission = new Transmission();

    //make sure essential services are reachable
    if (await plex.healthCheck() && await transmission.healthCheck()) {

        //Initiate parsers
        runMejorEnVo();
        // runKat();
    }

    //DEFINE PARSERS
    async function runMejorEnVo() {
        console.log("Running Parser on MejorEnVo");
        const mejorEnVo = new MejorEnVo(axios, cheerio);
        mejorEnVo.init().then((response) => {
            console.log(response);
        });
        console.log(await mejorEnVo.init());
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