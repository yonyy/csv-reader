var express = require('express');
var nodemailer = require('nodemailer');
var async = require('async')
var smtpPool = require('nodemailer-smtp-pool');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var textParser = require('./modules/textParser.js');

router.use(bodyParser.urlencoded({limit: '50mb', extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));

router.post('/', function(req, res, next) {
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

	/* UCSD requires you to authorize SMTP with SSL (Secure Sockets Layer) to use 
		the outgoing mail server from off campus.
		For most non-UCSD ISPs, such as cable modem services, specify smtp.ucsd.edu 
		as your outgoing server. */
	var transporter = nodemailer.createTransport(smtpPool({
		host: 'smtp.ucsd.edu',
		secure: true, // use SSL
		port : 465, // port for secure SMTP
		greetingTimeout : 300,
		auth: {
			user: userEmail,
			pass: userPass
    	},
    	tls: {	//
    		rejectUnauthorized: false
    	}
	}));

	var sentTotal = 0;
	var expectedRecievers = 0;
	var parsedBodyText = "";
	
	async.series([
		function sendEmails(callback) {
			for(var i = 0; i < toList.length; i++) {
				// Send non empty emails
				if (toList[i] != "") {
					if (!rosterMap[toList[i]])	// send regular text if reciever isnt in roster
						parsedBodyText = text
					else
						parsedBodyText = textParser.parseText(text, rosterMap[toList[i]]);
					expectedRecievers++;
					console.log(toList[i]);
					var mailOptions = {
						from: userEmail, // sender address
						to: toList[i], // list of receivers
						subject: subject, // Subject line
						text: parsedBodyText // plaintext body
					};
					
					// send mail with defined transport object
					transporter.sendMail(mailOptions, function(error, info){
						if(error) {
							status = false;
							console.log(error);
					    } else {
					    	sentTotal++;
					        console.log('Message sent: ' + info.response);
					    }
					});
				}
			}
			callback(null,sentTotal)
		},
		function sendStatus(callback) {
			console.log("sentTotal: " + sentTotal + " out of " + expectedRecievers)
			if(status) {
				res.render('send', {
					status : "success",
					sentTotal : sentTotal,
					expectedRecievers : expectedRecievers
				});
			} else {
				res.render('send', {
					status : "error"
				});
			}

		}
	], function (err, result){
		console.log(result)
	});
});

module.exports = router;