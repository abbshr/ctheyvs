
// 为每个网站封装一个target
function Target(content) {
  //this.url = ;
  this.html = content;
  this._parser = null;
}

Target.prototype.registParser = function (parser) {
  typeof parser == 'function' && (this._parser = parser);
};

Target.prototype.parse = function ($) {
  return this._parser($);
}

/* 使用给定html字符流提取关键信息
 * @$: cheerio.load(html) 
 * 每个函数获取不同网站信息
 */

module.exports = Target;
