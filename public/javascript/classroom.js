var classroom = {}

// k: seat[letter][number] v: Seat Obj
function createClassObject() {
	$(".seat_item").each(function(index, element){
		var seatId = $(element).attr('id');
		var seat = new Seat(false, false, null, false, seatId);
		classroom[seatId] = seat;
		console.log(seat);
	})
}

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