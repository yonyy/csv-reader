var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
var logger = require('morgan');
var favicon = require('serve-favicon')

var db = require('./model/db');
var classrooms = require('./model/classroom');
var rosters = require('./model/roster');

var api = require('./routes/api')
var routes = require('./routes/index');
var classroom = require('./routes/classroom');
var lab = require('./routes/lab')
var seatingchart = require('./routes/seatingcharts')
var student = require('./routes/student');
var email = require('./routes/email');
var createClass = require('./routes/createClass');
var createLab = require('./routes/createLab')
var send = require('./routes/send')

var http = require('http').createServer(app);
var methodOverride = require('method-override');

/* Server config */
app.set("ipaddr", "127.0.0.1");
app.set("port",8080);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname + '/views'));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/public/javascript')));
app.use(express.static(path.join(__dirname + '/public/stylesheets')));
app.use(express.static(path.join(__dirname + '/public/images')));
app.use(bodyParser.json({limit: '50mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));     // to support URL-encoded bodies
app.use(methodOverride('_method'));

/* Send home page file */
app.use('/', routes);
app.use('/create', createClass)
app.use('/createLab', createLab)
app.use('/classroom', classroom);
app.use('/lab', lab)
app.use('/student', student);
app.use('/email', email);
app.use('/seating_chart', seatingchart)
app.use('/send', send)
app.use('/api', api)

http.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});

module.exports = app;