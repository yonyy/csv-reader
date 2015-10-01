// File that contains the neccessary functions needed in the create page

var newUpload = true;
var newClass = true;
var manualRoster = false
/*$('.submitForm').click(function() {
	//- sessionStorage.setItem('all_students', JSON.stringify(all_students));
	$('#students').val(JSON.stringify(all_students));
	$('#totalStudents').val(total_students)
	console.log(all_students)
	console.log(total_students)
})*/


/* Checks if the user is using an old classroom or making a new one.
    Same with the roster. If the new classroom, performs validation
    on the inputs and creates the classroom object. If it is an old
    classroom assigns the clasroom object to be the old classroom.

    If new roster, checks that the roster file isn't empty. If not sets
    roster object to be the old roster.

    Once validation is complete, calls redirect() to perform neccessary
    actions
*/
function checkRosterAndClass(classType) {
    var new_room = {}
    var new_roster = {}

    if (manualRoster) {
        readManualRoster()
        new_roster = new Roster(fileName, all_students, total_students)
    } else if (newUpload) {
        if (validateRoster())   // checks that roster isnt empty
            new_roster = new Roster(fileName,all_students,total_students)
        else
            return false
    } else {
        new_roster = JSON.parse($('.existingRoster').val())
    }

    if (newClass) {
        if(validateClassroom(classType)) {  // checks that all fields have been filled
            /* Create classroom if it passes all of the checks */
            var width = parseInt($('#widthInsert').val(),10);
            var height = parseInt($('#heightInsert').val(),10);
            var className = $('#className').val()
            var numPerStation = (classType != "lab") ? 1 : parseInt($('#perStationInsert').val(),10)
            new_room = new Classroom(width, height, className, classType, [], [], (width*height), numPerStation)
        }
        else
            return false
    } else {
            new_room = JSON.parse($('.existingClass').val())
    }

    if (!compareRosterAndClass(classType)) return false
    redirect(new_roster,new_room,classType)
}

function compareRosterAndClass(classType){
    var classroomSize = 0
    var perStation = 1
    var width = parseInt($('#widthInsert').val(),10);
    var height = parseInt($('#heightInsert').val(),10);
    
    if (newClass) {
        if (classType == "lab") perStation =  parseInt($("#perStationInsert").val(), 10)
        classroomSize = (height*width)*perStation
    }
    else {
        var tempParse = JSON.parse($('.existingClass').val())
        classroomSize = tempParse.totalSeats * tempParse.numPerStation
    }
    if (classroomSize < total_students){
        throwSizeError()
        return false
    }

    return true 
    // validating classroom size
}

function throwSizeError() {
    $('.alert').remove();
    $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorArea\'> <strong>Error!</strong> Not a big enough classroom </div>")
    if (newClass) {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').addClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').addClass('has-error')
    }
    else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').removeClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').removeClass('has-error')
        $('.existingClass').addClass('has-error')
    }
    $(window).scrollTop(0)
}

/* Function that takes in the roster, classroom, and classType
    variables and performs a POST request to /student */
function redirect(roster,classroom,classType) {
	var seed = $('#seedInsert').val()
	urlParm = {
		roster : JSON.stringify(roster),
		classroom : JSON.stringify(classroom),
		classType : classType,
		seed : seed
	}

	$.redirect('/student', urlParm , 'POST');

}