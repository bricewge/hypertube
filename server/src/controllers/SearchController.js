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

function search_next_content($content, search, text)
{
    return $content(search).filter(function() {
        //console.log($content(this).text().trim());
        return $content(this).text().trim().startsWith(text);
    }).next().text().trim();
}

function search_imdb_id_content(text)
{
    var res = /\/title\/(tt\d+)\//.exec(text);
	return res ? res[1] : undefined
}

function get_hash($content)
{
    $content('#details > dl > dt').remove()
    $content('#details > dl > dd').remove()
    return $content("#details > dl").text().trim();
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

function search_imbd_movie_by_imdb_id(imdb_id, callback)
{
	request("http://www.imdb.com/title/" + imdb_id, function(err, resp, html) {
		if (!err){
			const $x = cheerio.load(html);
			var img = $x("div.poster > a > img").attr('src'),
			d = get_credit($x, "Director:") || get_credit($x, "Directors:"),
			c = get_credit($x, "Star:") || get_credit($x, "Stars:");
			p = get_credit($x, "Writer:") || get_credit($x, "Writers:");
			dates = search_content($x, '#titleDetails > div', 'Release Date:').split("\n")[0].split(":")[1];
			var yofprod = undefined
			var cover_img = undefined
			if (dates)
			{
				dates = dates.trim()
				yofprod = /\d{4}/.exec(dates)[0]
			}
			if (img)
			{
				cover_img = img.split("@").slice(0, -1).join("@")  + "@._V1_UX1000.jpg";
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
			callback({
				imdb_id: imdb_id,
				title: $x("#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1").text().trim(),
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

		}
		callback(undefined);
	});
}

function search_pirate_bay_magnet_by_endpoint(endpoint, callback)
{
	request("https://thepiratebay.org" + endpoint, function(error, rep, rrr) {
		if (error)
		{
			console.log(error)
			callback(undefined);
		}
		const $x = cheerio.load(rrr);
		var link = $x("div.download > a").attr('href');
		var lang = search_next_content($x, "#details > dl > dt", "Spoken language(s):");
		var imdb_id = search_imdb_id_content(rrr);
		var texted = search_next_content($x, "#details > dl > dt", "Texted language(s)");
		var hash = get_hash(cheerio.load(rrr));
		callback({
			magnet: link,
			lang: lang,
			imdb_id: imdb_id,
			text_lang: texted,
			hash: hash,
		});
	});
}

module.exports = {

search_best_movie_pirate_bay(callback){
    res = 0;
    lst = []
    request('https://thepiratebay.org/top/201', function(err, resp, html) {
        if (err)
            console.log(err)
        if (!err){
            const $ = cheerio.load(html);
            $('div.detName > a').each((i, html) => {
                lst.push(new Promise(function(resolve, reject) {
                    setTimeout(() => {
                        search_pirate_bay_magnet_by_endpoint($(html).attr('href'), (e) => resolve(e));
                    }, Math.random() * 18000);
                }));
            });
        }
        Promise.all(lst).then(function(values) {
            callback(values);
        });
    });
},
search_movie_pirate_bay_by_imdb_id(imdb_id, callback){
    res = 0;
    lst = []
    request('https://thepiratebay.org/search/' + encodeURI(imdb_id) + '/0/99', function(err, resp, html) {
        if (err)
            console.log(err)
        if (!err){
            const $ = cheerio.load(html);
            $('div.detName > a').each((i, html) => {
                lst.push(new Promise(function(resolve, reject) {
                    setTimeout(() => {
                        search_pirate_bay_magnet_by_endpoint($(html).attr('href'), (e) => resolve(e));
                    }, Math.random() * 18000);
                }));
            });
        }
        Promise.all(lst).then(function(values) {
            callback(values);
        });
    });
},

search_movie_yts_by_imdb_id(imdb_id , callback)
{
	request('https://yts.am/api/v2/list_movies.json?query_term=' + imdb_id, function(err, resp, html) {
		if (err)
			callback(err);
		var tmp = JSON.parse(html);
		var movie = tmp["data"]["movies"] ? tmp["data"]["movies"][0] : undefined;
		if (movie != undefined)
		{
			callback({
				magnet: undefined,
				lang: movie["language"],
				imdb_id: movie["imdb_code"],
				text_lang: "",
				hash: movie["torrents"][0] ? movie["torrents"][0]['hash'] : undefined,
			});
		}
		else
			callback(undefined);

	});
},

    search_best_movie_imdb(callback){
        lst = []
        request('http://www.imdb.com/chart/top?sort=rk,asc&mode=simple&page=1', function(err, resp, html) {
            if (!err) {
                const $ = cheerio.load(html);
                $('#main > div > span > div > div > div.lister > table > tbody > tr > td.titleColumn > a').each(function(i, html) {
                    if (i > 50)
                        return ;
                    let imdbId = /^\/title\/(tt\d+)\//.exec($(html).attr('href'))[1];
                    lst.push(new Promise(function(resolve, reject) {
                        search_imbd_movie_by_imdb_id(imdbId, (e) => resolve(e));
                    }));
                });
                Promise.all(lst).then(function(values) {
                    callback(values);
                });
            }
        });
    },

    search_imdb_movie(film, callback){
        request('http://www.imdb.com/find?q='+ encodeURI(film) + '&s=tt&ttype=ft&ref_=fn_ft', function(err, resp, html) {
            if (!err) {
                lst = []
                const $ = cheerio.load(html);
                $('#main > div > div.findSection > table > tbody > tr > td.result_text > a').each(function(i, html) {
                    let imdbId = /^\/title\/(tt\d+)\//.exec($(html).attr('href'))[1]
                    lst.push(new Promise(function(resolve, reject) {
                        search_imbd_movie_by_imdb_id(imdbId, (e) => resolve(e));
                    }));
                });
                Promise.all(lst).then(function(values) {
/*                    values.forEach(e => {
                        if (e != undefined)
                            Movie.create(e);
                    });*/
                    callback(values);
                });
            }
        });
    }
}
