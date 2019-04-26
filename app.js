var http = require('http');//モジュール読み出し
var server = http.createServer(function(request, response){

  response.writeHead(200,{'Content-Type':'text/plain'});
  response.write('Hello World\n');
  response.end();
});
server.listen(process.env.PORT || 8080);
