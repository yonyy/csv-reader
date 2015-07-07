var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var http = require('http').createServer(app);
var classroom_module = require('./classroom_module');
var site = require('./site.js');
var methodOverride = require('method-override');

/* Server config */
app.set("ipaddr", "127.0.0.1");
app.set("port",8080);
app.set('view engine', 'jade');
app.set('views',__dirname + '/views');
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/views/js'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/* Send home page file */
app.get('/', site.index);
app.get('/classroom', classroom_module.view);
app.get('/classroom/seating_chart', classroom_module.view_chart)

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});