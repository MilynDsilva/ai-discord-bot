const http = require('http')

http.createServer(function (request, response) {
    response.write("Alive!");
    response.end();
}).listen(8080)