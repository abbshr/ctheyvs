var request = require('./routes/request');
var cheerio = require('cheerio');

request('http://waimai.meituan.com/geo/geohash?lat=45.747428&lng=126.633289&addr=哈尔滨工业大学', function (res, body) {
  var $ = cheerio.load(body);
  console.log(parser_meituan($));
  //parser_meituan($)
}); 

function parser_meituan($) {
  var resta_info = [];

  $('.rest-list > .list.clearfix > ul > li.fl')
  .each(function (i, e) {
    //console.log($('div > a > .top-content > .preview.fl > img', e)[0].attribs['data-src'])
    //console.log($('div > a > .others > span', e)[0].children[0].data)
    var liElem = e.children[1];
    var aElem = liElem.children[1];
    var resta_name = liElem.attribs['data-title'];
    var resta_ann = liElem.attribs['data-bulletin'];
    var resta_href = aElem.attribs.href;
    var resta_desc = $('.content > .price > .start-price', aElem).text();
    var resta_sendprice = $('.content > .price > .send-price', aElem).text();
    var resta_total = $('.content > .rank.clearfix > .total', aElem) ? .text() :;
    var attrElem = $('.others script', aElem);
    var resta_attr = [];
    for (var j = 0; j < attrElem.length; j++)
      attrElem[j] && resta_attr.push(attrElem[j].children[0].data);
    
    resta_info.push({
      href: 'http://waimai.meituan.com' + resta_href,
      name: resta_name,
      ann: resta_ann,
      desc: resta_desc,
      total: resta_total,
      attr: resta_attr,
      sendprice: resta_sendprice,
      proxy: '美团外卖'
    });
  });

  return resta_info;
}