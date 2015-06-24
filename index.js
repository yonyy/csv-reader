var express = require('express');
var app = express();
var http = require('http').createServer(app);

/* Server config */
app.set("ipaddr", "127.0.0.1");
app.set("port",8080);
app.use(express.static(__dirname+'/public/css'));
app.use(express.static(__dirname+'/public/js'));

/* Send HTML file */
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/main.html');
});

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});