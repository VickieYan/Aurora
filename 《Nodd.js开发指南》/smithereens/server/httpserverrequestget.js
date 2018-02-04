var http = require('http')
var url = require('url')
var util = require('util')

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'})
    res.end(util.inspect(url.parse(req.url, true)))
}).listen(3030)

console.log('http server listening on the port 3030')