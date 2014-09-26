var vertx = require('vertx');

vertx.createHttpServer().requestHandler(function(req) {
	var file = req.path() === '/' ? 'index.html' : req.path();
	req.response.sendFile('/' + file); // 'webroot/'
}).listen(8080)
