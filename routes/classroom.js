var express = require('express');
var router = express.Router();
var mongoose = require('mongoose') //mongo connection
var bodyParser = require('body-parser'); // parses information from POST
var methodOverride = require('method-override'); // used to manipulate POST
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
/*	var className = req.body.className;
	if (className == '')
		className = "Classroom"
	var width = req.body.width;
	var height = req.body.height;
	var students = req.body.students;
	var totalStudents = req.body.totalStudents
	var totalGhosts = req.body.totalGhosts
	var seed = req.body.seed
	console.log(width + " " + height);*/
	var classroom = req.body.classroom
	var seed = req.body.seed
	var roster = req.body.roster
	var classType = req.body.classType

	var parsedRoster = JSON.parse(roster)
	var rosterName = parsedRoster.rosterName
	mongoose.model('Roster').findOne({rosterName : rosterName}, function (err, newRoster){
		if (err) {
			console.error(err)
		}
		if (!newRoster) {
			console.log("Roster not found")
			mongoose.model('Roster').create({
				rosterName : rosterName,
				totalStudents : parsedRoster.totalStudents,
				students : parsedRoster.students,
			}, function (err, newRoster){
				if (err)
					console.error(err)
				else
					console.log("Uploaded : " + newRoster.rosterName)
			});
		}
		else {
			console.log("Roster already exists. Not uploading")
		}
	});

	res.render('classroom', {
		classroom: classroom,
		roster: roster,
		seed : seed,
		classType : classType
	});

});

/*router.get('/seating_chart', function(req, res, next) {
	var className = req.query.classname;
	res.render('seating_chart', {
		className: className,
	});
});*/

module.exports = router;