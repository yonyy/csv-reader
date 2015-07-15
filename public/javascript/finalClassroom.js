var grid = sessionStorage.getItem('finalGridContainer');	// HTML body that contains the classroom
var seatMap = JSON.parse(sessionStorage.getItem('all_seats'));	// Hashmap of Seats K: id V: seat
var students = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var gridCol = sessionStorage.getItem('width');		// Value containing the classroom width
var gridRow = sessionStorage.getItem('height');		// Value containing the classroom height
var seatArr = []	// Array of the seats

/* Function that executes once the HTML body loads. Appends the grid HTML,
 * updates the onclick function, and begins assigning the students to a seat,
 * and attaching info */
function loadGrid() {
	$('.finalGridContainer').append(grid);
	$('.seat_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	assignSeats();
	attachInfo();
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
			var name = "<p>"+ "Name: "+ studentObj.lastname + ", " + studentObj.firstname+"</p>";
			var email = "<p>Email: " + studentObj.email + "</p>";
			var studentID = "<p>ID: " + studentObj.studentID + "</p>";
			var seatID = "<p>Seat: " + studentObj.seat.seatPosition + "</p>";
			var hand = studentObj.isLeftHanded ? "<p>Left-Handed</p>" : "<p>Right Handed</p>"
			var studentProfile = "<span>" + name + email + studentID + seatID + hand + "</span>"
			$(element).append(studentProfile);
/*			if (studentObj.isLeftHanded) 
				console.log("Left-Handed");*/
		}
	})
}

function displaySeatInfo(id) {
	console.log(seatMap[id]);
}

/* Assigns the students to a seat */
function assignSeats() {
	var leftStudents = []	// an array to hold the students who are left handed
	var rightStudents = []	// an array to hold the students who are right handed
	var tempList = students;
	var rightIndex = 0;	// index containing how many students have been assigned in the left handed array
	var leftIndex = 0;	// index containing how many students have been assigned in the right handed array
	shuffle(tempList);	// Shuffles the list of students
	
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

// Function that shuffles the array
function shuffle(array) {
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