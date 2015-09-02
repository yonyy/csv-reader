var manIncrease = false;	// variable to check if user selected to manually number stations
var manualClass = false;	// variable to define a state of mode. 
							// If user manually numbers seats, the user should still be allowed to select other boxes without having the grid cleared out 
var isGhost = false;		// variable to keep track if ghost option is clicked
var defaultFill = true;		// variable to keep track if user wants the stations to be defaultFilled
var clear = false;			// varialbe to keep track if grid is needed to cleared out. Grid should clear is user is switching from defaultFill to manual and vice versa
var remove = false;			// variable to keep track if user wants to remove a station number
var removeAll = false;		// variable to keep track if user wants to remove all station numbers

var ghostColor = "FFFFFF";	// background color of ghost seat
var rightColor = "#FF5722";	// background color of right handed seat

var finalGridContainer = "";	// suppose to contain the HTML content of the grid once it is finalized
var numGhosts = 0;	// keeps track of the total number of ghosts
var actualTotal = 0;	// keeps track of the total non ghost seats
var updatedStationNum = 1;	// counter of current station number when user is manual numbering
var maxStations = 0;	// prevent updatedStationNum from going too high
var seatMap = {}	// seatMap to allow quick access to the seat object based of its id position
var globalClassroom = {}	// global classroom object. Once classroom is finalized, the passed in classroom is updated to this one
var ghostSeats = []	// array to hold positions of ghosts seats. Assigend to global classroom once all seats are assigned
var globalOrder = []	// array to hold position final numbering of stations. Assigned to global classroom once finalized

function Station(isGhost,numPerStation,students,isEmpty,seatPosition, gridPos) {
	this.isGhost = isGhost;
	this.numPerStation = parseInt(numPerStation,10);
	this.students = students;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
	this.gridPos = parseInt(gridPos,10)
}

// k: seat[letter][number] v: Station Obj
/*  Function that loops through each div containing the class .station_item
    and generates a seat based of the divs' id and default parameters
*/
function createStations(num, classroom) {
	globalClassroom = classroom
	var seatOrder = classroom.seatOrder;

    var numPerStation = parseInt(num,10)
    $(".station_item").each(function(index, element){
    	// This section runs only if user has selected a previously generated lab room
    	// Over writes station num to match the ordering of the used lab
    	if (seatOrder.length != 0) {
    		$(element).attr('id', seatOrder[index])
    		$(element).children().text(seatOrder[index])
    	}

    	actualTotal++
        var stationId = $(element).attr('id');
        var station = new Station(false, numPerStation, null, false, stationId, index+1);
        seatMap[stationId] = station;
        console.log(station);
    });

	// This section run if user has selected an uploaded classroom
	// It over writes the current status of the seat to a ghost seat
    ghostSeats = classroom.ghostSeats
	for (var i = 0; i < ghostSeats.length; i++) {
		var seatId = "#"+ghostSeats[i]
		$(seatId).css("background-color", ghostColor);
		var seatObj = seatMap[ghostSeats[i]]
		seatObj["isGhost"] = true;
		seatObj["isLeftHanded"] = false;
		actualTotal--
	}

}


/* Updates the station as ghost or new number based off the checkbox
 * selected As well as update the number of non ghost seats */
function updateStation(id, expectedSeats, totalStud, numPerStation) { 
	$('.alert').remove();
	var seatObj = seatMap[id];
	maxStations = parseInt(expectedSeats,10);

	console.log("id: " + id);
	
	/* If it is ghost, update html and seatObject and increment numGhosts */
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		if (!seatObj["isGhost"])
			numGhosts++;
		seatObj["isGhost"] = true;
		console.log(seatObj)

		ghostSeats.push(id)

	}
	if (remove)
		removeStation(id)
	if (manIncrease)
		manIncreaseStation(id)

	/* Making station normal */
	if (!manIncrease && !isGhost && !defaultFill && !remove && !removeAll) {
		$('#'+id).css("background-color", rightColor);
		if (numGhosts > 0 && seatObj["isGhost"])
			numGhosts--;
		seatObj["isGhost"] = false;

		var index = ghostSeats.indexOf(id);
		if (index > -1)
    		ghostSeats.splice(index, 1);
	}

	console.log(numGhosts)
	
	actualTotal = expectedSeats - numGhosts
	$('p.actualTotal').text('Actual Total Seats: ' + actualTotal)
	if (actualTotal*parseInt(numPerStation,10) < parseInt(totalStud,10)) {
		$('.errorMessage').prepend("<div class=\'alert alert-warning\' id=\'errorSeatTotal\'> <strong>Warning!</strong> There are not enough seats for all the students. Please remove some ghost seats or begin a new and bigger classroom </div>")
		$(window).scrollTop(0)
	}
	$('.totalSeats').val(parseInt(actualTotal,10))
	$('.totalGhosts').val(parseInt(numGhosts,10))
	console.log("totalSeats: " + actualTotal)
}

