var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); // parses information from POST
var methodOverride = require('method-override'); // used to manipulate POST
var textParser = require('./modules/textParser.js');
var mongoose = require('mongoose') //mongo connection


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
	var width = req.body.width;
	var height = req.body.height;
	var className = req.body.className;
	var students = req.body.students;	// array of students
	var totalStudents = req.body.totalStudents;
	var totalGhosts = parseInt(req.body.totalGhosts,10);
	var seed = (req.body.seed != "") ? req.body.seed : JSON.stringify("noSeed")
	var classType = req.body.classType
	var classModel = req.body.classModel // Object to be posted to DB
	var numPerStation
	if (classType == "lab")
		var numPerStation = req.body.numPerStation
	else
		numPerStation = 1

/*	console.log(students);*/
	console.log(totalStudents);
	res.render('student', {
		title: 'Customize your Roster',
		width: width,
		height: height,
		className : className,
		students : students,
		totalStudents : totalStudents,
		totalGhosts : totalGhosts,
		seed : seed,
		classType : classType,
		numPerStation : numPerStation
	});
});

module.exports = router;