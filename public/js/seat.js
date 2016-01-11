var isGhost = false;	// variable to keep track if ghost checkbox is clicked
var isLeftHanded = false;	// variable to keep track if left handed option is clicked
var isAisle = false;

var ghostColor = "FFFFFF";	// background color of a ghost seat
var leftColor = "#2196F3";	// background color of a left handed seat
var rightColor = "#FF5722";	// background color of a right handed seat
var aisleColor = "#B71C1C";

var finalGridContainer = "";	// suppose to contain the HTML content of the grid once it is finalized
var numGhosts = 0;	// keeps track of the total number of ghosts
var actualTotal = 0	// keeps track of the total non ghost seats
var seatMap = {}	// seatMap to allow quick access to the seat object based of its id position
var globalClassroom = {}	// global classroom object. Once classroom is finalized, the passed in classroom is updated to this one
var ghostSeats = []	// array to hold positions of ghosts seats. Assigend to global classroom once all seats are assigned
var leftSeats = []	// array to hold position of left seats. Assigned to global classroom once all seats are assigned

function Seat(isGhost,isLeftHanded,student,isEmpty,seatPosition) {
	this.isGhost = isGhost;
	this.isLeftHanded = isLeftHanded;
	this.student = student;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
	this.isAisle = false;
}

// k: seat[letter][number] v: Seat Obj
/*  Function that loops through each div containing the class .seat_item
    and generates a seat based of the divs' id and default parameters
*/
function createSeats(classroom) {
	globalClassroom = classroom
	$(".seat_item").each(function(index, element){
        var seatId = $(element).attr('id');
		var seat = new Seat(false, false, null, true, seatId);
		seatMap[seatId] = seat;
		actualTotal++
		//console.log(actualTotal)
	});

	// This section run if user has selected an uploaded classroom
	// It over writes the current status of the seat to a ghost seat
	ghostSeats = classroom.ghostSeats
	//console.log(ghostSeats.length)
	for (var i = 0; i < ghostSeats.length; i++) {
		var seatId = "#"+ghostSeats[i]
		$(seatId).css("background-color", ghostColor);
		var seatObj = seatMap[ghostSeats[i]]
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
		actualTotal--
		//console.log(actualTotal)
	}

	// This section run if user has selected an uploaded classroom
	// It over writes the current status of the seat to a left seat
	leftSeats = classroom.leftSeats
	//console.log(leftSeats)
	for (var i = 0; i < leftSeats.length; i++) {
		var seatId = "#"+leftSeats[i]
		$(seatId).css("background-color", leftColor);
		var seatObj = seatMap[leftSeats[i]]
		seatObj["isGhost"] = false;
		seatObj["isLeftHanded"] = true;		
	}
}


/* Updates the seat as left handed, empty, or ghost based off the checkbox
 * selected As well as update the number of non ghost seats */
function updateSeat(id, expectedSeats, totalStud) { 
	$('.alert').remove();
	var seatObj = seatMap[id];
	//console.log(id);
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		if (!seatObj["isGhost"]) {
			numGhosts++;
			ghostSeats.push(id)
		}
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
		
		// Push the id to the ghostSeat and remove it from leftSeats
		var index = leftSeats.indexOf(id);
		if (index > -1)
    		leftSeats.splice(index, 1);
	}
	else if (isLeftHanded) {
		$('#'+id).css("background-color", leftColor);
		if (numGhosts > 0 && seatObj["isGhost"]) {
			numGhosts--
			leftSeats.push(id)
		}
		seatObj["isLeftHanded"] = true;
		seatObj["isGhost"] = false;
		
		// Push id to the leftSeats and remove it from ghostSeats
		var index = ghostSeats.indexOf(id);
		if (index > -1)
    		ghostSeats.splice(index, 1);
	}
	else if (isAisle) {
		if (!seatObj.isAisle) {
			seatObj["isAisle"] = true;
			$('#'+id).css("background-color", aisleColor);
		}
	}
	else if (!isLeftHanded && !isGhost && !isAisle) {
		$('#'+id).css("background-color", rightColor);
		if (numGhosts > 0 && seatObj["isGhost"])
			numGhosts--;
		seatObj["isLeftHanded"] = false;
		seatObj["isGhost"] = false;
		seatObj["isAisle"] = false;

		// Remove id from both left and ghost seats array
		var index = leftSeats.indexOf(id);
		if (index > -1)
    		leftSeats.splice(index, 1);

    	index = ghostSeats.indexOf(id);
		if (index > -1)
    		ghostSeats.splice(index, 1);
	}
	//console.log(seatObj)
	//console.log($('#'+id).html());
	//console.log(numGhosts)
	actualTotal = expectedSeats - numGhosts
	$('p.actualTotal').text('Actual Total Seats: ' + actualTotal)
	if (actualTotal < parseInt(totalStud,10)) {
		$('.errorMessage').prepend("<div class=\'alert alert-warning\' id=\'errorSeatTotal\'> <strong>Warning!</strong> There are not enough seats for all the students. Please remove some ghost seats or begin a new and bigger classroom </div>")
		$(window).scrollTop(0)
	}
	$('.totalSeats').val(parseInt(actualTotal,10))
	$('.totalGhosts').val(parseInt(numGhosts,10))
}