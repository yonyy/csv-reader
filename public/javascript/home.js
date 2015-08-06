// File that contains the neccessary functions needed in the create page

var newRoster = true;
var newClass = true;

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
    if (newClass) {
        if(validateClassroom(classType)) {
            /* Create classroom if it passes all of the checks */
            var width = parseInt($('#widthInsert').val(),10);
            var height = parseInt($('#heightInsert').val(),10);
            var className = $('#className').val()
            var numPerStation = (classType != "lab") ? 1 : parseInt($('#perStationInsert').val(),10)
            new_room = new Classroom(width, height, className, classType, [], [], (width*height), numPerStation)
        }
        else
            return false
    }
    else {
            new_room = JSON.parse($('.existingClass').val())
    }
    if (newRoster)
        if (validateRoster())
            new_roster = new Roster(fileName,all_students,total_students)
        else
            return false
    else {
        new_roster = JSON.parse($('.existingRoster').val())
    }

    redirect(new_roster,new_room,classType)
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