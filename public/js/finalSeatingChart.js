/*var grid = sessionStorage.getItem('finalGridContainer');	// HTML body that contains the classroom
var gridCol = sessionStorage.getItem('width');		// Value containing the classroom width
var gridRow = sessionStorage.getItem('height');		// Value containing the classroom height
var finalSeatMap = JSON.parse(sessionStorage.getItem('all_seats'));	// Hashmap of Seats K: id V: seat
var students = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var seatArr = []	// Array of the seats*/

var grid = "";	// HTML body that contains the classroom
var gridCol = 0;		// Value containing the classroom width
var gridRow = 0;		// Value containing the classroom height
var finalSeatMap = {};		// Hashmap of Seats K: id V: seat
var students = [];		// Array of students
var seatArr = [];		// Array of the seats
var rosterSize = 0;
var numPerStation = 1;
var lab = false;
var finalSeed = 0;
var col = true;

/* Function that executes once the HTML body loads. Appends the grid HTML,
 * updates the onclick function, and begins assigning the students to a seat,
 * and attaching info */
function loadGrid(gridHTML, classroom, seats, roster, seed, classType) {
	grid = gridHTML
	gridCol = parseInt(classroom.width,10)
	gridRow = parseInt(classroom.height,10)
	numPerStation = parseInt(classroom.numPerStation,10)
	finalSeatMap = seats
	finalSeed = seed
	students = roster.students
    students.sort(sortByName);
	rosterSize = roster.students.length
	
	//console.log(finalSeatMap)
	//console.log(students)
	$('.finalGridContainer').append(gridHTML);
	$('.seat_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	$('.station_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	if (classType == "lab") {
		lab = true
		assignStationsByCol(seed,0,0);
		attachStationInfo()
	}
	else {
		assignSeatsByCol(seed,0,0);
		attachInfo();
	}
}

/* Creates a span element, and inside it contains the student's information.
 * This can be seen when the user hovers over the seat */
function attachInfo() {
	$('.objectInfo').remove()
	$('.seat_item').each(function(index, element) {
		var seatObj = finalSeatMap[$(element).attr('id')];
		if (seatObj.isGhost) {
			var info = "<p class=\"objectInfo\">Ghost Seat </p>";
			var studentProfile = "<span>" + info + "</span>"
			$(element).append(studentProfile)
		}
		else {
			var studentProfile = "";
			var studentObj = seatObj.student;
			if (studentObj.studentID != "") {
				var name = "<p>Name: "+ studentObj.lastname + ", " + studentObj.firstname+"</p>";
				var email = "<p>Email: " + studentObj.email + "</p>";
				var studentID = "<p>ID: " + studentObj.studentID + "</p>";
				var seatID = "<p>Seat: " + studentObj.seat.seatPosition + "</p>";
				var hand = studentObj.isLeftHanded ? "<p>Left-Handed</p>" : "<p>Right Handed</p>"
				studentProfile = "<span class=\"objectInfo\">" + name + email + studentID + seatID + hand + "</span>"
			}
			else
				studentProfile = "<span class=\"objectInfo\">Empty</span>"
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
		var stationObj = finalSeatMap[$(element).attr('id')];
		if (stationObj.isGhost) {
			var info = "<p class=\"objectInfo\">Ghost Seat </p>";
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
				if (studentObjs[i].studentID != "") {
					emails += studentObjs[i].email + ", ";
					studentIDs += studentObjs[i].studentID + ", ";
				}
			}
			names += "</p>"
			emails += "</p>"
			studentIDs += "</p>"
			var seatID = "<p>Seat: " + studentObjs[0].seat.seatPosition + "</p>";
			var studentProfile = "<span class=\"objectInfo\">" + names + emails + studentIDs + seatID +"</span>"
			$(element).append(studentProfile);
		}
	})
}

function displaySeatInfo(id) {
	//console.log(finalSeatMap[id]);
}

function spreadOut(colOffset, rowOffset, sortByCol) {
	var available = 0
	$('.alert').remove()
	for(var i = gridRow-1; i >= 0; i-=(rowOffset+1)) {
		for(var j = 0; j < gridCol; j+=(colOffset+1)) {
			var s = seatArr[i*gridCol+j]
			if (!s.isGhost) available++
		}
	}

	// not enough space to be spread out
	//console.log("lab: " + lab + " sortByCol: " + sortByCol)
	if (available*numPerStation >= rosterSize) {
		clearSeats()
		if (lab) {
			if (sortByCol) assignStationsByCol(finalSeed, colOffset, rowOffset)
			else assignStationsByRow(finalSeed, colOffset, rowOffset)
			attachStationInfo()
		}
		else {
			if (sortByCol) assignSeatsByCol(finalSeed, colOffset, rowOffset)
			else assignSeatsByRow(finalSeed, colOffset, rowOffset)
			attachInfo()
		}
		$('.errorMessage').prepend("<div class=\'alert alert-success\' id=\'completeArrangement\'> <strong>Success!</strong> Rerragement is done</div>")
		$(window).scrollTop(0)
	} else {
		$('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorSeatTotal\'> <strong>Error!</strong> There is not enough space to sit students " + colOffset +" column(s) and " + rowOffset + " row(s) apart</div>")
		$(window).scrollTop(0)
	}

	return
}

function clearSeats() {
	var nonEmpty = []
	for (var k = 0; k < students.length; k++) {
		if (students[k].studentID != ""){
			students[k].seat = null
			nonEmpty.push(students[k])
		}
	}

    nonEmpty.sort(sortByName);
	students = nonEmpty
	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		s.isEmpty = true;
		s.student = null; 
	}
}
/* Assigns the students to a seat by row. In addition, this is currently used to evenly space out students 1 row and 1 seat apart from each other. */
function assignSeatsByRow(seed, colOffset, rowOffset) {
	var leftStudents = []	// an array to hold the students who are left handed
	var rightStudents = []	// an array to hold the students who are right handed
	var tempList = students;
	var rightIndex = 0;	// index containing how many students have been assigned in the left handed array
	var leftIndex = 0;	// index containing how many students have been assigned in the right handed array
	shuffle(tempList,seed);	// Shuffles the list of students
	
	var counter = 0
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
		}
	}

	// Goes through the shuffles student array and begins dividing it into left and right handed students
	for(var i = 0; i < tempList.length; i++) {
		if (tempList[i].isLeftHanded)
			leftStudents.push(tempList[i])
		else
			rightStudents.push(tempList[i]);
	}

	//assign all by row. Seperate each student by one seat and row
	//console.log("tempList.length: " + tempList.length)
	for(var i = gridRow-1; i >= 0; i-=(rowOffset+1)) {
		for(var j = 0; j < gridCol; j+=(colOffset+1)) {
			var right = true;
			var tempStudent;
			var seat = seatArr[i*gridCol+j];
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			//console.log("rightIndex: " + rightIndex + " " + "leftIndex: " + leftIndex);
			//console.log("leftStudents.length: " + leftStudents.length + " " + "rightStudents.length: " + rightStudents.length)
			////console.log(seat)
			if(seat.isGhost) {continue;}
			if((rightIndex + leftIndex) >= tempList.length) { continue; }
			if(seat.isLeftHanded) {
				// If the students is left handed choose from the left handed array
				// only if there are any left handed students left otherwise choose from
				// the right handed array
				if(leftIndex < leftStudents.length) {
					tempStudent = leftStudents[leftIndex]
					right = false;
				}
				else
					tempStudent = rightStudents[rightIndex]
			}
			else {
				// If the student is right handed choose from the right handed array
				// only if there are any right handed students left otherwise choose from
				// the left handed array
				if(rightIndex < rightStudents.length)	
					tempStudent = rightStudents[rightIndex]
				else {
					tempStudent = leftStudents[leftIndex]
					right = false;
				}
			}
			// Add students to seats only if there are students to add
			if (rightIndex + leftIndex < tempList.length) {
				if (right) rightIndex++;
				else leftIndex++
				seat.student = tempStudent;
				tempStudent.seat = seat;
				//console.log(tempStudent)
				counter++
			}

			//console.log(seat)
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
	//console.log(counter + " students assigned")
}

/* Assigns the students to a seat */
function assignSeatsByCol(seed, colOffset, rowOffset) {
	var leftStudents = []	// an array to hold the students who are left handed
	var rightStudents = []	// an array to hold the students who are right handed
	var tempList = students;
	var rightIndex = 0;	// index containing how many students have been assigned in the left handed array
	var leftIndex = 0;	// index containing how many students have been assigned in the right handed array
	shuffle(tempList,seed);	// Shuffles the list of students
	
	var counter = 0
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
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
	//console.log("ODD columns")
	for(var j = 0; j < gridCol; j+=(colOffset+1)) {
		for(var i = gridRow - 1; i >= 0; i-=(rowOffset+1)) {
			var right = true;
			var tempStudent;
			var seat = seatArr[i*gridCol+j];
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			//console.log("rightIndex: " + rightIndex + " " + "leftIndex: " + leftIndex);
			//console.log("leftStudents.length: " + leftStudents.length + " " + "rightStudents.length: " + rightStudents.length)
			//console.log(seat)
			if(seat.isGhost) {continue;}
			if((rightIndex + leftIndex) >= tempList.length) { continue; }
			if(seat.isLeftHanded) {
				// If the students is left handed choose from the left handed array
				// only if there are any left handed students left otherwise choose from
				// the right handed array
				if(leftIndex < leftStudents.length) {
					tempStudent = leftStudents[leftIndex]
					right = false;
				}
				else
					tempStudent = rightStudents[rightIndex]
			}
			else {
				// If the student is right handed choose from the right handed array
				// only if there are any right handed students left otherwise choose from
				// the left handed array
				if(rightIndex < rightStudents.length)	
					tempStudent = rightStudents[rightIndex]
				else {
					tempStudent = leftStudents[leftIndex]
					right = false;
				}
			}
			// Add students to seats only if there are students to add
			if (rightIndex + leftIndex < tempList.length) {
				if (right) rightIndex++;
				else leftIndex++
				seat.student = tempStudent;
				tempStudent.seat = seat;
				//console.log(tempStudent)
				counter++
			}
		}
	}

	//assign all the even columns
	// Follows the same logic as assignign odd columns
	//console.log("EVEN columns")
/*	for(var i = 0; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var right = true
			var tempStudent;
			var seat = seatArr[j*gridCol+i]; 
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			//console.log("rightIndex: " + rightIndex + " " + "leftIndex: " + leftIndex);
			//console.log("leftStudents.length: " + leftStudents.length + " " + "rightStudents.length: " + rightStudents.length)
			//console.log(seat)
			if(seat.isGhost) {continue;}
			if((rightIndex + leftIndex) >= tempList.length) { continue; }
			if(seat.isLeftHanded)
				if(leftIndex < leftStudents.length) {
					tempStudent = leftStudents[leftIndex]
					right = false
				}
				else
					tempStudent = rightStudents[rightIndex]
			else
				if(rightIndex < rightStudents.length)	
					tempStudent = rightStudents[rightIndex]
				else {
					tempStudent = leftStudents[leftIndex]
					right = false;
				}
			if (rightIndex + leftIndex < tempList.length) {
				if (right) rightIndex++
				else leftIndex++
				seat.student = tempStudent;
				tempStudent.seat = seat;
				//console.log(tempStudent)
				counter++
			}
		}
	}*/

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
	//console.log(counter + " students assigned")
}

/* Assigns the students to a station */
function assignStationsByRow(seed, colOffset, rowOffset) {
	var tempList = students;
	var index = 0
	var maxStudents = tempList.length;
	shuffle(tempList,seed);	// Shuffles the list of students
	//console.log("lab")
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
		}
	}

	//console.log("gridRow: " + gridRow + " gridCol: " + gridCol)
	//console.log("seatArr.length: " + seatArr.length)
	//assign all the odd columns
	for(var i = gridRow-1; i >= 0; i-=(rowOffset+1)) {
		for(var j = 0; j < gridCol; j+=(colOffset+1)) {
			var seat = seatArr[i*gridCol+j]; 
			var partners = []
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < parseInt(seat.numPerStation,10); k++) {
				//console.log("index: " + index + "tempList.length "+ tempList.length)
				if(index >= maxStudents) {
					//console.log("students.length: " + students.length)
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					emptyStudent.seat = seat;
					partners.push(emptyStudent)
					students.push(emptyStudent)
					//console.log(k)
				}
				else {
					var tempStudent = tempList[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			seat.students = partners;
		}
	}

	//assign all the even columns
	// Follows the same logic as assignign odd columns
/*	for(var i = 0; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var seat = seatArr[j*gridCol+i]; 
			var partners = []
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < parseInt(seat.numPerStation,10); k++) {
				//console.log("index: " + index + "tempList.length "+ tempList.length)
				if(index >= maxStudents) {
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					emptyStudent.seat = seat
					partners.push(emptyStudent)
					students.push(emptyStudent)
					//console.log(k)
				}
				else {
					var tempStudent = tempList[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			seat.students = partners;
		}
	}*/

	// Fill the remaining seats with empty students
	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		if(s.isGhost) { continue; }
		if(s.students == null) {
			var partners = []
			for (var k = 0; k < parseInt(s.numPerStation,10); k++) {
				//console.log("students.length: " + students.length)
				var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
				s.isEmpty = true;
				emptyStudent.seat = s;
				partners.push(emptyStudent)
				students.push(emptyStudent);
				//console.log(k)
			}
			s.students = partners
		}
	}
}

