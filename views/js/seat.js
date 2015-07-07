var isGhost = false;
var isLeftHanded = false;
var ghostColor = "FFFFFF";
var leftColor = "#76FF03";
var rightColor = "D3411F";
var ghostSeats = {};
var leftSeats = {};
var rightSeats = {};


function Seat(isGhost,isLeftHanded,student,isEmpty,seatPosition) {
	this.isGhost = isGhost;
	this.isLeftHanded = isLeftHanded;
	this.student = student;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
}

function updateSeat(id) { 
	var seatObj = classroom[id];
	console.log(id);
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
	}
	else if (isLeftHanded) {
		$('#'+id).css("background-color", leftColor);
		seatObj["isLeftHanded"] = true;
		seatObj["isGhost"] = false;
	}
	else if (!isLeftHanded && !isGhost) {
		$('#'+id).css("background-color", rightColor);
		seatObj["isLeftHanded"] = false;
		seatObj["isGhost"] = false;
	}
	console.log(seatObj)
	console.log($('#'+id).html());
}