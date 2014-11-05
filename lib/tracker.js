
var request = require('./request');
var ExecQ = require('execq');

var Target = require('./target');
var parse = require('./parser');
var formatlib = require('./format');

var proxy = require('./config');

function Tracker(position) {
  this.location = position;
  // 保存各网站的店家页面url
  this.urls = [];
}

Tracker.prototype.getUrl = function (url, lng, lat, addr) {
  return url + (url.match(/(baidu)|(meituan)/) ? addr + '&' : '') + 'lng=' + lng + '&lat=' + lat;
};

Tracker.prototype.trackRestaurant = function (callback) {
  var self = this;
  var targets = [];
  var execQ = new ExecQ();

  function cb(url, parser, res, body) {
    var addr = self.location;
    var lng, lat;
    if (url.match(/ele/)) {
      // 获取第一个命中位置
      var pos = JSON.parse(body.match(/AMap\.MAjaxResult\[.+\]\s*=\s*(.+)/)[1]).list[0];
      lng = pos.x;
      lat = pos.y;
    } else if (url.match(/baidu/)) {
      var pos =  JSON.parse(body).result.content[0];
      lng = pos.longitude; 
      lat = pos.latitude;
    } else if (url.match(/meituan/)) {
      var pos = JSON.parse(body).result.location;
      lng = pos.lng;
      lat = pos.lat;
    }
    //console.log(self.getUrl(url, lng, lat, addr))
    request(self.getUrl(url, lng, lat, addr), function (res, body) {
      var target = new Target(body);
      target.registParser(parser);
      targets.push(target);
      // 如果pending队列为空, 执行回调函数
      // 否则进行下一项抓取
      //console.log(target);
      execQ.length ? execQ.goon(execQ.length - 1) : callback(parse(targets));
    });    
  }

  proxy.forEach(function (p) {
    var url = p.geo_baseurl + self.location;
    execQ.pend([null, request, [url, cb.bind(null, p.res_baseurl, p.parser)]]);
  });

  execQ.goon(execQ.length - 1);
};

Tracker.prototype.normalize = function (restaurants, callback) {
  var result = restaurants.map(function (proxy) {
    return proxy.map(function (restaurant) {
      return restaurant.name;
    });
  }).reduce(function (a, p, i, map) {
    var o = {};
    p.forEach(function (n, j) {
      o[n] = [ [i, j] ];
      for (var l, m = i + 1; m < map.length; m++) {
        /*if ((l = map[m].indexOf(n)) != -1)
          o[n].push([m, l]);*/
        
        // 近似匹配
        var likely = map[m].reduce(function (tuple, e, l) {
          // 计算并更新编辑距离
          var newEditd = formatlib.editdUpdate(formatlib.computeEditd(e, n), tuple.editd);
          return {
            editd: newEditd,
            pair: newEditd < tuple.editd ? [m, l] : (tuple.pair || null)
          };
        }, { editd: Infinity });
        // 找到其他组中的近似元素
        if (!Number.isFinite(likely.editd))
          o[n].push(likely.pair);
      }
    });

    var keys = Object.keys(a);
    keys.length && keys.forEach(function (k) {
      if (o[k])
        o[k] = a[k].length > o[k].length ? a[k] : o[k];
      else
        o[k] = a[k];
    });

    return o;
  }, {});

  for (var i in result)
    result[i] = result[i].reduce(function (arr, b) {
      arr.push(restaurants[b[0]][b[1]]);
      return arr;
    }, []);

  return callback(result);
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
