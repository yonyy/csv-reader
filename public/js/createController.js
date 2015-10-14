function classController() {
	console.log("classController")
/*	$('#className, #heightInsert, #widthInsert').keyup(function(){
		if (!$('#className').val() && !$('#heightInsert').val() && !$('#widthInsert').val()) {
			$('.existingClass').attr('disabled', false);
		}
		else {
			$('.existingClass').attr('disabled',true);
			newClass = true;
		}*/
/*	});*/

	if (!$('#className').val() && !$('#heightInsert').val() && !$('#widthInsert').val()) {
		$('.existingClass').attr('disabled', false);
	}
	else {
		$('.existingClass').attr('disabled',true);
		newClass = true;
	}

	if($('.existingClass').val() != 0) {
		$('#className').attr('disabled', true);
		$('#heightInsert').attr('disabled', true);
		$('#widthInsert').attr('disabled', true);
		$('#perStationInsert').attr('disabled', true);
		var tempParse = JSON.parse($('.existingClass').val());
		classroomSize = tempParse.totalSeats * tempParse.numPerStation;
		newClass = false;
	}
	else {
		$('#className').attr('disabled', false);
		$('#heightInsert').attr('disabled', false);
		$('#widthInsert').attr('disabled', false);
		$('#perStationInsert').attr('disabled', false);
	}
}

// Pasting a Roster
function manualRosterController() {
	if (!$('#rosterTextInput').val()) {
		$('.existingRoster').attr('disabled', false);
		$('#fileInsert').attr('disabled', false);
		manualRoster = false;
	}
	else {
		$('.existingRoster').attr('disabled', true);
		$('#fileInsert').attr('disabled', true);
		manualRoster = true;
	}
}

// Uploading a new Roster
function uploadRosterController() {
	if($('#fileInsert').val() != "") {
		$('.existingRoster').attr('disabled', true);
		$('#rosterTextInput').attr('disabled', true);
		$('#filename').attr('disabled', true);
		$('.colVal').attr('disabled', true);
		newUpload = true;
		readRoster();
	}
	else {
		$('.existingRoster').attr('disabled', false);
		$('#rosterTextInput').attr('disabled', false);
		$('#filename').attr('disabled', false);
		$('.colVal').attr('disabled', false);
	} 
}

// Choosing an existing Roster
function existingRosterController() {
	if($('.existingRoster').val() != 0) {
		$('#fileInsert').attr('disabled', true);
		$('#rosterTextInput').attr('disabled', true);
		$('#filename').attr('disabled', true);
		$('.colVal').attr('disabled', true);
		total_students = JSON.parse($('.existingRoster').val()).totalStudents;
		newUpload = false;
	}
	else {
		$('#fileInsert').attr('disabled', false);
		$('#rosterTextInput').attr('disabled', false);
		$('#filename').attr('disabled', false);
		$('.colVal').attr('disabled', false);
	} 

}