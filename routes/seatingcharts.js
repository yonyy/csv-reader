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

router.get('/', function(req, res, next) {
	res.redirect('/')
});

router.post('/', function(req, res, next) {
/*	var className = req.body.className;
	var totalStudents = req.body.totalStudents;
	var totalSeats = req.body.totalSeats;
	var width = req.body.width;
	var height = req.body.height;
	var students = req.body.students;*/
	//var gridHTML = req.body.gridHTML;
	var classroom = req.body.classroom;
	var seed = req.body.seed
	var classType = req.body.classType
	var seatMap = req.body.seatMap
	var roster = req.body.roster
	var parsedClass = JSON.parse(classroom)
	var className = parsedClass.className
	mongoose.model('Classroom').findOne({className : className}, function (err, newClass){
		if (err) {
			console.error(err)
		}
		if (!newClass) {
			console.log("Classroom not found")
			mongoose.model('Classroom').create({
				className : className,
				height : parsedClass.height,
				width : parsedClass.width,
				ghostSeats : parsedClass.ghostSeats,
				leftSeats : parsedClass.leftSeats,
				aisleSeats : parsedClass.aisleSeats,
				totalSeats : parsedClass.totalSeats,
				numPerStation : parsedClass.numPerStation,
				seatOrder : parsedClass.seatOrder,
				classType : classType
			}, function (err, newClass){
				if (err)
					console.error(err)
				else
					console.log("Uploaded : " + newClass.className)
			});
		}
		else {
			console.log("Class already exists. Not uploading")
		}
	});
	
/*	console.log(totalSeats)*/
	res.render('seating_chart', {
		classroom : classroom,
		roster : roster,
		seatMap : seatMap,
		seed : seed,
		classType : classType,
	});
});

module.exports = router;