var all_students = [];	// array to contain student objects
var total_students = 0;	// number of students
var fileName = ""	// file name

// Constructor for Roster object. Resembles the Roster model in DB
function Roster (rosterName, students, totalStudents) {
	this.rosterName = rosterName
	this.students = students
	this.totalStudents = totalStudents
}

/* Given an array of student info create student objects of it 
 * Returns an array of student objects */
function createStudents(dataArr) {
	var studentsArr = [];
	for (var i = 0; i < dataArr.length; i++) {
		var studentInfo = dataArr[i].split(',');
		if (studentInfo.length == 1) continue;
		//console.log("studentInfo: " + studentInfo);
		studentsArr.push(new Student(studentInfo[0],studentInfo[1],studentInfo[2],studentInfo[3],false,false,null)); 
	}
	total_students = all_students.length;
	return studentsArr;
}

/* Read the contents of the file and beging parsing it */
function readRoster() {
	var selectedFile = document.getElementById('fileInsert').files[0];
	if (selectedFile) {
		fileName = selectedFile.name
		var reader = new FileReader();
		reader.onload = function(e) {
			var content = reader.result;
			var data = content.split('\n');
			if (!verifyFormat(data)) return;
			all_students = createStudents(data);
/*			printContent(all_students);*/
		}
		reader.readAsText(selectedFile);
	}
}

/* Verifies that the roster has the proper format */
function verifyFormat(data) {
	$('.alert').remove()
	var isNum = true
	var isString = true
	var studentData = []
	var size = 4

	for (var i = 0; i < data.length; i++) {
		studentData = data[i].split(',')
		if (studentData.length == 1) continue
		if (studentData.length != size) {
			isNum = false
			break;
		}

		if (!isNaN(studentData[0]) || typeof studentData[0] !== 'string') {
			isString = false
			break
		}
		
		if (!isNaN(studentData[1]) || typeof studentData[1] !== 'string') {
			isString = false
			break
		}
		
		if (!isNaN(studentData[2]) || typeof studentData[2] !== 'string') {
			isString = false
			break
		}
		
		if (isNaN(studentData[3])) {
			isNum = false
			break
		}
	}

	if (!isNum || !isString) {
		$('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorFile\'> <strong>Error!</strong> The uploaded .csv file does follow the required format. Please click the link above and review the required format for the csv file. </div>")
		$('#fileInsert').val("")
		$('.existingRoster').attr('disabled', false)
		$(window).scrollTop(0)
	}

	return (isNum && isString)
}

// Runs if user did not select an old roster. Checks that the file value
// isnt empty
function validateRoster() {
	 // validating file input
	var fileVal = $('#fileInsert').val();
	$('.alert').remove()
    if (fileVal == '') {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorFile\'> <strong>Error!</strong> No file input </div>")
        $(window).scrollTop(0)
        return false;
    }

    return true;
}


/* Given an array of student objects, it prints it out to the HTML page */
/*function printContent(roster) {
	info = [];
	for (var i = 0; i < roster.length; i++) {
		var name = "<li><strong>Name: </strong>" + roster[i]["lastname"] + ", " + roster[i]["firstname"] + "</li>";
		var email = "<li><strong>Email: </strong>" + roster[i]["email"] + "</li>";
		info.push("<li><ul>" + name + email + "</ul></li>");
	}
	document.getElementById('output').innerHTML = "<ol id=\"roster\">" + info.join('') + "</ol>";
}*/

window.onload = function () {
	document.getElementById('fileInsert').addEventListener('change',readRoster,false);
}
