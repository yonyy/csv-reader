var express = require('express');
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var textParser = require('./modules/textParser.js');

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
	var className = req.body.className;
	console.log(className);
	res.render('email',{
		roster : roster,
		className : className
	});
});

router.post('/send',function(req, res, next){
	var rosterArr = JSON.parse(req.body.roster);
	//console.log(rosterArr);
	var rosterMap = {}
	for (var i = 0; i < rosterArr.length; i++) {
		rosterMap[rosterArr[i].email] = rosterArr[i];
	};

	var reciever = req.body.userRecievers;
	var subject = req.body.userSubject;
	var text = req.body.userBody;
	var userEmail = req.body.userEmail;
	var userPass = req.body.userPass;
	var toList = reciever.split(',');
	var status = true;
	var transporter = nodemailer.createTransport(smtpPool({
		service : "gmail",
		auth : {
			user: userEmail,
			pass: userPass,
		}
	}));

	for(var i = 0; i < toList.length; i++) {
		console.log(toList[i])
		if (toList[i] != "") {
			var mailOptions = {
				from: userEmail, // sender address
				to: toList[i], // list of receivers
				subject: subject, // Subject line
				text: textParser.parseText(text, rosterMap[toList[i]]) // plaintext body
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
				if(error) {
					status = false;
					console.log(error);
			    } else {
			        console.log('Message sent: ' + info.response);
			    }
			});
		}
	}

	if(status) {
		res.render('send', {
			status : "success"
		});
	} else {
		res.render('send', {
			status : "error"
		});
	}
});

module.exports = router;