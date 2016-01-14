var express = require('express');
var nodemailer = require('nodemailer');
var async = require('async')
var smtpPool = require('nodemailer-smtp-pool');
var router = express.Router();
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var textParser = require('./modules/textParser.js');
var fs = require('fs');

router.use(bodyParser.urlencoded({limit: '50mb', extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));
router.get('/', function(req, res, next) {
	res.redirect('/')
});
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
	var emailLog = "";

	async.series([
		function sendEmails(callback) {
			for(var i = 0; i < toList.length; i++) {
				// Send non empty emails
				if (toList[i] != "") {
					if (!rosterMap[toList[i]])	// send regular text if reciever isnt in roster
						parsedBodyText = text
					else
						parsedBodyText = textParser.parseText(text, rosterMap[toList[i]]);

					emailLog += toList[i] + '\n\n' + subject + '\n\n\n' + parsedBodyText + '\n\n\n';
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
							console.log("Error sending to: " + toList[i])
							console.log(error);
					    } else {
					    	sentTotal++;
					        console.log('Message sent: ' + info.response);
					        console.log("sentTotal: " + sentTotal + " out of " + expectedRecievers)
					    }
					});
				}
			}	
			callback(null,sentTotal)
		},
		function saveLog(callback) {
			fs.writeFile('../emailLog.txt', emailLog, function (err) {
			  if (err) throw err;
			  console.log('It\'s saved!');
			  res.download('emailLog.txt');
			});
			callback(null,emailLog)
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