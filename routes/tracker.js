
var request = require('request');
var ExecQ = require('execq');

var Target = require('./target.js');
var parse = require('./parser.js');

const CONFIG = require('../config.js');

function Tracker(position) {
  this.location = position;
  this._geo = null;
  //this.execQ = new ExecQ();
}

Tracker.prototype.getPosition = function (force, callback) {
  if (force || !this._geo)
    this.reqPosUpdate(callback);
  else
    return callback(this._geo);
};

Tracker.prototype.reqPosUpdate = function (callback) {
  var self = this;
  var url = CONFIG.geo_baseurl + position;
  request(url, function (err, res, body) {
    // 获取第一个命中位置
    var pos = JSON.parse(body.match(/AMap\.MAjaxResult\[.+\]\s*=\s*(.+)/)[1]).list[0];
    // 保存经纬度
    callback(self._geo = {
      x: pos.x, 
      y: pos.y
    });
  });
};

// 保存各网站的店家页面url
Tracker.prototype.urls = CONFIG.urls;

Tracker.prototype.trackRestaurant = function (callback) {
  var self = this;
  var targets = [];
  var execQ = new ExecQ();

  function cb(url, err, res, body) {
    var target = new Target(body);
    target.registParser(CONFIG.parser(url));
    targets.push(target);
    // 如果pending队列为空, 执行回调函数
    // 否则进行下一项抓取
    execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
  }

  self.urls(self.x, self.y, self.location).forEach(function (url) {
    execQ.pend([null, request, url, cb.bind(null, url)]);
  });

  execQ.goon(execQ.length - 1);
};

/*Tracker.prototype.trackFood = function (urls, callback) {
  var self = this;
  var execQ = new ExecQ();
  var targets = [];

  function cb(url, err, res, body) {
    var target = new Target(body);
    target.registParser(CONFIG.parser);
    targets.push(target);
    execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
  }

  urls.forEach(function (url) {
    execQ.pend([null, request, url, cb.bind(null, url)]);
  });
  execQ.goon(execQ.length - 1)
};*/
