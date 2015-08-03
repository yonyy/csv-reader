/* loops through the array of students that was generated previously and
 * construct a new map, k: student email V: object containing information to construct email
 * It then uses a JQuery plugin to send the array through a POST request and to
 * redirect the view to '/email'
 * Used because JSON.stringify() causes an error since it has circular structure
 */
function emailRoster(className) {
	studentsInfo = [];
	for(var i = 0; i < students.length; i++) {
		if (students[i].studentID != "") {
			studentsInfo.push({
				firstname : students[i].firstname,
				lastname : students[i].lastname,
				email : students[i].email,
				studentID : students[i].studentID,
				seatPos : students[i].seat.seatPosition
			});
		}
	}
	console.log(className);
	// A simple HTTP POST and GET Redirection Plugin for jQuery
	$.redirect('/email',{roster : JSON.stringify(studentsInfo), className : className}, 'POST');


/*	$.post('/email',{roster : JSON.stringify(studentsInfo)}});*/
/*	$.ajax({
		url: '/email',
		type: 'POST',
		contentType: 'application/json',
		data : JSON.stringify({
			roster : studentsInfo
		})
	}).done(function(){
		$.ajax({
			url: '/email',
			type: 'GET'
		});
	});*/
}

/* A function to automatically load email form with the information passed 
 * Generates the list of recievers, sample subject text, sample body text
 */
function fillEmailForm(studentstoEmail) {
	var toList = "";
	$('#inputSubject').val("Quiz Seating Assignment");
	for(var i = 0; i < studentstoEmail.length; i++) {
		toList += studentstoEmail[i].email + ",";
	}
	$('#inputReciever').val(toList);
	 var sampleAddressText = "Dear [fullname], \n\n"
	 var sampleBodyText = "Here is your assigned seat for the ________.\nWe will have seating charts available in the front of the classroom.\n\n" 
	 var sampleInfoText = "Quiz - ________ at ________ in ________"  + "\n";
	 var sampleSeatText = "Seat: [seat] \n"
	 var sampleIdText = "Exam Serial Number: [id] \n\n";
	 var sampleEndText = "Please be sure to put your Exam Serial Number on your exam. \nNote: Exam Serial Number may change in future exams\n";
	 var sampleByeText = "\nSee you in class,\n________"
	 var sampleMessageText = sampleAddressText + sampleBodyText + sampleInfoText + sampleSeatText + sampleIdText + sampleEndText + sampleByeText;
	 $('#inputMessage').val(sampleMessageText);

}

/* Reads the input from email form a makes sure the appropriate text fields are filled */
function validateEmailForm(form) {
	$('.alert').remove();
	if ($('#inputEmail').val() == ""){
		$('form div:nth-child(1) div:nth-child(1)').addClass('has-error');
		$('.errorMessage').append("<div class=\'alert alert-danger\' id=\'errorNamePass\'> <strong>Error!</strong> Please provide an email/password </div>")
		return false;
	} else {
		$('form div:nth-child(1) div:nth-child(1)').removeClass('has-error');
	}
	if ($('#inputPassword').val() == "") {
		$('form div:nth-child(2) div:nth-child(2)').addClass('has-error');
		$('.errorMessage').append("<div class=\'alert alert-danger\' id=\'errorNamePass\'> <strong>Error!</strong> Please provide an email/password </div>")
		return false;
	} else {
		$('form div:nth-child(2) div:nth-child(2)').removeClass('has-error');
	}
}