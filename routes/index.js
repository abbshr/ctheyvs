
var dataCenter = require('../model');
var Tracker = require('./tracker');

exports.index = function (req, res, next) {
  res.render('index');
};

/* url: /location?p= */
exports.location = function (req, res, next) {
  // 获取查询地点
  var location = req.query.p;
  //console.log(location)
  dataCenter.queryLocation(location, function (err, restaurants) {
    if (!restaurants) { 
      // 没有记录, 临时抓取
      var tracker = new Tracker(location);
      tracker.trackRestaurant(function (result) {
        // result是二维数组
        //res.end();
        // 先渲染给前台
        /*console.log(result.map(function (proxy) {
          return proxy.map(function (restaurant) {
            return restaurant.name;
          });
        }).reduce(function (a, p, i, map) {
          var o = {};
          p.forEach(function (n, j) {
            o[n] = [ [i, j] ];
            for (var l, m = i + 1; m < map.length; m++)
              if ((l = map[m].indexOf(n)) != -1)
                o[n].push([m, l]);
          });

          var keys = Object.keys(a);
          keys.length && keys.forEach(function (k) {
            if (o[k])
              o[k] = a[k].length > o[k].length ? a[k] : o[k];
            else
              o[k] = a[k];
          });

          return o;
        }, {}));*/

        res.render('search', {
          title: location,
          restaurants: result
        });
        require('fs').writeFileSync('./docs/input', JSON.stringify(result.map(function (proxy) {
          return proxy.map(function (restaurant) {
            return restaurant.name;
          });
        })));
        require('fs').writeFileSync('./docs/output', JSON.stringify(result.map(function (proxy) {
          return proxy.map(function (restaurant) {
            return restaurant.name;
          });
        }).reduce(function (a, p, i, map) {
          var o = {};
          p.forEach(function (n, j) {
            o[n] = [ [i, j] ];
            for (var l, m = i + 1; m < map.length; m++)
              if ((l = map[m].indexOf(n)) != -1)
                o[n].push([m, l]);
          });

          var keys = Object.keys(a);
          keys.length && keys.forEach(function (k) {
            if (o[k])
              o[k] = a[k].length > o[k].length ? a[k] : o[k];
            else
              o[k] = a[k];
          });

          return o;
        }, {})));
        //console.log(result[0]);
        // 餐馆信息存入数据库
        /*dataCenter.storeLocation(location, result, function () {
          console.log('新地点已添加, 周边餐馆信息解析完毕.');
        });*/
        // 食物信息存入数据库
        //dataCenter.storeRestaurant(result,function ());
      });
    } else {
      // 直接渲染
      res.render('search', {
        restaurants: restaurants
      });
    }
  });
};

/* url: /restaurant?n=&p= */
/*exports.restaurant = function (req, res, next) {
  // 获取查询餐馆
  var restaurant = req.query.n;
  var location = req.query.p;

  dataCenter.queryRestaurant(location + '-' + restaurant + '-food', function (err, restaurant) {
    if (!restaurant) {
      console.log(err);
    } else {
      res.render('restaurant', {
        restaurant: restaurant
      });
    }
  });
};*/
