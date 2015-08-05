var newRoster = true;
var newClass = true;

/*$('.submitForm').click(function() {
	//- sessionStorage.setItem('all_students', JSON.stringify(all_students));
	$('#students').val(JSON.stringify(all_students));
	$('#totalStudents').val(total_students)
	console.log(all_students)
	console.log(total_students)
})*/

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
            new_room = new Classroom(width, height, className, [], [], (width*height), numPerStation)
        }
        else {
            return
        }
    }
    else {
        var className = $('.existingClass').val()
        new_room = new Classroom(0,0,className,null,null,0)
    }
    if (newRoster)
        new_roster = new Roster(fileName,all_students,total_students)
    else {
        var oldRosterName = $('.existingRoster').val()
        new_roster = new Roster(oldRosterName,null,0)
    }

    redirect(new_roster,new_room,classType)
}

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