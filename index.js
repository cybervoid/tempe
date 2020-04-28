const axios = require("axios");
const cheerio = require('cheerio');

const MejorEnVo = require("./lib/MejorEnVo");
const Transmission = require("./lib/GetTorrent");

(async () => {
    const mejorEnVo = new MejorEnVo(axios);
    console.log(await mejorEnVo.init(cheerio));

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