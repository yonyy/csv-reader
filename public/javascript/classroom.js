var classroom = {}

// k: seat[letter][number] v: Seat Obj
/*  Function that loops through each div containing the class .seat_item
    and generates a seat based of the divs' id and default parameters
*/
function createClassObject() {
	$(".seat_item").each(function(index, element){
		var seatId = $(element).attr('id');
		var seat = new Seat(false, false, null, false, seatId);
		classroom[seatId] = seat;
		console.log(seat);
	})
}

/* Reads the input of the form in view index.jade and determines if the inputs
    are valid
        1. The dimensions can contain the students.
        2. A file in uploaded
        3. A width and height are inputed 
    If there is an invalid input, a proper error will display
*/
function validateForm(form) {
	var width = parseInt($('#widthInsert').val(),10);
	var height = parseInt($('#heightInsert').val(),10);
    console.log($('#className').val() + " " + $('#heightInsert').val() +  " " + $('#widthInsert').val());
    console.log(total_students);
    var fileVal = $('#fileInsert').val();
    $('.error').remove();
    if ($('#heightInsert').val() == '' || height <= 0) {
        $('.innerformContainer').prepend("<p class=\'error\' id=\'errorHeight\', style=\'color:red\'> Invalid height </p>")
        $('form div:nth-child(2)').addClass('has-error')
        return false;        
    } else {;
        $('form div:nth-child(2)').removeClass('has-error')
    }
    if ($('#widthInsert').val() == '' || width <= 0) {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<p class=\'error\' id=\'errorWidth\', style=\'color:red\'> Invalid width </p>")
        $('form div:nth-child(3)').addClass('has-error')
        return false;

    } else {
        $('form div:nth-child(3)').removeClass('has-error')
    }
    if (height*width <= total_students) {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<p class=\'error\' id=\'errorArea\', style=\'color:red\'> Not a big enough classroom </p>")
        $('form div:nth-child(3)').addClass('has-error')
        $('form div:nth-child(2)').addClass('has-error')
        return false;        
    } else {
        $('form div:nth-child(2)').removeClass('has-error')
        $('form div:nth-child(3)').removeClass('has-error')
    }

    if (fileVal == '') {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<p class=\'error\' id=\'errorFile\', style=\'color:red\'> No file input </p>")
        return false;
    }
}