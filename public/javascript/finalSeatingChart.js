/*var grid = sessionStorage.getItem('finalGridContainer');	// HTML body that contains the classroom
var gridCol = sessionStorage.getItem('width');		// Value containing the classroom width
var gridRow = sessionStorage.getItem('height');		// Value containing the classroom height
var seatMap = JSON.parse(sessionStorage.getItem('all_seats'));	// Hashmap of Seats K: id V: seat
var students = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var seatArr = []	// Array of the seats*/

var grid = "";	// HTML body that contains the classroom
var gridCol = 0;		// Value containing the classroom width
var gridRow = 0;		// Value containing the classroom height
var seatMap = {};		// Hashmap of Seats K: id V: seat
var students = [];		// Array of students
var seatArr = [];		// Array of the seats

/* Function that executes once the HTML body loads. Appends the grid HTML,
 * updates the onclick function, and begins assigning the students to a seat,
 * and attaching info */
function loadGrid(gridHTML, width, height, classroom, studentsArr, seed, classType) {
	grid = gridHTML
	gridCol = width
	gridRow = height
	seatMap = classroom
	students = JSON.parse(studentsArr)
	
	console.log(seatMap)
	console.log(students)
	$('.finalGridContainer').append(gridHTML);
	$('.seat_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	$('.station_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	if (classType == "lab") {
		assignStations(seed);
		attachStationInfo()
	}
	else {
		assignSeats(seed);
		attachInfo();
	}
}

/* Creates a span element, and inside it contains the student's information.
 * This can be seen when the user hovers over the seat */
function attachInfo() {
	$('.seat_item').each(function(index, element) {
		var seatObj = seatMap[$(element).attr('id')];
		if (seatObj.isGhost) {
			var info = "<p>Ghost Seat </p>";
			var studentProfile = "<span>" + info + "</span>"
			$(element).append(studentProfile)
		}
		else {
			var studentObj = seatObj.student;
/*			console.log(seatObj);*/
			var name = "<p>Name: "+ studentObj.lastname + ", " + studentObj.firstname+"</p>";
			var email = "<p>Email: " + studentObj.email + "</p>";
			var studentID = "<p>ID: " + studentObj.studentID + "</p>";
			var seatID = "<p>Seat: " + studentObj.seat.seatPosition + "</p>";
			var hand = studentObj.isLeftHanded ? "<p>Left-Handed</p>" : "<p>Right Handed</p>"
			var studentProfile = "<span class=\"objectInfo\">" + name + email + studentID + seatID + hand + "</span>"
			$(element).append(studentProfile);
/*			if (studentObj.isLeftHanded) 
				console.log("Left-Handed");*/
		}
	})
}

/* Creates a span element, and inside it contains the student's information.
 * This can be seen when the user hovers over the station */
function attachStationInfo() {
	$('.station_item').each(function(index, element) {
		var stationObj = seatMap[$(element).attr('id')];
		if (stationObj.isGhost) {
			var info = "<p>Ghost Seat </p>";
			var studentProfile = "<span>" + info + "</span>"
			$(element).append(studentProfile)
		}
		else {
			var studentObjs = stationObj.students;
/*			console.log(seatObj);*/
			var names = "<p>Names: "
			var emails = "<p>Emails: "
			var studentIDs = "<p>IDs: "
			for (var i = 0; i < studentObjs.length; i++) {
				names += "<p>"+studentObjs[i].lastname + ", " + studentObjs[i].firstname+"</p>";
				emails += studentObjs[i].email + ", ";
				studentIDs += studentObjs[i].studentID + ", ";
			}
			names += "</p>"
			emails += "</p>"
			studentIDs += "</p>"
			var seatID = "<p>Seat: " + studentObjs[0].seat.stationNum + "</p>";
			var studentProfile = "<span class=\"objectInfo\">" + names + emails + studentIDs + seatID +"</span>"
			$(element).append(studentProfile);
			console.log(studentProfile)
/*			if (studentObj.isLeftHanded) 
				console.log("Left-Handed");*/
		}
	})
}

function displaySeatInfo(id) {
	console.log(seatMap[id]);
}

/* Assigns the students to a seat */
function assignSeats(seed) {
	var leftStudents = []	// an array to hold the students who are left handed
	var rightStudents = []	// an array to hold the students who are right handed
	var tempList = students;
	var rightIndex = 0;	// index containing how many students have been assigned in the left handed array
	var leftIndex = 0;	// index containing how many students have been assigned in the right handed array
	shuffle(tempList,seed);	// Shuffles the list of students
	
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in seatMap) {
		if (seatMap.hasOwnProperty(key)) {
			seatArr.push(seatMap[key])
		}
	}

	// Goes through the shuffles student array and begins dividing it into left and right handed students
	for(var i = 0; i < tempList.length; i++) {
		if (tempList[i].isLeftHanded)
			leftStudents.push(tempList[i])
		else
			rightStudents.push(tempList[i]);
	}

	//assign all the odd columns
	for(var i = 1; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var tempStudent;
			var seat = seatArr[j*gridCol+i];
			console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			console.log("rightIndex: " + rightIndex + " " + "leftIndex: " + leftIndex);
			console.log("leftStudents.length: " + leftStudents.length + " " + "rightStudents.length: " + rightStudents.length)
			console.log(seat)
			if(seat.isGhost) {continue;}
			if(seat.isLeftHanded) {
				// If the students is left handed choose from the left handed array
				// only if there are any left handed students left otherwise choose from
				// the right handed array
				if(leftIndex < leftStudents.length)
					tempStudent = leftStudents[leftIndex++]
				else
					tempStudent = rightStudents[rightIndex++]
			}
			else {
				// If the student is right handed choose from the right handed array
				// only if there are any right handed students left otherwise choose from
				// the left handed array
				if(rightIndex < rightStudents.length)	
					tempStudent = rightStudents[rightIndex++]
				else
					tempStudent = leftStudents[leftIndex++]
			}
			// Add studens to seats only if there are students to add
			if (rightIndex + leftIndex <= tempList.length) {
				console.log(tempStudent)
				seat.student = tempStudent;
				tempStudent.seat = seat;
			}
		}
	}

	//assign all the even columns
	// Follows the same logic as assignign odd columns
	for(var i = 0; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var seat = seatArr[j*gridCol+i]; 
			var tempStudent;
			if(seat.isGhost) {continue;}
			if((rightIndex + leftIndex) >= tempList.length) { continue; }
			if(seat.isLeftHanded)
				if(leftIndex < leftStudents.length)
					tempStudent = leftStudents[leftIndex++]
				else
					tempStudent = rightStudents[rightIndex++]
			else
				if(rightIndex < rightStudents.length)	
					tempStudent = rightStudents[rightIndex++]
				else
					tempStudent = leftStudents[leftIndex++]
			if (rightIndex + leftIndex <= tempList.length) {
				seat.student = tempStudent;
				tempStudent.seat = seat;
			}
		}
	}

	// Fill the remaining seats with empty students
	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		if(s.isGhost) { continue; }
		if(s.student == null) { 
			var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
			s.isEmpty = true;
			emptyStudent.seat = s;
			s.student = emptyStudent; 
			students.push(emptyStudent);
		}
	}
}

