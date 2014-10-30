#!/usr/bin/env node

var util = require('util');

var dataCenter = require('../model');
var tracker = require('../lib/tracker');

dataCenter.iterAllLocations(function (err, result) {
  if (err) {
    throw err;
  } else if (result) {
    console.log('命中所有缓存地点, 开始更新数据...');
    result.forEach(function (l) {
      console.log('正在抓取地点 [', l, '] 周边餐饮信息...');
      var tracker = new Tracker(l);
      tracker.trackRestaurant(function (result) {
        tracker.normalize(result, function (result) {
          // 餐馆信息存入数据库
          dataCenter.storeLocation(l, result, function () {
            util.log(l + ' 周边数据已经是最新.');
          });
        });
      });
    });
  } else {
    // init
  }
});