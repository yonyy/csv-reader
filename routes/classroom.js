var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var className = req.query.name;
	if (className == '')
		className = "Classroom"
	var width = req.query.width;
	var height = req.query.height;
	console.log(width + " " + height);
	res.render('classroom', {
		name : className,
		height : height,
		width : width
	});

});

router.get('/seating_chart', function(req, res, next) {
	var className = req.query.name;
	res.render('seating_chart', {
		title: className
	});
});

module.exports = router;