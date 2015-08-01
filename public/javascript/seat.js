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
 * selected */
function updateSeat(id, numSeats) { 
	var seatObj = classroom[id];
	console.log(id);
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
		numGhosts++;
	}
	else if (isLeftHanded) {
		$('#'+id).css("background-color", leftColor);
		seatObj["isLeftHanded"] = true;
		seatObj["isGhost"] = false;
		if (numGhosts > 0)
			isGhost--
	}
	else if (!isLeftHanded && !isGhost) {
		$('#'+id).css("background-color", rightColor);
		seatObj["isLeftHanded"] = false;
		seatObj["isGhost"] = false;
		if (numGhosts > 0)
			isGhost--;
	}
	console.log(seatObj)
	console.log($('#'+id).html());
	$('.actualTotal').text('Actual Total Seats: ' + (numSeats - isGhost))
}