var http = require('http');
var url = require('url');

function request(opt, callback) {
  //request.redirectCount = request.redirectCount || 0;
  var buf = [];
  var location;

  if (typeof opt == 'string')
    opt = {
      url: opt,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
      }
    };
  else if (!opt.headers)
    opt.headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
    };
  
  location = url.parse(opt.url);

  http.get({
    hostname: location.hostname,
    path: location.path,
    headers: opt.headers || {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36'
    }
  }, function (res) {
    res.on('data', function (d) {
      buf.push(d);
    }).on('end', function () {
      if (/*request.redirectCount < 5 &&*/ res.statusCode == 302) {
        buf = null;
        opt.headers['Cookie'] = res.headers['set-cookie'];
        opt.headers['Host'] = location.hostname;
        opt.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
        opt.headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
        opt.url = url.parse(res.headers['location']).protocol ? res.headers['location'] : location.protocol + '//' + location.hostname + res.headers['location'];
        //request.redirectCount++;
        request(opt, callback);
      } else {
        request.redirectCount = 0;
        callback(res, Buffer.concat(buf).toString());
      }
    });
  });
}

module.exports = request;