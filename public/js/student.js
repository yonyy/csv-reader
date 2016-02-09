function Student(lastname, firstname, email, id, isLH, isOSD, seat)	{
	this.lastname = lastname.replace(/"/g, '');
	this.firstname = firstname.replace(/"/g, '');
	this.email = email;
	this.studentID = id.length > 0 ? parseInt(id.replace(/(\r\n|\n|\r)/gm,""),10) : "";
	this.isLeftHanded = isLH;
	this.isOSD = isOSD;
	this.seat = seat;
	this.stationIndex = 0;
}

/* A function that assigns the selected student as left handed or not based of the
 * value selected. Uses the studentMap defined in filterSearchStudent.js */
function assignHand(id, isLH) {
	//console.log(isLH);
	//console.log(students[studentMap[id]])
	students[studentMap[id]].isLeftHanded = (isLH == "true") ? true : false;	
}

/* A function that assigns the selected student as OSD or not based of the
 * value selected Uses the studentMap defined in filterSearchStudent.js */
function assignOSD(id, isOSD) {
	//console.log(isOSD);
	students[studentMap[id]].isOSD = (isOSD == "true") ? true : false;	
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
	while (seatPos.length != 4) {
		seatPos = seatPos + " "
	}
	return (id + " ______ " + seatPos + " " + student.lastname + ", " + student.firstname).substring(0,42);
}