var fullname = "fullname";
var id = "id";
var lastname = "lastname";
var firstname = "firstname";
var seat = "seat";

module.parseText = function(text, student) {
	var parsedText = "";
	var leftBracket = false;
	var rightBracket = false;
	var syntax = ""
	var info = {
		fullname : student.firstname + student.lastname,
		lastname : student.lastname,
		firstname : student.firstname,
		id : student.studentID,
		seat : student.seatPos
	}

	for (var i = 0; i < text.length; i++) {
		if (text[i] == "[") {
			leftBracket = true;
			continue;
		}
		if (text[i] == "]") {
			leftBracket = false;
			parsedText += info[syntax];
			syntax = ""
			continue;
		}
		if (!leftBracket)
			parsedText += text[i]
		else
			syntax += text[i]
	}

	console.log(parsedText);
	return parsedText;
}