var express = require('express')
var router = express.Router()
var mongoose = require('mongoose') //mongo connection
var bodyParser = require('body-parser') //parses information from POST
var methodOverride = require('method-override') //used to manipulate POST
var async = require('async')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

router.get('/', function(req, res, next) {
	var existingClasses = []
	var existingRosters = []

	async.series([
		function findClasses(callback) {
			// Get all classroom
			mongoose.model('Classroom').find({classType: "classroom"}, function (err, classrooms) {
				if (err)
					return console.error(err);
				else {
					existingClasses = classrooms
					console.log("classrooms: " + classrooms.length)
					callback(null, classrooms)
				}
			});
		},
		function findRosters(callback) {
			// Get all rosters
			mongoose.model('Roster').find({}, function (err, rosters) {
				if (err)
					return console.error(err)
				else {
					existingRosters = rosters
					console.log("roster: " + rosters.length)
					callback(null, rosters)
				}
			});
		},
		function sendResults(callback) {
			res.format({
				html : function() {
						//HTML response will render the createClass.jade file in the views folder. 
						// We are also setting "classrooms" to be an accessible variable in our jade view
						res.render('createClass', {
							classrooms : JSON.stringify(existingClasses),
							rosters : JSON.stringify(existingRosters)
						});
					},
				json: function() {
					res.json({
						classrooms: existingClasses,
						rosters : existingRosters
					});
				}

			});
		}

	], function(err, results){
		console.log("done")
	});
});

module.exports = router;