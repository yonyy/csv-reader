var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var className = req.query.classname;
	if (className == '')
		className = "Classroom"
	var width = req.query.width;
	var height = req.query.height;
	console.log(width + " " + height);
	res.render('classroom', {
		className : className,
		height : height,
		width : width
	});

});

/*router.get('/seating_chart', function(req, res, next) {
	var className = req.query.classname;
	res.render('seating_chart', {
		className: className,
	});
});*/

module.exports = router;