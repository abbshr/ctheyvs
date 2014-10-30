#!/usr/bin/env node

var cluster = require('cluster');
var os = require('os');
var net = require('net');

if (cluster.isMaster) {
  var multilevel = require('multilevel');
  var level = require('level');
  var db_loc = level('../location');

  net.createServer(function (socket) {
    socket.pipe(multilevel.server(db_loc)).pipe(socket);
  }).listen('8888');

  cluster
  .on('fork', function (worker) {
    //worker.send(wrap_loc);
  })
  .on('online', function (worker) {
    console.log('slaver进程 [', worker.id, '] 启动');
  })
  .on('disconnect', function (worker) {
    console.log('slaver进程 [', worker.id, '] 与master断开连接');
    console.log('正在重新启动...');
    cluster.fork();
  })
  .on('exit', function (worker, code, signal) {
    console.log('slaver进程 [', worker.id, '] 退出:', code, signal);
  });

  process.on('exit', function () {
    for (var i in cluster.workers) {
      cluster.workers[i].disconnect();
      console.log('slaver进程 [', i, '] 退出');
    }
  });

  for (var i = 0, len = os.cpus().length - 1; i < len; i++)
    cluster.fork();

} else {
  var http = require('http');
  var debug = require('debug')('fuckapp');
  var app = require('../app');
  app.set('port', process.env.PORT || 3000);
  http.createServer(app).listen(app.get('port'));
}

