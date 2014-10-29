module.exports = [
  {
    geo_baseurl: 'http://restapi.amap.com/gss/simple?encode=utf-8&number=1&batch=1&range=1000&resType=json&retvalue=1&sid=1000&rid=497051&keyword=',
    res_baseurl: "http://v5.ele.me/poi/from?",
    parser: parser_eleme
  },
  {
    geo_baseurl: 'http://waimai.baidu.com/waimai?qt=poisearch&ie=utf-8&sug=0&tn=B_NORMAL_MAP&oue=1&res=1&wd=',
    res_baseurl: "http://waimai.baidu.com/waimai?qt=shoplist&address=",
    parser: parser_baidu
  },
  {
    geo_baseurl: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=HxElSG6mnrSGjLtLqlxECNGV&address=',
    res_baseurl: "http://waimai.meituan.com/geo/geohash?addr=",
    parser: parser_meituan
  }
];

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
      saled: resta_total
    });
  });

  $('body > div.full-content-wrapper > div.container > div.row.promoted-restaurants.restaurants-row > div > div > div:nth-child(2) > table > tbody > tr > td > .restaurant-block > .line-one')
  .each(function (i ,e) {
    // logo
    resta_info[i].logo = $('.logo-wrapper > .logo > a > img', e)[0].attribs.src;
    resta_info[i].rate = $('.info > .ratings > div', e)[0] ? $('.info > .ratings > div', e)[0].attribs.title : '';
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
    var resta_intro = othersElem[4] && othersElem[4].next.data;
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
    resta_info[i].proxy = '饿了么';
  });

  return resta_info;
}

function parser_meituan($) {
  var resta_info = [];

  $('.rest-list > .list.clearfix > ul > li.fl')
  .each(function (i, e) {
    var liElem = e.children[1];
    var aElem = liElem.children[1];
    var resta_name = $('div',e)[0].attribs['data-title'];
    var resta_ann = $('div',e)[0].attribs['data-bulletin'];
    var resta_href = $('div > a',e)[0].attribs.href;
    var resta_logo = $('div > a > .top-content > .preview.fl > img', e)[0].attribs['data-src'];
    var resta_desc = $('.content > .price > .start-price', aElem).text();
    var resta_sendprice = $('.content > .price > .send-price', aElem).text();
    var totalElem = $('.content > .rank.clearfix > .total', aElem);
    var resta_total = totalElem ? totalElem.text() : '';
    var attrElem = $('.others script', aElem);
    var avatimeElem = $('div > a > .others > span', e)[0];
    var resta_avatime = avatimeElem ? avatimeElem.children[0].data : '';
    var resta_attr = [];
    for (var j = 0; j < attrElem.length; j++)
      attrElem[j] && resta_attr.push(attrElem[j].children[0].data);
    
    resta_info.push({
      href: 'http://waimai.meituan.com' + resta_href,
      name: resta_name,
      logo: resta_logo,
      avatime: resta_avatime,
      ann: resta_ann,
      desc: resta_desc,
      saled: resta_total,
      attr: resta_attr,
      cost: resta_sendprice,
      proxy: '美团外卖'
    });
  });

  return resta_info;
}

function parser_baidu($) {
  var data;
  var require = function () { return require };
  require.init = function () {arguments[0] && (data = arguments[0])};
  require.initSwitchaddr = function () {};
  require.async = function () {};
  //console.log($('script')[11])
  //eval($('script')[11].children[0].data.replace(/require/g, 'tmp'));
  eval($('script')[11].children[0].data);
  return data.map(function (e) {
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
  });
}
