
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
        //res.end(JSON.stringify(result));
        // 先渲染给前台
        //console.log(result);
        res.render('search', {
          title: location,
          restaurants: result
        });
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
