var request = require('request');
var cheerio = require('cheerio');
var tmp = require;
var data;
var require = function () {return require};
require.init = function(){arguments[0] &&( data=arguments[0])};
require.initSwitchaddr=function(){};
require.async=function(){};

request({ 
  url: 'http://v5.ele.me/poi/from?lng=126.633289&lat=45.747428',
  headers : {
    'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
  }
}, function (err, res, body) {
  var $ = cheerio.load(body);
  console.log(parser_eleme($));
}); 

function parser_eleme($) {
  var resta_info = [];

  $('body > div.full-content-wrapper > div.container > div.row.promoted-restaurants.restaurants-row > div > div > div:nth-child(2) > table .info')
  .each(function(i,e) {
    // 链接
    var resta_href = $('.restaurant-link', e)[0].attribs.href;
    // 订单
    var resta_total = $('.ratings > .rating-number', e).text();
    resta_info.push({
      href: resta_href,
      total: resta_total
    });
  });

  $('body > div.full-content-wrapper > div.container > div.row.promoted-restaurants.restaurants-row > div > div > div:nth-child(2) > table .restaurant-more-info')
  .each(function (i, e) {
    // 餐馆名
    var resta_name = $('div:nth-child(1)', e)[0].children[0].data;
    
    var othersElem = $('p > strong', e);
    // 公告
    var resta_ann = othersElem[0].next.data;
    // 起送价
    var resta_desc = othersElem[1].next.data;
    // 地址
    var resta_addr = othersElem[2].next.data;
    // 营业时间
    var resta_peri = othersElem[3].next.data;
    // 简介
    var resta_intro = othersElem[4].next.data;
    // 优惠种类
    var iconElem = $('.restaurant-icons', e);
    var resta_attr = [];
    for (var j = 0; j < iconElem.length; j++)
      resta_attr.push(iconElem[j].attribs.title); 
    resta_info[i].name = resta_name;
    resta_info[i].ann = resta_ann;
    resta_info[i].desc = resta_desc;
    resta_info[i].addr = resta_addr;
    resta_info[i].peri = resta_peri;
    resta_info[i].intro = resta_intro;
    resta_info[i].attr = resta_attr;
    resta_info[i].proxy = 'eleme';
  });

  return resta_info;
}
