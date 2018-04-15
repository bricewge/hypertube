let request = require('request');
let cheerio = require('cheerio');
//let jsonframe = require('jsonframe-cheerio')

const {Movie} = require('../models')

function search_content($content, search, text)
{
    return $content(search).filter(function() {
        return $content(this).text().trim().startsWith(text);
    }).text().trim();
}

function get_credit($content, search)
{
    var text = $content('div.credit_summary_item').filter(function() {
        return $content(this).text().trim().startsWith(search);
    }).text().trim();
    if (text) {
        text = text.split(":", 2)[1].split(",").map((e) => {
            if (e.includes("»"))
            return undefined;
            return e.trim();
        }).filter((e) => (e != undefined) ).join(", ")
    }
    return text;
}

module.exports = {
    search_best_movie(callback){
        lst = []
        request('http://www.imdb.com/chart/top?sort=rk,asc&mode=simple&page=1', function(err, resp, html) {
            if (!err) {
                const $ = cheerio.load(html);
                $('#main > div > span > div > div > div.lister > table > tbody > tr > td.titleColumn > a').each(function(i, html) {
                    if (i > 50)
                        return ;
                    let imdbId = /^\/title\/(tt\d+)\//.exec($(html).attr('href'))[1];
                    let link = $(html).attr('href')
                    let name = $(html).text()
                    lst.push(new Promise(function(resolve, reject) {
                        request("http://www.imdb.com" + link, function(err, resp, rrr) {
                            if (!err){
                                const $x = cheerio.load(rrr);
                                var img = $x("div.poster > a > img").attr('src'),
                                d = get_credit($x, "Director:") || get_credit($x, "Directors:"),
                                c = get_credit($x, "Star:") || get_credit($x, "Stars:");//:
                                p = get_credit($x, "Writer:") || get_credit($x, "Writers:");
                                dates = search_content($x, '#titleDetails > div', 'Release Date:').split("\n")[0].split(":")[1];
                                yofprod = undefined
                                cover_img = undefined
                                if (dates)
                                {
                                    dates = dates.trim()
                                    yofprod = /\d{4}/.exec(dates)[0]
                                }
                                if (img)
                                {
                                    cover_img = img.split("@", 2)[0] + "@._V1_UX1000.jpg";
                                }
                                /*    title: DataTypes.STRING,
                                content: DataTypes.STRING,
                                image_url: DataTypes.STRING,
                                summary: DataTypes.TEXT,
                                year_of_production: DataTypes.STRING,
                                director: DataTypes.STRING,
                                casting: DataTypes.STRING,
                                duration_in_min: DataTypes.STRING,
                                rating: DataTypes.STRING*/
                                resolve({
                                    imdb_id: imdbId,
                                    title: name,
                                    //image_url: img,
                                    //cover_url: cover_img,
                                    image_url:cover_img,
                                    director: d,
                                    //producer : p,
                                    casting: c,
                                    rating: $x('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span').text(),
                                    time: $x('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div > time').text().trim(),
                                    summary: $x('#titleStoryLine > div:nth-child(3) > p').text().trim(),
                                    //tags: $x('#titleStoryLine > div:nth-child(8) > a').text().trim().split(" "),
                                    //date: dates,
                                    //year_of_production: yofprod,
                                });
                                return
                            }
                            reject();
                            return
                        });
                    }));
                });
                Promise.all(lst).then(function(values) {
                    callback(values);
                });
            }
        });
    },

    search_movie(callback, film){
        request('http://www.imdb.com/find?q='+ encodeURI(film ? film : "grrrrr") + '&s=tt&ttype=ft&ref_=fn_ft', function(err, resp, html) {
            if (!err) {
                lst = []
                const $ = cheerio.load(html);
                $('#main > div > div.findSection > table > tbody > tr > td.result_text > a').each(function(i, html) {
                    let imdbId = /^\/title\/(tt\d+)\//.exec($(html).attr('href'))[1]
                    let link = $(html).attr('href')
                    let name = $(html).text()
                    lst.push(new Promise(function(resolve, reject) {
                        request("http://www.imdb.com" + link, function(err, resp, rrr) {
                            if (!err){
                                const $x = cheerio.load(rrr);
                                var img = $x("div.poster > a > img").attr('src'),
                                d = get_credit($x, "Director:") || get_credit($x, "Directors:"),
                                c = get_credit($x, "Star:") || get_credit($x, "Stars:");//:
                                p = get_credit($x, "Writer:") || get_credit($x, "Writers:");
                                dates = search_content($x, '#titleDetails > div', 'Release Date:').split("\n")[0].split(":")[1];
                                yofprod = undefined
                                cover_img = undefined
                                if (dates)
                                {
                                    dates = dates.trim()
                                    yofprod = /\d{4}/.exec(dates)[0]
                                }
                                if (img)
                                {
                                    cover_img = img.split("@", 2)[0] + "@._V1_UX1000.jpg";
                                }
                                /*    title: DataTypes.STRING,
                                content: DataTypes.STRING,
                                image_url: DataTypes.STRING,
                                summary: DataTypes.TEXT,
                                year_of_production: DataTypes.STRING,
                                director: DataTypes.STRING,
                                casting: DataTypes.STRING,
                                duration_in_min: DataTypes.STRING,
                                rating: DataTypes.STRING*/
                                resolve({
                                    imdb_id: imdbId,
                                    title: name,
                                    //image_url: img,
                                    //cover_url: cover_img,
                                    image_url:cover_img,
                                    director: d,
                                    //producer : p,
                                    casting: c,
                                    rating: $x('#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span').text(),
                                    time: $x('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div > time').text().trim(),
                                    summary: $x('#titleStoryLine > div:nth-child(3) > p').text().trim(),
                                    //tags: $x('#titleStoryLine > div:nth-child(8) > a').text().trim().split(" "),
                                    //date: dates,
                                    //year_of_production: yofprod,
                                });
                                return
                            }
                            reject();
                            return
                        });
                    }));
                });
                Promise.all(lst).then(function(values) {
                    values.forEach(e => {
                        Movie.create(e);
                    });
                    callback(values);
                });
            }
        });
    }
}
