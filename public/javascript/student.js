function Student(lastname, firstname, email, isLH, isOSD, seat)	{
	this.lastname = lastname.replace(/"/g, '')
	this.firstname = firstname.replace(/"/g, '')
	this.email = email
	this.isLeftHanded = isLH
	this.isOSD = isOSD
	this.seat = seat
}

function updateRoster(id) {
	var idArr = id.split(' ');
	var id = idArr[0];
	console.log($('.isLeftHanded').val());
	roster[rosterMap[id]].isLeftHanded = ($('.isLeftHanded').val() == "true") ? true : false;
	roster[rosterMap[id]].isOSD = ($('.isOSD').val() == "true") ? true : false;
	if (roster[rosterMap[id]].isLeftHanded) {
		console.log(roster[rosterMap[id]].firstname + " isLeftHanded");
	}
/*	$('.isLeftHanded').each(function() {
		var id = $(this).attr('id');
		var val = $(this).val();
		console.log(val);
		if (val == "true")
			roster[rosterMap[id]].isOSD = true;
		else
			roster[rosterMap[id]].isOSD = false;
	});
	$('.isOSD').each(function() {
		var id = $(this).attr('id');
		var val = $(this).val();
		console.log(val);
		if (val == "true")
			roster[rosterMap[id]].isOSD = true;
		else
			roster[rosterMap[id]].isOSD = false;
	});*/
/*	sessionStorage.setItem('all_students', JSON.stringify(roster))*/

}