/* Assigns the students to a station */
function assignStations(seed) {
	var tempList = students;
	var index = 0
	shuffle(tempList,seed);	// Shuffles the list of students
	console.log("lab")
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in seatMap) {
		if (seatMap.hasOwnProperty(key)) {
			seatArr.push(seatMap[key])
		}
	}

	console.log("gridRow: " + gridRow + " gridCol: " + gridCol)
	console.log("seatArr.length: " + seatArr.length)

	//assign all the odd columns
	for(var i = 1; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var seat = seatArr[j*gridCol+i]; 
			var partners = []
			console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < seat.numPerStation; k++) {
				if(index >= tempList.length) {
					console.log("students.length: " + students.length)
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					partners.push(emptyStudent)
					students.push(emptyStudent)
				}
				else {
					var tempStudent = students[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			console.log("partners: ")
			console.log(partners)
			seat.students = partners;
			console.log(seat)
		}
	}

	//assign all the even columns
	// Follows the same logic as assignign odd columns
	for(var i = 0; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var seat = seatArr[j*gridCol+i]; 
			var partners = []
			console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < seat.numPerStation; k++) {
				if(index >= tempList.length) {
					console.log("students.length: " + students.length)
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					partners.push(emptyStudent)
					students.push(emptyStudent)
				}
				else {
					var tempStudent = students[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			console.log("partners: ")
			console.log(partners)
			seat.students = partners;
			console.log(seat)
		}
	}

	// Fill the remaining seats with empty students
	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		if(s.isGhost) { continue; }
		if(s.students == null) {
			var partners = []
			for (var k = 0; k < s.numPerStation; k++) {
				console.log("students.length: " + students.length)
				var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
				s.isEmpty = true;
				emptyStudent.seat = s;
				partners.push(emptyStudent)
				students.push(emptyStudent);
			}
			s.students = partners
		}
	}
}

// Function that shuffles the array
function shuffle(array, seed) {
	if (seed != "")
		Math.seedrandom(seed)
	var currentIndex = array.length
	var temporaryValue
	var randomIndex

	// While there remain elements to shuffle...
	while (0 != currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}