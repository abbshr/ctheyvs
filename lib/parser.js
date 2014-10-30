var cheerio = require('cheerio');
// 解析html, 提取需要信息
// @target <Array>: 封装各个网站的抽象对象
// => result <Array>: 解析后的结果
function parse(target) {
  var result = [];
  target.forEach(function (e, i) {
    var $ = cheerio.load(e.html);
    result.push(e.parse($));
  });
  return result;
}

module.exports = parse;
