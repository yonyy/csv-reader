var manIncrease = false;
var manualClass = false;
var isGhost = false;
var autoFill = true;
var clear = false;
var remove = false;
var removeAll = false;

var ghostColor = "FFFFFF";
var rightColor = "#FF5722";
var finalGridContainer = "";
var numGhosts = 0;
var updatedStationNum = 1;
var maxStations = 0;

function Station(isGhost,numPerStation,students,isEmpty,seatPosition, gridPos) {
	this.isGhost = isGhost;
	this.numPerStation = parseInt(numPerStation,10);
	this.students = students;
	this.isEmpty = isEmpty;
	this.seatPosition = seatPosition;
	this.gridPos = parseInt(gridPos,10)
}

/* Updates the seat as left handed, empty, or ghost based off the checkbox
 * selected As well as update the number of non ghost seats */
function updateStation(id, expectedSeats, totalStud, numPerStation) { 
	$('.alert').remove();
	var seatObj = classroom[id];
	maxStations = parseInt(expectedSeats,10);

	console.log("id: " + id);
	
	if (isGhost) {
		$('#'+id).css("background-color", ghostColor);
		if (!seatObj["isGhost"])
			numGhosts++;
		seatObj["isGhost"] = true;
		console.log(seatObj)

	}
	if (remove)
		removeStation(id)
	if (manIncrease)
		manIncreaseStation(id)
	if (!manIncrease && !isGhost && !autoFill && !remove && !removeAll) {
		$('#'+id).css("background-color", rightColor);
		if (numGhosts > 0 && seatObj["isGhost"])
			numGhosts--;
		seatObj["isGhost"] = false;
	}

	console.log(numGhosts)
	
	var actualTotal = expectedSeats - numGhosts
	$('p.actualTotal').text('Actual Total Seats: ' + actualTotal)
	if (actualTotal*parseInt(numPerStation,10) < parseInt(totalStud,10))
		$('.errorMessage').prepend("<div class=\'alert alert-warning\' id=\'errorSeatTotal\'> <strong>Warning!</strong> There are not enough seats for all the students. Please remove some ghost seats or begin a new and bigger classroom </div>")
	$('.totalSeats').val(parseInt(actualTotal,10))
	$('.totalGhosts').val(parseInt(numGhosts,10))
	console.log("totalSeats: " + actualTotal)
}

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
	$("#"+id).children().text("")
}

function clearClass() {
	console.log("clearing")
	updatedStationNum = 1;
	var newMap = {}
	/* Loop through current stations, and change the station's id to blank */
	$(".station_item").each(function(index, element){
        var stationId = $(element).attr('id');
        var tempStation = classroom[stationId]
        var newID = ""
        tempStation["seatPosition"] = newID
        newMap[index+1] = tempStation
        
		$(element).attr('id', index+1)
		$(element).children().text(newID)
        console.log(tempStation);

	});
	classroom = newMap
	console.log(classroom)
	clear = true;
}

function manIncreaseStation(stationID) {
	if (updatedStationNum % (parseInt(maxStations,10)+1) == 0 )
		updatedStationNum = 1
	
	console.log("maxStations: " + maxStations)
	console.log("updatedStationNum: " + updatedStationNum)

	var newID = updatedStationNum
	var tempStation = classroom[stationID]
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

	var switchStat = classroom[newID]
	classroom[newID] = tempStation
	classroom[stationID] = switchStat
	console.log(classroom[newID])
}

function autoFillStation(w, h) {
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
        var tempStation = classroom[stationId]
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
    classroom = newMap
    console.log(classroom)
}