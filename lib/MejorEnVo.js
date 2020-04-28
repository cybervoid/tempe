module.exports = class MejorEnVo {
    axios;
    cheerio;

    constructor(axios) {
        this.axios = axios;
        this.mainUrl = 'http://www.mejorenvo.me/';
    }

    async init(cheerio) {
        const result = await this.axios.get(this.mainUrl);
        return this.processPages(cheerio.load(result.data));
    }

    processPages($) {
        $("a + br").each((index, el) => {
            const $link = $(el).prev("a");
            const tagText = $link.text();
            //filter out a tags with a class
            //&& !$link.attr('class').length
            if (!$(el).siblings('i').length && !$link.attr('class') && tagText !== "Descargar torrent" && tagText !== "Datos legales") {
                console.log($link.text() + " " + $link.attr('href') + " " + $link.attr('class') + " \n");
            }
        });

        return '';
    }
}