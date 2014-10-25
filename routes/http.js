var request = require('request')
request.defaults({jar: true})
request('http://waimai.meituan.com/home/yb4h38ysf30y', function (e,res,b) {
  console.log(e, res, b)
})