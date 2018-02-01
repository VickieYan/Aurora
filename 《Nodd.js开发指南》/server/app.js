var http = require('http')

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'})
    res.write('<h1>Node.js</h1>')
    res.end('<h1>test3</h1>')
}).listen(5200)
console.log('HTTP server is listening at port 5200')