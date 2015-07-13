var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var width = req.query.width;
	var height = req.query.height;
	var className = req.query.classname;

	res.render('student', {
		title: 'Customize your Roster',
		width: width,
		height: height,
		className : className,
	});
});

module.exports = router;