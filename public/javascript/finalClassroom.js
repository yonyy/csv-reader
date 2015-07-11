var grid = sessionStorage.getItem('finalGridContainer');
var seatMap = JSON.parse(sessionStorage.getItem('all_seats'));	// Hashmap of Seats K: id V: seat
var students = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var gridCol = sessionStorage.getItem('width');
var gridRow = sessionStorage.getItem('height');
var seatArr = []	// Array of the seats

function loadGrid() {
	$('.finalGridContainer').html(grid);
	$('.seat_item').attr("onclick","displaySeatInfo($(this).attr('id'))");
	assignSeats();
	attachInfo();
}

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
			console.log(seatObj);
			var name = "<p>"+ "Name: "+ studentObj.lastname + ", " + studentObj.firstname+"</p>";
			var email = "<p>Email: " + studentObj.email + "</p>";
			var seatID = "<p>Seat: " + studentObj.seat.seatPosition + "</p>";
			var hand = studentObj.isLeftHanded ? "<p>Left-Handed</p>" : "<p>Right Handed</p>"
			var studentProfile = "<span>" + name + email + seatID + hand + "</span>"
			$(element).append(studentProfile);
			if (studentObj.isLeftHanded) 
				console.log("Left-Handed");
		}
	})
}

function displaySeatInfo(id) {
	console.log(seatMap[id]);
}

function assignSeats() {
	var leftStudents = []
	var rightStudents = []
	var tempList = students;
	var rightIndex = 0;
	var leftIndex = 0;
	shuffle(tempList);
	for (var key in seatMap) {
		if (seatMap.hasOwnProperty(key)) {
			seatArr.push(seatMap[key])
		}
	}

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
			if(seat.isGhost) {continue;}
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
			seat.student = tempStudent;
			tempStudent.seat = seat;
		}
	}

	//assign all the even columns
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
			seat.student = tempStudent;
			tempStudent.seat = seat;
		}
	}

	for(var i = 0; i < seatArr.length; i++) {
		var s = seatArr[i];
		if(s.isGhost) { continue; }
		if(s.student == null) { 
			var emptyStudent = new Student("EMPTY", "EMPTY", "", false, false, null);
			s.isEmpty = true;
			emptyStudent.seat = s;
			s.student = emptyStudent; 
			students.push(emptyStudent);
		}
	}
}

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