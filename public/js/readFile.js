/* Given an array of student info create student objects of it 
 * Returns an array of student objects */
function createTable(dataArr) {
	//var table = ""
	var studentsArr = [];
	for (var i = 0; i < dataArr.length; i++) {
		var studentInfo = dataArr[i].split(',');
		if (studentInfo.length == 1) continue;
		console.log("studentInfo: " + studentInfo + " " + studentInfo.length);
		studentsArr.push(createStudent(studentInfo)); 
		//table += "<p>"+studentInfo.join(' ')+"</p>";
	}
	//console.log(studentsArr);
	return studentsArr;
}

/* Read the contents of the file and beging parsing it */
function readUpload() {
	var selectedFile = document.getElementById('myFile').files[0];
	if (selectedFile) {
		var fileName = selectedFile.name + "</strong> (";
		var fileType = selectedFile.type + ") - ";
		var fileSize = selectedFile.size + " bytes, " 
		var fileDate = "last modified: " + selectedFile.lastModifiedDate;
		var fileInfo = "<li><strong>" + fileName + fileType + fileSize + fileDate + "</li>";
		console.log(fileInfo);
//		document.getElementById("fileI").innerHTML += "<div id=\"fileInfo\"><div id=\"fileInfoContainer\"></div></div>"
		document.getElementById("fileInfo").innerHTML = "<ul>" + fileInfo + "</ul>";
		
		var reader = new FileReader();
		reader.onload = function(e) {
			var content = reader.result;
			var data = content.split('\n');
			var table = createTable(data);
			printContent(table);
			//document.getElementById('output').innerHTML = table;
		}
		reader.readAsText(selectedFile);
	}
}

/* Defined student object will have 
	{
		lastname: "string",
		firstname: "string",
		email: "string"
	}
*/
function createStudent(studentInfo) {
	return {
		lastname : studentInfo[0],
		firstname : studentInfo[1],
		email: studentInfo[2]
	};
}

/* Given an array of student objects, it prints it out to the HTML page */
function printContent(roster) {
	info = [];
	for (var i = 0; i < roster.length; i++) {
		var name = "<li><strong>Name: </strong>" + roster[i]["lastname"] + ", " + roster[i]["firstname"] + "</li>";
		var email = "<li><strong>Email: </strong>" + roster[i]["email"] + "</li>";
		info.push("<li><ul>" + name + email + "</ul></li>");
	}
	document.getElementById('output').innerHTML = "<ol>" + info.join('') + "</ol>";
}

window.onload = function () {
	document.getElementById('myFile').addEventListener('change',readUpload,false);
}
