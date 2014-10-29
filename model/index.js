
// 数据抽象模型
var net = require('net');
var multilevel = require('multilevel');

var con = net.connect(8888);
// 两个存储仓库
var db_loc = multilevel.client();//level('location');
con.pipe(db_loc.createRpcStream()).pipe(con);
//var db_res = level('restaurant');

// 根据地点获取餐馆信息
exports.queryLocation = function (location, callback) {
  var list = [];

  db_loc.createReadStream({
    start: location,
    end: location + '~'
  }).on('data', function (d) {
    list.push(JSON.parse(d.value));
  }).on('end', function () {
    callback(null, list.length && list);
  }).on('error', function (e) {
    console.log(e);
    callback(e, null);
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

  var ws = db_loc.createWriteStream().on('close', function () {
    callback();
  });
  
  for (var i in restaurants)
    ws.write({ key: location + '-' + i, value: restaurants[i] , valueEncoding: 'json' });
  ws.end();
};

/*exports.storeRestaurant = function (restaurant, foods, callback) {
  callback || (callback = function () {});
  db_res.put(restaurant, foods, function () {
    callback();
  });
};*/
