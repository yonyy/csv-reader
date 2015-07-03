function Seat(isGhost,isLeftHanded,student,isEmpty,seatPosition) {
	this.isGhost = isGhost;
	this.isLeftHanded = isLeftHanded;
	this.student = student;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
}

function updateSeat(id) { 
	var seatObj = classroom[id];
	console.log(seatObj)
	seatObj["isGhost"] = true;
	seatObj["isLeftHanded"] = true;
	console.log("seat " + id + " isLeftHanded: " + seatObj["isLeftHanded"] + " , isGhost: " + seatObj["isGhost"]);
}