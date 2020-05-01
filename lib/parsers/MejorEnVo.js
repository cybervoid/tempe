module.exports = class MejorEnVo {

    constructor(axios, cheerio) {
        this.cheerio = cheerio;
        this.axios = axios;
        this.mainUrl = 'http://www.mejorenvo.me/';
    }

    async init() {
        const result = await this.axios.get(this.mainUrl);
        return this.processMainPage(this.cheerio.load(result.data));
    }

    processMainPage($) {
        return {
            torrents: this.getPageTorrents($),
            pages: this.getNextPages($),
        };
    }

    getNextPages($) {
        let res = [];
        $(".paginar").each((index, link) => {
            res.push({
                name: $(link).text(),
                url: $(link).attr('href')
            });
        });

        return res;
    }

    getPageTorrents($) {
        let res = [];
        $("a + br").each((index, el) => {
            const $link = $(el).prev("a");
            const tagText = $link.text();

            //get page torrents
            if (!$(el).siblings('i').length && !$link.attr('class') && tagText !== "Descargar torrent" && tagText !== "Datos legales") {
                res.push({
                    text: tagText,
                    href: $link.attr('href')
                });
            }
        });

        return res;
    }

    goto() {

    }
}