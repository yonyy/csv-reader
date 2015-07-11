/* Given an array of student info create student objects of it 
 * Returns an array of student objects */
var all_students = [];
var total_students = 0;

function createClass(dataArr) {
	var studentsArr = [];
	for (var i = 0; i < dataArr.length; i++) {
		var studentInfo = dataArr[i].split(',');
		if (studentInfo.length == 1) continue;
		console.log("studentInfo: " + studentInfo + " " + studentInfo.length);
		studentsArr.push(new Student(studentInfo[0],studentInfo[1],studentInfo[2],false,false,null)); 
	}
	total_students = all_students.length;
	return studentsArr;
}

/* Read the contents of the file and beging parsing it */
function readUpload() {
	var selectedFile = document.getElementById('fileInsert').files[0];
	if (selectedFile) {
		var fileName = selectedFile.name + "</strong> (";
		var fileType = selectedFile.type + ") - ";
		var fileSize = selectedFile.size + " bytes, " 
		var fileDate = "last modified: " + selectedFile.lastModifiedDate;
		var fileInfo = "<li><strong>" + fileName + fileType + fileSize + fileDate + "</li>";
		document.getElementById("fileInfo").innerHTML = "<ul>" + fileInfo + "</ul>";
		
		var reader = new FileReader();
		reader.onload = function(e) {
			var content = reader.result;
			var data = content.split('\n');
			all_students = createClass(data);
/*			printContent(all_students);*/
		}
		reader.readAsText(selectedFile);
	}
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
	document.getElementById('fileInsert').addEventListener('change',readUpload,false);
}