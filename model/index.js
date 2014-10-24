
// 数据抽象模型

var level = require('level');
// 两个存储仓库
var db_loc = level('location');
//var db_res = level('restaurant');

// 根据地点获取餐馆信息
exports.queryLocation = function (location, callback) {
  db_loc.get(location, function (err, results) {
    if (err.notFound) {  
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// 根据地点和餐厅名获取指定餐厅的食物种类
/*exports.queryRestaurant = function (restaurant, callback) {
  db_res.get(restaurant, function (err, results) {
    if (err.notFound) {  
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};*/

exports.storeLocation = function (location, restaurants, callback) {
  callback || (callback = function () {});
  
  var result = restaurants.map(function (proxy) {
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
  }, {});

  for (var i in result) {
    result[i] = result[i].reduce(function (arr, b) {
      arr.push(restaurants[b[0]][b[1]]);
      return arr;
    }, []);
  }

  db_loc.createWriteStream().on('close', function () {
    callback();
  }).write({ key: location, value:result , valueEncoding: 'json' });
};

/*exports.storeRestaurant = function (restaurant, foods, callback) {
  callback || (callback = function () {});
  db_res.put(restaurant, foods, function () {
    callback();
  });
};*/
