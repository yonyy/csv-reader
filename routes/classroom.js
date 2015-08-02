var express = require('express');
var router = express.Router();
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

router.post('/', function(req, res, next) {
	var className = req.body.className;
	if (className == '')
		className = "Classroom"
	var width = req.body.width;
	var height = req.body.height;
	var students = req.body.students;
	var totalStudents = req.body.totalStudents
	console.log(width + " " + height);
	res.render('classroom', {
		className : className,
		height : height,
		width : width,
		students : students,
		totalStudents : totalStudents
	});

});

/*router.get('/seating_chart', function(req, res, next) {
	var className = req.query.classname;
	res.render('seating_chart', {
		className: className,
	});
});*/

module.exports = router;