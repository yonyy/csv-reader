function Student(lastname, firstname, email, id, isLH, isOSD, seat)	{
	this.lastname = lastname.replace(/"/g, '');
	this.firstname = firstname.replace(/"/g, '');
	this.email = email;
	this.studentID = id.length > 0 ? parseInt(id.replace(/(\r\n|\n|\r)/gm,""),10) : "";
	this.isLeftHanded = isLH;
	this.isOSD = isOSD;
	this.seat = seat;
}

/*function updateRoster(id) {
	console.log($('.isLeftHanded').val());
	roster[rosterMap[id]].isLeftHanded = ($('.isLeftHanded').val() == "true") ? true : false;
	roster[rosterMap[id]].isOSD = ($('.isOSD').val() == "true") ? true : false;
	if (roster[rosterMap[id]].isLeftHanded) {
		console.log(roster[rosterMap[id]].firstname + " isLeftHanded");
	}
	else
		console.log(roster[rosterMap[id]].firstname + " NOT isLeftHanded");	
}*/

/* A function that assigns the selected student as left handed or not based of the
 * value selected */
function assignHand(id, isLH) {
	console.log(isLH);
	roster[rosterMap[id]].isLeftHanded = (isLH == "true") ? true : false;
	if (roster[rosterMap[id]].isLeftHanded) {
		console.log(roster[rosterMap[id]].firstname + " isLeftHanded");
	}
	else
		console.log(roster[rosterMap[id]].firstname + " NOT isLeftHanded");	
}

/* A function that assigns the selected student as OSD or not based of the
 * value selected */
function assignOSD(id, isOSD) {
	console.log(isOSD);
	roster[rosterMap[id]].isOSD = (isOSD == "true") ? true : false;
	if (roster[rosterMap[id]].isOSD) {
		console.log(roster[rosterMap[id]].firstname + " isOSD");
	}
	else
		console.log(roster[rosterMap[id]].firstname + " NOT isOSD");	
}

/* Uses the properties of a Student object to generate a string. This function
 * will be used when generating the PDF */
function createString(student) {
	var id = student.studentID.toString();
	if (id.length == 2)
		id = "0"+id;
	else if (id.length == 1)
		id = "00"+id
	var seatPos = student.seat.seatPosition;
	if (seatPos.length == 2)
		seatPos = seatPos + " ";
	return id + " ______ " + seatPos + " " + student.lastname + ", " + student.firstname;
}