var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var className = req.query.classname;
	res.render('seating_chart', {
		className: className,
	});
});

module.exports = router;