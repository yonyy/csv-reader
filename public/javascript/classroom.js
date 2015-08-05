function Classroom (width, height, className, ghostSeats, leftSeats, totalSeats) {
    this.width = width
    this.height = height
    this.className = className
    this.ghostSeats = ghostSeats
    this.leftSeats = leftSeats
    this.totalSeats = totalSeats
}

/* Reads the input of the form in view index.jade and determines if the inputs
    are valid
        1. The dimensions can contain the students.
        2. A file in uploaded
        3. A width and height are inputed 
    If there is an invalid input, a proper error will display
*/
function validateClassroom(classType) {
	var width = parseInt($('#widthInsert').val(),10);
	var height = parseInt($('#heightInsert').val(),10);
    var className = $('#className').val()

    var perStation = 1
    if (classType == "lab")
        perStation =  parseInt($("#perStationInsert").val(), 10)
    console.log(perStation)
    console.log($('#className').val() + " " + $('#heightInsert').val() +  " " + $('#widthInsert').val());
    console.log(total_students);
    var fileVal = $('#fileInsert').val();
    $('.alert').remove();
    if (className == '') {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorName\'> <strong>Error!</strong> Please provide a classroom name </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(1)').addClass('has-error')
        return false;        
    } else {;
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(1)').removeClass('has-error')
    }
    if ($('#heightInsert').val() == '' || height <= 0 || height > 25) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorHeight\'> <strong>Error!</strong> Invalid height. Must be within 1-26 </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').addClass('has-error')
        return false;        
    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').removeClass('has-error')
    }
    if ($('#widthInsert').val() == '' || width <= 0 || width > 27) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorWidth\'> <strong>Error!</strong> Invalid width </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').addClass('has-error')
        return false;

    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').removeClass('has-error')
    }
    
    if (perStation*(height*width) < total_students) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorArea\'> <strong>Error!</strong> Not a big enough classroom </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').addClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').addClass('has-error')
        return false;        
    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').removeClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').removeClass('has-error')
    }

    if (fileVal == '') {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorFile\'> <strong>Error!</strong> No file input </div>")
        return false;
    }

    /* Create classroom if it passes all of the checks */
    var classroom = new Classroom(width, height, className, [], [], (width*height))
    $('.classModel').val(JSON.stringify(classroom))
}