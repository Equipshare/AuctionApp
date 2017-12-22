var http = require('http');

//while(true){
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
 	//while(true)
 	res.write(req.url);
 	  res.end('Hello World!  '+ Date());
}).listen(808);