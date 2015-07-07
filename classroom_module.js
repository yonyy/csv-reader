var className = "";

exports.view = function(req, res) {
	className = req.query.name;
	if (className == '')
		className = "Classroom"
	var width = req.query.width;
	var height = req.query.height;
	console.log(width + " " + height);
	res.render('classroom', {
		name : className,
		height : height,
		width : width
	});

}

exports.view_chart = function(req, res) {
	res.render('seating_chart', {
		title: className
	});
}