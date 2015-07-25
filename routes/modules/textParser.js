var fullname = "fullname";
var id = "id";
var lastname = "lastname";
var firstname = "firstname";
var seat = "seat";

exports.parseText = function(text, student) {
	var parsedText = "";
	var leftBracket = false;
	var rightBracket = false;
	var syntax = ""
	var firstname = ""
	var firstNameArr = student.firstname.split(' ');
	for (var i = 0; i < firstNameArr.length; i++) {
		firstname += firstNameArr[i] + " "
	};
	var info = {
		fullname : firstname + student.lastname,
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

	return parsedText;
}