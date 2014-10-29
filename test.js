var request = require('./routes/request');
var cheerio = require('cheerio');

var data;
var tmp = function () { return tmp };
tmp.init = function () {arguments[0] && (data = arguments[0])};
tmp.initSwitchaddr = function () {};
tmp.async = function () {};

request('http://waimai.baidu.com/waimai?qt=shoplist&lat=5709075.00&lng=14097393.10 &address=哈尔滨工业大学(一校区)&city_id=48', function (res, body) {
  var $ = cheerio.load(body);
  parser_baidu($)
  //console.log(parser_baidu($));
  //require('fs').writeFileSync('./docs/result_baidu.json', JSON.stringify(parser_baidu($)))
}); 

function parser_baidu($) {
  console.log($('script')[11].children)
  //eval($('script')[11].children[0].data.replace(/require/g, 'tmp'));
  /*return data.map(function (e) {
    return {
      name: e.shop_name,
      href: 'http://waimai.baidu.com/waimai/shop/' + e.shop_id,
      proxy: '百度外卖',
      ann: e.shop_announcement,
      logo: 'http://webmap2.map.bdimg.com/maps/services/thumbnails?width=228&height=140&align=center,center&quality=100&src=' + e.logo_url,
      // 起送价
      desc: e.takeout_price,
      // 配送费
      cost: e.takeout_cost,
      // 平均送餐时间
      avatime: e.delivery_time,
      peri: (e.start_time || '') + '~' + e.end_time,
      //delivery_regions: e.delivery_regions,
      //distance: e.distance,
      //is_online: e.is_online,
      //bussiness_status: e.bussiness_status,
      // 已售
      saled: e.saled,
      //discount_info: e.discount_info,
      //invoice_info: e.invoice_info,
      //coupon_info: e.coupon_info,
      // 评分
      rate: e.average_score,
      attr: e.welfare_info.reduce(function (a, b) { 
        return b ? a + b.type_desc + '\n' : ''; 
      }, '')
      //comment_num: e.comment_num,
      //welfare_info: e.welfare_info,
      //brand: e.brand
    };
  });*/
}