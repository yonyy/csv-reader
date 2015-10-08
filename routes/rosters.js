var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('rosters');
});

router.get('/edit/:id', function(req, res, next) {
	res.render('editRoster');
});

module.exports = router;