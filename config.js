module.exports = {
  geo_baseurl:'http://restapi.amap.com/gss/simple?encode=utf-8&number=1&batch=1&range=1000&resType=json&retvalue=1&sid=1000&rid=497051&keyword=' 
  res_baseurl: [
    "http://v5.ele.me/poi/from?addr=",
    "http://waimai.meituan.com/geo/geohash?addr=",
    "http://waimai.baidu.com/waimai?qt=shoplist&address="
  ],
  urls: function (lng, lat, addr) {
    return this.res_baseurl.map(function (url) {
      return url + addr + '&lng=' + lng + '&lat=' + lat;
    });
  },
  parser(url_pattern) {
    if (url_pattern.match(/v5\.ele\.me/))
      return parser_eleme;
    if (url_pattern.match(/waimai\.meituan\.com/))
      return parser_meituan;
  }
};

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
    for (var j = 0; j < iconElem.lenght; j++)
      resta_attr.push(iconElem[j].attribs.title); 

    resta_info[i].name = resta_name;
    resta_info[i].ann = resta_ann;
    resta_info[i].desc = resta_desc;
    resta_info[i].addr = resta_addr;
    resta_info[i].peri = resta_peri;
    resta_info[i].intro = resta_intro;
    resta_info[i].attr = resta_attr;
    //resta_info[i].food = [];
    resta_info[i].proxy = 'eleme';
  });

  return resta_info;
}

function parser_meituan($) {
  var resta_info = [];

  $('.rest-list.online-rests > .list.clearfix > ul > li.fl')
  .each(function (i, e) {
    var liElem = e.children[1];
    var aElem = liElem.children[1];
    var resta_name = liElem.attribs['data-title'];
    var resta_ann = liElem.attribs['data-bulletin'];
    var resta_href = aElem.attribs.href;
    var resta_desc = $('.content > .price > .start-price', aElem).text();
    var resta_sendprice = $('.content > .price > .send-price', aElem).text();
    var resta_total = $('.content > .rank.clearfix > .total', aElem).text();
    var attrElem = $('.others script', aElem);
    var resta_attr = [];
    for (var j = 0; j < 4; j++)
      attrElem[j] && resta_attr.push(attrElem[j].children[0].data);
    
    resta_info.push({
      href: resta_href,
      name: resta_name,
      ann: resta_ann,
      desc: resta_desc,
      total: resta_total,
      attr: resta_attr,
      sendprice: resta_sendprice,
      proxy: 'meituan',
      //food: []
    });
  });

  return resta_info;
}

function parser_baidu($) {
  var resta_info = [];
  
  $('#shop-list >> .list.clearfix > .shopcards-list > .list-item.shopcard')
  .each(function (i, e) {
    resta_info.push({
      href: 'http://waimai.baidu.com/waimai/shop/' + e.attribs.data,
      name: $('.shopimg > img', e).attr().alt,
      ann: $('.overlay >> .shop-notice > p', e)[0].children[0].data,
      rate: $('.info.s-info.clearfix > .star-control', e).attr()['data-star'],
      total: $('.info.s-info.clearfix > .f-sale > span', e)[0].children[0].data,
      sendprice: $('.info.f-info.clearfix > .f-price > .item-value', e)[0].children[0].data,
      time: $('.info.f-info.clearfix > .f-time', e)[0].children[0].data,
      attr: $('.feature > em', e).attr()['data-msg']
    });
  });

  return resta_info;
}
