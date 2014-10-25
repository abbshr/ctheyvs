
var request = require('./request');
var ExecQ = require('execq');

var Target = require('./target');
var parse = require('./parser');

var proxy = require('./config');

function Tracker(position) {
  this.location = position;
  // 保存各网站的店家页面url
  this.urls = [];
}

/*Tracker.prototype.getPosition = function (force, callback) {
  if (force || !this._geo)
    this.reqPosUpdate(callback);
  else
    return callback(this._geo);
};*/
Tracker.prototype.getUrl = function (url, lng, lat, addr) {
  return url + (url.match(/baidu/) ? addr + '&' : '') + 'lng=' + lng + '&lat=' + lat;
};

Tracker.prototype.trackRestaurant = function (callback) {
  var self = this;
  var targets = [];
  var execQ = new ExecQ();

  function cb(url, parser, res, body) {
    var addr = self.location;
    var lng, lat;
    if (url.match(/(ele)|(meituan)/)) {
      // 获取第一个命中位置
      var pos = JSON.parse(body.match(/AMap\.MAjaxResult\[.+\]\s*=\s*(.+)/)[1]).list[0];
      lng = pos.x;
      lat = pos.y;
    } else if (url.match(/baidu/)) {
      var pos =  JSON.parse(body).result.content[0];
      lng = pos.longitude; 
      lat = pos.latitude;
    }
    request(self.getUrl(url, lng, lat, addr), function (res, body) {
      var target = new Target(body);
      target.registParser(parser);
      targets.push(target);
      // 如果pending队列为空, 执行回调函数
      // 否则进行下一项抓取
      execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
    });    
  }

  proxy.forEach(function (p) {
    var url = p.geo_baseurl + self.location;
    execQ.pend([null, request, [url, cb.bind(null, p.res_baseurl, p.parser)]]);
  });

  execQ.goon(execQ.length - 1);
};

/*Tracker.prototype.trackRestaurant = function (callback) {
  var self = this;
  var targets = [];
  var execQ = new ExecQ();
  self.reqPosUpdate(function () {
    self.urls.forEach(function (url) {
      execQ.pend([null, request, url, cb.bind(null, url)]);
    });
    execQ.goon(execQ.length - 1);
  });
  function cb(url, err, res, body) {
    var target = new Target(body);
    target.registParser(proxy.parser(url));
    targets.push(target);
    // 如果pending队列为空, 执行回调函数
    // 否则进行下一项抓取
    execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
  }
};*/

/*Tracker.prototype.trackFood = function (urls, callback) {
  var self = this;
  var execQ = new ExecQ();
  var targets = [];

  function cb(url, err, res, body) {
    var target = new Target(body);
    target.registParser(proxy.parser);
    targets.push(target);
    execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
  }

  urls.forEach(function (url) {
    execQ.pend([null, request, url, cb.bind(null, url)]);
  });
  execQ.goon(execQ.length - 1)
};*/

module.exports = Tracker;
