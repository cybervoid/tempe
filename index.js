const axios = require("axios");
const cheerio = require('cheerio');
require('dotenv').config();

const MejorEnVo = require("./lib/MejorEnVo");
const Transmission = require("./lib/GetTorrent");

(async () => {

    const transmission = new Transmission();

    function init() {
        console.log("Initiating transmission server healthcheck")
        transmission.getTransmissionStats(function (err, result) {
            if (!err) {
                console.log(result);
            } else {
                console.log("Could not contact transmission server", err);
            }
        });
    }

    // init();


    const mejorEnVo = new MejorEnVo(axios, cheerio);
    mejorEnVo.init().then((response) => {
        console.log(response);
    });
    console.log(await mejorEnVo.init());

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