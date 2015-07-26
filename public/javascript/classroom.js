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
    $('.alert').remove();
    if($('#className').val() == '') {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorName\'> Please provide a classroom name </div>")
        $('form div:nth-child(1)').addClass('has-error')
        return false;        
    } else {;
        $('form div:nth-child(1)').removeClass('has-error')
    }        
    }
    if ($('#heightInsert').val() == '' || height <= 0) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorHeight\'> Invalid height </div>")
        $('form div:nth-child(2)').addClass('has-error')
        return false;        
    } else {;
        $('form div:nth-child(2)').removeClass('has-error')
    }
    if ($('#widthInsert').val() == '' || width <= 0) {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<div class=\'alert alert-danger\' id=\'errorWidth\'> Invalid width </div>")
        $('form div:nth-child(3)').addClass('has-error')
        return false;

    } else {
        $('form div:nth-child(3)').removeClass('has-error')
    }
    if (height*width <= total_students) {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<div class=\'alert alert-danger\' id=\'errorArea\'> Not a big enough classroom </div>")
        $('form div:nth-child(3)').addClass('has-error')
        $('form div:nth-child(2)').addClass('has-error')
        return false;        
    } else {
        $('form div:nth-child(2)').removeClass('has-error')
        $('form div:nth-child(3)').removeClass('has-error')
    }

    if (fileVal == '') {
        $('.innerformContainer').remove('.error');
        $('.innerformContainer').prepend("<div class=\'alert alert-danger\' id=\'errorFile\'> No file input </div>")
        return false;
    }
}