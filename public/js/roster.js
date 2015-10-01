var all_students = [];	// array to contain student objects
var total_students = 0;	// number of students
var fileName = ""	// file name
var COL_OFFSET = 4 // beginning row of the roster from Triton Link
var firstnameIndex = 3
var lastnameIndex = 2
var emailIndex = 8

// Constructor for Roster object. Resembles the Roster model in DB
function Roster (rosterName, students, totalStudents) {
	this.rosterName = rosterName
	this.students = students
	this.totalStudents = totalStudents
}

/* Given an array of student info from a CSV file create student objects of it 
 * Returns an array of student objects */
function createStudents(dataArr) {
	var studentsArr = [];
	for (var i = COL_OFFSET; i < dataArr.length; i++) {
		var studentInfo = dataArr[i].split(",");
		if (studentInfo.length == 1) continue;
		console.log(studentInfo);
		var firstname = studentInfo[firstnameIndex]
		var lastname = studentInfo[lastnameIndex]
		var email = studentInfo[emailIndex]
		var examID = (i-3).toString()
		studentsArr.push(new Student(lastname, firstname, email, examID, false,false,null)); 
	}
	total_students = studentsArr.length;
	return studentsArr;
}

function createStudentsXLSX(workbook) {
	var sheetName = workbook.SheetNames[0] // get first and only sheet
	var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
	return createStudents(csv.split('\n'))
}

function readManualRoster() {
	var fullnameIndex = -1
	fileName = $('#filename').val()
	$('.index').each(function(index){
		var str = $(this).val().toLowerCase()
		if (str == "student") {
			fullnameIndex = index
			lastnameIndex = 0
			firstnameIndex = 1
		}
		if (fullnameIndex == -1 && str == "first name") firstnameIndex = index
		if (fullnameIndex == -1 && str == "last name") lastnameIndex = index
		if (str == "email") emailIndex = index
	});

	rawRoster = $('#rosterTextInput').val().split("\n")
	var studentsArr = [];
	
	console.log("fullnameIndex: " + fullnameIndex + " lastnameIndex: " + lastnameIndex + " firstnameIndex: " + firstnameIndex + " emailIndex: " + emailIndex)
	for (var i = 0; i < rawRoster.length; i++) {
		var firstname = ""
		var lastname = ""
		var studentInfo = rawRoster[i].split("	")
		if (studentInfo.length <= 1) continue;
		if(fullnameIndex != -1) {
			var nameInfo = studentInfo[fullnameIndex].split(",")
			firstname = nameInfo[firstnameIndex]
			lastname = nameInfo[lastnameIndex]
		}
		else {
			firstname = studentInfo[firstnameIndex]
			lastname = studentInfo[lastnameIndex]
		}

		var email = studentInfo[emailIndex]
		var examID = (i+1).toString()
		studentsArr.push(new Student(lastname, firstname, email, examID, false,false,null)); 
	}
	total_students = studentsArr.length
	all_students = studentsArr
}

/* Read the contents of the file and beging parsing it */
function readRoster() {
	var selectedFile = document.getElementById('fileInsert').files[0];
	if (selectedFile) {
		fileName = selectedFile.name
		var extension = getExtension(fileName)
		if (extension != 'xls') {
			if (extension != 'xlsx') {
				throwAlert()
				return;
			}
		}
		var reader = new FileReader();
		reader.onload = function(e) {
			var content = reader.result;
/*			if (extension == 'csv'){
				var data = content.split('\n');
				all_students = createStudents(data)
			}
			else {*/
			var workbook = XLSX.read(content, {type: 'binary'});
			all_students = createStudentsXLSX(workbook)
		}
		reader.readAsBinaryString(selectedFile)
		//reader.readAsText(selectedFile);
	}
}

function getExtension(file) {
	return file.split('.').pop()
}

/* Verifies that the roster has the proper format */
function verifyFormat(data) {
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
		throwAlert()
	}

	return (isNum && isString)
}

function throwAlert () {
	$('.alert').remove()
	$('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorFile\'> <strong>Error!</strong> The uploaded file does follow the required format. Please click the link above and review the required format for the .xls, and .xlsx file. </div>")
	$('#fileInsert').val("")
	$('.existingRoster').attr('disabled', false)
	$(window).scrollTop(0)
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


window.onload = function () {
	document.getElementById('fileInsert').addEventListener('change',readRoster,false);
}
