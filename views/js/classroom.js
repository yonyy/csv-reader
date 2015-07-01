function readForm(form) {
	/*var width = parseInt(form.width.value,10);
	var height = parseInt(form.height.value,10);*/
	var width = form.width.value;
	var height = form.height.value;
	createCells(width,height);
	return false;
}

function createCells(width,height) {
	console.log(width + " " + height);
}