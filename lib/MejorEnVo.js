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
        let res = [];
        $("a + br").each((index, el) => {
            const $link = $(el).prev("a");
            const tagText = $link.text();

            //filter out a tags with a class
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