// Validates lab that no station is left unnumbered
function checkEmptyStations() {
	$('.alert').remove()
	$(".station_item").each(function(index, element){
		if ($(element).children().text() == "")
			$('.errorMessage').prepend("<div class=\'alert alert-warning\' id=\'errorEmptySeat\'> <strong>Warning!</strong> There is one or more unnumbered stations. Please number it. </div>")
			return false
	})

	return true;
}

function removeStation(id) {
	if ($("#"+id).children().text() != "" && updatedStationNum > 1)
		updatedStationNum--;
	$("#"+id).children().text("")
}

// Resets the grid. This function is called if user has switched from defaultFill to manualIncrease
function clearClass() {
	console.log("clearing")
	updatedStationNum = 1;
	var newMap = {}
	/* Loop through current stations, and change the station's id to blank */
	$(".station_item").each(function(index, element){
        var stationId = $(element).attr('id');
        var tempStation = seatMap[stationId]
        var newID = ""
        tempStation["seatPosition"] = newID
        newMap[index+1] = tempStation
        
		$(element).attr('id', index+1)
		$(element).children().text(newID)
        console.log(tempStation);

	});
	seatMap = newMap
	console.log(seatMap)
	clear = true;
}

// Assigns current station to a new number based on current station number
function manIncreaseStation(stationID) {
	// keeps updatedStationNum between 1 <= n <= (width * height)
	if (updatedStationNum % (parseInt(maxStations,10)+1) == 0 )
		updatedStationNum = 1
	
	console.log("maxStations: " + maxStations)
	console.log("updatedStationNum: " + updatedStationNum)

	var newID = updatedStationNum
	var tempStation = seatMap[stationID]
	tempStation["seatPosition"] = newID
	updatedStationNum++


	/* to avoid getting duplicate ids. swap ids between the new one and the old one */
	if (newID != stationID) {
		$("#"+newID).attr('id', "temp")	// Temporarly change id of a div that already contains the new id
		$("#"+stationID).children().text(newID)	// Change the text of the cell that is clicked
		$("#"+stationID).attr('id', newID)	// Change the id of the cell that is clicked to the new one
		if ($("#temp").children().text() != "")
			$("#temp").children().text(stationID) // Switch values
		$("#temp").attr('id', stationID)	// Change the id of the div that had the new id to the old id of cell clicked
	} else {
		$("#"+newID).attr('id', newID)
		$("#"+newID).children().text(newID)
	}

	var switchStat = seatMap[newID]
	seatMap[newID] = tempStation
	seatMap[stationID] = switchStat
	console.log(seatMap[newID])
}

// Loops through each station and resets it to default values
function defaultFillStation(w, h) {
	clear = false;
	var newMap = {}
	var row = 1
	var offset = 0
	
	console.log("width: " + w)
	console.log("height: " +  h)

	var width = parseInt(w,10)
	var height = parseInt(h,10)

    $(".station_item").each(function(index, element){
        var stationId = $(element).attr('id');
        var tempStation = seatMap[stationId]
        var newID = 0
        console.log("index: " + index)
        if (index>0 && index%width == 0 ){
        	row++
        	offset = 0
        }
        if (row % 2 == 0){
        	newID = (index - offset) + width - offset
        	offset++
        }
        else
        	newID = index+1

        console.log("row: " + row)
        console.log("newID: " + newID)
        
        tempStation["seatPosition"] = newID
        newMap[newID] = tempStation

        $(element).attr('id', newID)
        $(element).children().text(newID)
        console.log(tempStation);
    });
    seatMap = newMap
    console.log(seatMap)
}