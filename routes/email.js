var express = require('express');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

router.post('/', function(req, res, next) {
	var roster = req.body.roster;
	var className = JSON.stringify(req.body.className);
	console.log(className);
	res.render('email',{
		roster : roster,
		className : className
	});
});

module.exports = router;