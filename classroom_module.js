exports.view = function(req, res) {
	var width = req.query.width;
	var height = req.query.height;
	console.log(width + " " + height);
	res.render('classroom', {
		height : height,
		width : width
	});

}