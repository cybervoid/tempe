module.exports = class MejorEnVo {

    mainUrl = 'http://www.mejorenvo.me';

    constructor(axios, cheerio, logger) {
        this.logger = logger;
        this.cheerio = cheerio;
        this.axios = axios;
    }

    async gotoPage(pageURI) {
        return this.axios.get(pageURI)
            .then((result) => {
                return this.cheerio.load(result.data);
            })
            .catch((err) => {
                this.log(`Error fetching page: ${err}`);
                return false;
            });
    }

    /**
     * Gets the pages URI and torrents for a given page
     * @param $
     * @returns {{pages: [], torrents: []}}
     */
    getPageInfo($) {
        //todo test this function with another page to check if the return is handled
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

        //they always show 10 movies per page
        let itemsPerPage = 0;
        $("a + br").each((index, el) => {

            const $link = $(el).prev("a");
            const tagText = $link.text();

            //get page torrents
            if (!$(el).siblings('i').length && !$link.attr('class') && tagText !== "Descargar torrent" && tagText !== "Datos legales") {
                if (itemsPerPage == 10) {
                    return false;
                }
                itemsPerPage++;
                res.push({
                    text: tagText,
                    href: $link.attr('href')
                });
            }
        });

        return res;
    }

    /**
     *
     * @param $
     * @returns {{releaseDate: string, format: jQuery, torrent: jQuery, title: jQuery}}
     */
    getMovieInfo($) {
        //get movie details
        const titleWithYear = $('table span').eq(2).text();
        const titleRegEx = titleWithYear.match(/\((.\d*)\)/);
        let releaseDate = '';
        if (titleRegEx) {
            releaseDate = titleRegEx[1];
        }
        const title = $('table span').eq(3).text();
        const torrent = $('table[style="margin-bottom:10px;"] a').first().attr('href');
        let format = $('table span').eq(11).text();

        const reg = new RegExp("Formato");
        if (reg.test(format)) {
            format = $('table span').eq(12).text();
        }
        return {title: title, format: format, releaseDate: releaseDate, torrent: torrent};
    }

    async getTorrentListInfo() {

    };

    log(message) {
        this.logger(message, 'mejorEnVo');
    }
}