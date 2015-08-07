var express = require('express');
var router = express.Router();
var mongoose = require('mongoose') //mongo connection
var bodyParser = require('body-parser'); // parses information from POST
var methodOverride = require('method-override'); // used to manipulate POST
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

router.route('/rosters')
	.get(function(req, res, next){
		mongoose.model('Roster').find({}, function (err, rosters){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				res.json(rosters)
			}
		})
	});

router.route('/rosters/:id')
	.get(function(req, res, next){
		console.log("id: " + req.params.id)
		mongoose.model('Roster').findById(req.params.id, function (err, roster){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				res.json(roster)
			}
		});
	})

	.delete(function(req, res, next){
		mongoose.model('Roster').findById(req.params.id, function (err, roster){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				roster.remove(function (err, roster){
					if (err) {
						console.error(err)
						res.json(err)
					}
					else {
						console.log('DELETE removing ID: ' + roster._id);
						res.json({
							message : 'deleted',
							item : roster
						});
					}
				})
			}
		})
	})


router.route('/classrooms')
	.get(function(req, res, next){
		mongoose.model('Classroom').find({}, function (err, classrooms){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				res.json(classrooms)
			}
		})
	});

router.route('/classrooms/:id')
	.get(function(req, res, next){
		console.log("id: " + req.params.id)
		mongoose.model('Classroom').findById(req.params.id, function (err, classroom){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				res.json(classroom)
			}
		});
	})

	.delete(function(req, res, next){
		mongoose.model('Classroom').findById(req.params.id, function (err, classroom){
			if (err) {
				console.error(err)
				res.json(err)
			}
			else {
				classroom.remove(function (err, classroom){
					if (err) {
						console.error(err)
						res.json(err)
					}
					else {
						console.log('DELETE removing ID: ' + classroom._id);
						res.json({
							message : 'deleted',
							item : classroom
						});
					}
				})
			}
		})
	})

module.exports = router;