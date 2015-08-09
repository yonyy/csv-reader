var mongoose = require('mongoose');
/*var http = require('http');*/

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/csvDB';

// The http server will listen to an appropriate port, or default to
// port 5000.
/*var theport = process.env.PORT || 5000;*/

mongoose.connect(uristring, function (err, res) {
	if (err)
		console.log('ERROR connecting to: ' + uristring + '. ' + err)
	else
		console.log('Succeeded connected to: ' + uristring)
});