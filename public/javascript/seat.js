var isGhost = false;
var isLeftHanded = false;
var ghostColor = "FFFFFF";
var leftColor = "#76FF03";
var rightColor = "#FF5722";
var finalGridContainer = "";
var numGhosts = 0;

function Seat(isGhost,isLeftHanded,student,isEmpty,seatPosition) {
	this.isGhost = isGhost;
	this.isLeftHanded = isLeftHanded;
	this.student = student;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
}

/* Updates the seat as left handed, empty, or ghost based off the checkbox
 * selected As well as update the number of non ghost seats */
function updateSeat(id, expectedSeats, totalStud) { 
	$('.alert').remove();
	var seatObj = classroom[id];
	console.log(id);
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		if (!seatObj["isGhost"])
			numGhosts++;
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
	}
	else if (isLeftHanded) {
		$('#'+id).css("background-color", leftColor);
		if (numGhosts > 0 && seatObj["isGhost"])
			numGhosts--
		seatObj["isLeftHanded"] = true;
		seatObj["isGhost"] = false;
	}
	else if (!isLeftHanded && !isGhost) {
		$('#'+id).css("background-color", rightColor);
		if (numGhosts > 0 && seatObj["isGhost"])
			numGhosts--;
		seatObj["isLeftHanded"] = false;
		seatObj["isGhost"] = false;
	}
	console.log(seatObj)
	console.log($('#'+id).html());
	console.log(numGhosts)
	var actualTotal = expectedSeats - numGhosts
	$('p.actualTotal').text('Actual Total Seats: ' + actualTotal)
	if (actualTotal < parseInt(totalStud,10))
		$('.errorMessage').prepend("<div class=\'alert alert-warning\' id=\'errorSeatTotal\'> <strong>Warning!</strong> There are not enough seats for all the students. Please remove some ghost seats or begin a new and bigger classroom </div>")
	$('.totalSeats').val(parseInt(actualTotal))
}