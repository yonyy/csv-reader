/*var grid = sessionStorage.getItem('finalGridContainer');	// HTML body that contains the classroom
var gridCol = sessionStorage.getItem('width');		// Value containing the classroom width
var gridRow = sessionStorage.getItem('height');		// Value containing the classroom height
var finalSeatMap = JSON.parse(sessionStorage.getItem('all_seats'));	// Hashmap of Seats K: id V: seat
var students = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var seatArr = []	// Array of the seats*/

var grid = "";	// HTML body that contains the classroom
var gridCol = 0;		// Value containing the classroom width
var gridRow = 0;		// Value containing the classroom height
var finalSeatMap = {};		// Hashmap of Seats K: seat id V: seat
var students = [];		// Array of all students including Empty Students
var seatArr = [];		// Array of the seats with assignment
var rosterSize = 0;
var numPerStation = 1;
var lab = false;
var finalSeed = 0;
var col = true;
var takenColor = "#76FF03"

//classroom, seats, roster, 
/* Function that executes once the HTML body loads. Appends the grid HTML,
 * updates the onclick function, and begins assigning the students to a seat,
 * and attaching info */
function loadGrid(roster, seed, classType) {
	var sessionRoster = JSON.parse(sessionStorage.getItem('roster'));
	var sessionClass = JSON.parse(sessionStorage.getItem('classroom'));
	var sessionSeat = JSON.parse(sessionStorage.getItem('seats'))
	grid = JSON.parse(sessionStorage.getItem('finalGridContainer'));
	gridCol = parseInt(sessionClass.width,10)
	gridRow = parseInt(sessionClass.height,10)
	numPerStation = parseInt(sessionClass.numPerStation,10)
	finalSeatMap = sessionSeat
	finalSeed = seed
	students = roster.students
    students.sort(sortByName);
	rosterSize = roster.students.length
	
	//console.log(finalSeatMap)
	//console.log(students)
	$('.finalGridContainer').append(grid);
	$('.seat_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	$('.station_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	if (classType == "lab") {
		lab = true
		assignStationsByRow(seed,0,0);
		attachStationInfo()
		createSeatTable();
	}
	else {
		assignSeatsByRow(seed,0,0);
		attachInfo();
		createSeatTable();
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
				var tempID = $(element).attr('id')
				$('#'+tempID).css('background',takenColor)
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

function createSeatTable() {
	var $table = $('.studentSeatList');
	students.sort(sortByName);
	$.each(students, function(index, stud){
		if (stud.studentID != "") {
			var tr = "<tr>";
			var tdLastName = "<td>" + stud.lastname + "</td>"
			var tdFirstName = "<td>" + stud.firstname + "</td>"
			var tdSeat = "<td><input type=\'text\' onchange=\'changeSeat("+ index + ")\' value=\'"+ stud.seat.seatPosition + "\' id=\'" + stud.lastname + stud.studentID + "\'></td>"
			
			if (lab) tdSeat = "<td><input type=\'text\' onchange=\'changeStation("+ index + ")\' value=\'"+ stud.seat.seatPosition + "\' id=\'" + stud.lastname + stud.studentID + "\'></td>"
			
			tr += tdLastName + tdFirstName + tdSeat + "</tr>"
			$table.append(tr)
		}
	})
}

function changeStation(studentIndex) {
	$('.errorSeatChange').remove()
	$('.successSeatChange').remove()

	var chosenStud = students[studentIndex];
	var oldStationID = chosenStud.seat.seatPosition;
	var oldStation = finalSeatMap[oldStationID];

	var newStationID = $('#' + chosenStud.lastname + chosenStud.studentID).val();
	var newStation = null;
	var emptyStudentIndex = -1;
	var emptyStudent = null;

	var nowEmpty = true;
	var index = 0;
	if (newStationID != "") {
		if (!(newStationID in finalSeatMap)){
			console.log(newStationID)
			$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Enter a valid seat</div>")
			return;
		} else {
			newStation = finalSeatMap[newStationID];
			emptyStudentIndex = $.map(students, function(s, index) {
				if(s.seat.seatPosition == newStationID) {
					if (s.studentID == ""){
						return index;
					}
				}
			})[0]
			emptyStudent = students[emptyStudentIndex]
		}
	}

	if (newStation != null){
		if (newStation.isGhost){
			$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Can't assign to a ghost seat</div>")
			return;
		} else {
			var count = 0;
			for (var i = 0; i < newStation.students.length; i++) {
				if (newStation.students[i].studentID != "") count++
			}

			if (count == numPerStation){
				$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Can't assign to a non-empty seat</div>")
				return;
			}
		}

		for (var i = 0; i < oldStation.students.length; i++) {
			if (oldStation.students[i].studentID == chosenStud.studentID) {
				oldStation.students[i] = emptyStudent;
			}
			if (oldStation.students[i].studentID != "") nowEmpty = false;
		}

		emptyStudent.seat = oldStation;
		newStation.students[emptyStudent.stationIndex] = chosenStud
		newStation.isEmpty = false;
		updateStationObjectInfo(newStationID, newStation);
	}

	if (nowEmpty) {
		oldStation.isEmpty = true;
		$('#'+oldStationID).css("background","#FF5722");
	}
	updateStationObjectInfo(oldStationID, oldStation);
	chosenStud.seat = newStation;

	$('.changeSeatMessage').append("<div class=\'alert alert-success successSeatChange\'>Updated seating assignment</div>");
	if (newStation != null) students[emptyStudentIndex] = emptyStudent;
	students[studentIndex] = chosenStud;
	console.log(newStation)
	console.log(chosenStud)
	console.log(oldStation)
	console.log(emptyStudent)

}

function changeSeat(studentIndex) {
	$('.errorSeatChange').remove()
	$('.successSeatChange').remove()

	var chosenStud = students[studentIndex];
	var oldSeatID = chosenStud.seat.seatPosition;
	var oldSeat = finalSeatMap[oldSeatID];

	var newSeatID = $('#' + chosenStud.lastname + chosenStud.studentID).val();
	var newSeat = null;
	var emptyStudentIndex = -1;
	var emptyStudent = null;

	if (newSeatID != "") {
		if (!(newSeatID in finalSeatMap)){
			console.log(newSeatID)
			$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Enter a valid seat</div>")
			return;
		} else {
			newSeat = finalSeatMap[newSeatID];
			emptyStudentIndex = $.map(students, function(s, index) {
				if(s.seat != null && s.seat.seatPosition == newSeatID) {
					return index;
				}
			})[0]
			emptyStudent = students[emptyStudentIndex]
		}
	}

	if (newSeat != null){
		if (newSeat.isGhost){
			$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Can't assign to a ghost seat</div>")
			return;
		} else if (!newSeat.isEmpty) {
			$('.changeSeatMessage').append("<div class=\'alert alert-danger errorSeatChange\'>Can't assign to a non-empty seat</div>")
			return;
		}

		oldSeat.student = emptyStudent;
		emptyStudent.seat = oldSeat;
		newSeat.student = chosenStud;
		newSeat.isEmpty = false;
		updateObjectInfo(newSeatID, newSeat);
	}

	if (newSeatID == "") {
		students.splice(studentIndex,1)
		chosenStud.seat =  null
		emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, oldSeat)
		oldSeat.student = emptyStudent
		students.push(emptyStudent)
	}

	oldSeat.isEmpty = true;
	updateObjectInfo(oldSeatID, oldSeat);
	chosenStud.seat = newSeat;

	$('#'+oldSeatID).css("background","#FF5722");
	$('.changeSeatMessage').append("<div class=\'alert alert-success successSeatChange\'>Updated seating assignment</div>");
	if (newSeat != null) students[emptyStudentIndex] = emptyStudent;
	students[studentIndex] = chosenStud;

	console.log(newSeat)
	console.log(chosenStud)
	console.log(oldSeat)
	console.log(emptyStudent)
}

function updateObjectInfo(newSeatID, newSeat) {
	var studentProfile = "";
	var studentObj = newSeat.student;
	if (studentObj.studentID != "") {
		$('#'+newSeatID).css('background',takenColor)
		var name = "<p>Name: "+ studentObj.lastname + ", " + studentObj.firstname+"</p>";
		var email = "<p>Email: " + studentObj.email + "</p>";
		var studentID = "<p>ID: " + studentObj.studentID + "</p>";
		var seatID = "<p>Seat: " + studentObj.seat.seatPosition + "</p>";
		var hand = studentObj.isLeftHanded ? "<p>Left-Handed</p>" : "<p>Right Handed</p>"
		studentProfile = "<span class=\"objectInfo\">" + name + email + studentID + seatID + hand + "</span>"
	}
	else
		studentProfile = "<span class=\"objectInfo\">Empty</span>"
	$('#' + newSeatID).html(studentProfile);
}

function updateStationObjectInfo(newStationID, newStation) {
	console.log("updateStationObjectInfo")
	var stationSpan = "<span class=\'stationNumber\''>" + newStation.seatPosition + "</span>"
	var studentObjs = newStation.students;
	var names = "<p>Names: "
	var emails = "<p>Emails: "
	var studentIDs = "<p>IDs: "
	for (var i = 0; i < studentObjs.length; i++) {
		names += "<p>"+studentObjs[i].lastname + ", " + studentObjs[i].firstname+"</p>";
		if (studentObjs[i].studentID != "") {
			$('#'+newStationID).css('background',takenColor)
			emails += studentObjs[i].email + ", ";
			studentIDs += studentObjs[i].studentID + ", ";
		}
	}
	names += "</p>"
	emails += "</p>"
	studentIDs += "</p>"
	var seatID = "<p>Seat: " + studentObjs[0].seat.seatPosition + "</p>";
	var studentProfile = "<span class=\"objectInfo\">" + names + emails + studentIDs + seatID +"</span>"
	$('#' + newStationID).html(stationSpan + studentProfile);
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
					var tempID = $(element).attr('id')
					$('#'+tempID).css('background',takenColor)
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
	console.log(finalSeatMap[id]);
}

/* Assigns the students to a seat by row. In addition, this is currently used to evenly space out students 1 row and 1 seat apart from each other. */
function assignSeatsByRow(seed, colOffset, rowOffset) {
	var leftStudents = []	// an array to hold the students who are left handed
	var rightStudents = []	// an array to hold the students who are right handed
	var tempList = students;
	var rightIndex = 0;	// index containing how many students have been assigned in the left handed array
	var leftIndex = 0;	// index containing how many students have been assigned in the right handed array
	var nonGhosts = 0;
	shuffle(tempList,seed);	// Shuffles the list of students
	
	var counter = 0
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
			if (!finalSeatMap[key].isGhost) nonGhosts++
		}
	}

	// Enough space to spread out more
	console.log("Roster: " + rosterSize)
	console.log("Seats available: " + nonGhosts)
	var percentage = rosterSize/nonGhosts;
	if (percentage >= .80) {
		rowOffset = 0;
		colOffset = 1;
	} else if (percentage >= .60){	// Dont change to rowOffset: 1 colOffset: 2. Causes an infinite while loop
		rowOffset = 1;
		colOffset = 1;
	} else if (percentage >= .40) {
		rowOffset = 1;
		colOffset = 1;
	} else if (percentage >= .20) {
		rowOffset = 1;
		colOffset = 1;
	} else if (percentage >= .0) {
		rowOffset = 1;
		colOffset = 3;
	}

	console.log("percentage: " + percentage + " colOffset: " + colOffset + " rowOffset: " + rowOffset);
	// Goes through the shuffled student array and begins dividing it into left and right handed students
	for(var i = 0; i < tempList.length; i++) {
		if (tempList[i].isLeftHanded)
			leftStudents.push(tempList[i])
		else
			rightStudents.push(tempList[i]);
	}

	//assign all by row. Seperate each student by specific amounts of rows and cols
	//console.log("tempList.length: " + tempList.length)
	for(var j = 0; j < gridCol; j+=(colOffset+1)) {
		for(var i = gridRow-1; i >= 0; i-=(rowOffset+1)) {
			var right = true;
			var tempStudent;
			var seat = seatArr[i*gridCol+j];
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
	console.log(counter + " students assigned")
	console.log("rightStudents: " + rightStudents.length + " leftStudents: " + leftStudents.length)
	//var colStartPosition = gridCol-2;
	var colStartPosition = 0;
	var rowStartPosition = gridRow-2;
	// If any students are left, place them in any empty spot
	while (rightIndex + leftIndex < tempList.length){
		for(var j = colStartPosition; j < gridCol; j+=colOffset+1) {
			for(var i = rowStartPosition; i >= 0; i-=rowOffset+1) {
				var right = true;
				var tempStudent;
				var seat = seatArr[i*gridCol+j];
				if(seat.isGhost) { continue; }
				if((rightIndex + leftIndex) >= tempList.length) { continue; }
				if(seat.student == null) { 
					console.log("empty seat")
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
		}
/*		if (rowOffset > 0) rowOffset--;
		else {
			if (colOffset > 0) colOffset--;
		}*/
		if (colStartPosition < gridCol-1) colStartPosition++;
		if (colStartPosition%2 == 1) rowStartPosition = gridRow-1;
		else rowStartPosition = gridRow-2;
		console.log("leftIndex: " + leftIndex + " rightIndex: " + rightIndex + " tempList: " + tempList.length)
	}

	if (rightIndex + leftIndex < tempList.length) console.log("STILL STUDENTS MISSING")
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
	console.log(counter + " students assigned")
}

/* Assigns the students to a station */
function assignStationsByRow(seed, colOffset, rowOffset) {
	var tempList = students;
	var index = 0
	var maxStudents = tempList.length;
	var nonGhosts = 0;
	var counter = 0;
	shuffle(tempList,seed);	// Shuffles the list of students
	//console.log("lab")
	// Copies over the map of seats and pushes it into an array in order to loop through it
	for (var key in finalSeatMap) {
		if (finalSeatMap.hasOwnProperty(key)) {
			seatArr.push(finalSeatMap[key])
			if (!finalSeatMap[key].isGhost) nonGhosts++
		}
	}

	// Enough space to spread out more
	console.log("Roster: " + rosterSize)
	console.log("Seats available: " + nonGhosts)
	var percentage = rosterSize/(nonGhosts*numPerStation);
	if (percentage >= .80) {
		rowOffset = 0;
		colOffset = 1;
	} else if (percentage >= .60){	// Dont change to rowOffset: 1 colOffset: 2. Causes an infinite while loop
		rowOffset = 1;
		colOffset = 2;
	} else if (percentage >= .40) {
		rowOffset = 1;
		colOffset = 2;
	} else if (percentage >= .20) {
		rowOffset = 1;
		colOffset = 1;
	} else if (percentage >= .0) {
		rowOffset = 1;
		colOffset = 3;
	}

	console.log("percentage: " + percentage + " colOffset: " + colOffset + " rowOffset: " + rowOffset);
	//assign by row
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
					emptyStudent.stationIndex = k;
					partners.push(emptyStudent)
					students.push(emptyStudent)
					//console.log(k)
				}
				else {
					var tempStudent = tempList[index++];
					tempStudent.seat = seat;
					tempStudent.stationIndex = k;
					partners.push(tempStudent);
					counter++;
				}
			}
			seat.students = partners;
		}
	}

	//var colStartPosition = gridCol-2;
	var colStartPosition = 1;
	var rowStartPosition = gridRow-2;
	// If any students are left, place them in any empty spot
	while (index < maxStudents){
		for(var j = colStartPosition; j < gridCol; j+=colOffset+1) {
			for(var i = rowStartPosition; i >= 0; i-=rowOffset+1) {
				var seat = seatArr[i*gridCol+j];
				if(seat.isGhost) { continue; }
				if(seat.student == null) { 
					var partners = []
					//console.log("i: " + i + " j: " + j + " index: " + (j*gridCol+i))
					for (var k = 0; k < parseInt(seat.numPerStation,10); k++) {
						//console.log("index: " + index + "tempList.length "+ tempList.length)
						if(index >= maxStudents) {
							//console.log("students.length: " + students.length)
							var emptyStudent = new Student("EMPTY", "EMPTY", "", "", false, false, null);
							emptyStudent.seat = seat;
							emptyStudent.stationIndex = k;
							partners.push(emptyStudent)
							students.push(emptyStudent)
							//console.log(k)
						}
						else {
							var tempStudent = tempList[index++]
							tempStudent.seat = seat;
							tempStudent.stationIndex = k;
							partners.push(tempStudent)
							counter++;
						}
					}
					seat.students = partners;
				}
			}
		}
/*		if (rowOffset > 0) rowOffset--;
		else {
			if (colOffset > 0) colOffset--;
		}*/
		if (colStartPosition < gridCol-1) colStartPosition++;
		if (colStartPosition%2 == 0) rowStartPosition = gridRow-1;
		else rowStartPosition = gridRow-2;
	}


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
				emptyStudent.stationIndex = k;
				partners.push(emptyStudent)
				students.push(emptyStudent);
				//console.log(k)
			}
			s.students = partners
		}
	}
	console.log(counter + " students assigned")
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