/* Assigns the students to a station by column first */
function assignStationsByCol(seed, colOffset, rowOffset) {
	var tempList = students;
	var index = 0
	var maxStudents = tempList.length;
	shuffle(tempList,seed);	// Shuffles the list of students
	//console.log("lab")
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
		}
	}

	//console.log("gridRow: " + gridRow + " gridCol: " + gridCol)
	//console.log("seatArr.length: " + seatArr.length)
	//assign all the odd columns
	for(var i = 0; i < gridCol; i+=(colOffset+1)) {
		for(var j = gridRow - 1; j >= 0; j-=(rowOffset+1)) {
			var seat = seatArr[j*gridCol+i]; 
			var partners = []
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < parseInt(seat.numPerStation,10); k++) {
				//console.log("index: " + index + "tempList.length "+ tempList.length)
				if(index >= maxStudents) {
					//console.log("students.length: " + students.length)
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					emptyStudent.seat = seat;
					partners.push(emptyStudent)
					students.push(emptyStudent)
					//console.log(k)
				}
				else {
					var tempStudent = tempList[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			seat.students = partners;
		}
	}

	//assign all the even columns
	// Follows the same logic as assignign odd columns
/*	for(var i = 0; i < gridCol; i+=2) {
		for(var j = gridRow - 1; j >= 0; j--) {
			var seat = seatArr[j*gridCol+i]; 
			var partners = []
			//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
			if(seat.isGhost) {continue;}
			for (var k = 0; k < parseInt(seat.numPerStation,10); k++) {
				//console.log("index: " + index + "tempList.length "+ tempList.length)
				if(index >= maxStudents) {
					var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
					emptyStudent.seat = seat
					partners.push(emptyStudent)
					students.push(emptyStudent)
					//console.log(k)
				}
				else {
					var tempStudent = tempList[index++]
					tempStudent.seat = seat;
					partners.push(tempStudent)
				}
			}
			seat.students = partners;
		}
	}*/

	// Fill the remaining seats with empty students
	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		if(s.isGhost) { continue; }
		if(s.students == null) {
			var partners = []
			for (var k = 0; k < parseInt(s.numPerStation,10); k++) {
				//console.log("students.length: " + students.length)
				var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
				s.isEmpty = true;
				emptyStudent.seat = s;
				partners.push(emptyStudent)
				students.push(emptyStudent);
				//console.log(k)
			}
			s.students = partners
		}
	}
}


// Function that shuffles the array
function shuffle(array, seed) {
	if (!isNaN(seed))	// If seed is a number
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