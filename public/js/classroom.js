var classroomSize = 0;

// Constructor function for a Classroom. This resembles the classroom used for DB
function Classroom (width, height, className, classType, ghostSeats, leftSeats, totalSeats, numPerStation) {
    this.width = width
    this.height = height
    this.className = className
    this.classType = classType
    this.ghostSeats = ghostSeats
    this.leftSeats = leftSeats
    this.totalSeats = totalSeats
    this.numPerStation = numPerStation
    this.seatOrder = [] // param if room is a lab
}

/* Reads the input of the form in view index.jade and determines if the inputs
    are valid. This only runs if generating a new classroom
        1. The dimensions can contain the students.
        2. A width and height are inputed 
        3. The classroom has a name
    If there is an invalid input, a proper error will display
*/
function validateClassroom(classType) {
	var width = parseInt($('#widthInsert').val(),10);
	var height = parseInt($('#heightInsert').val(),10);
    var className = $('#className').val()
    var perStation = 1
    if (classType == "lab") perStation =  parseInt($("#perStationInsert").val(), 10)
    classroomSize = perStation*(height*width)


    //console.log(perStation)
    //console.log($('#className').val() + " " + $('#heightInsert').val() +  " " + $('#widthInsert').val());
    console.log(total_students);
    console.log(classroomSize)

    // remove previous error/warning messages
    $('.alert').remove();
    
    // Validation classname
    if (className == '') {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorName\'> <strong>Error!</strong> Please provide a classroom name </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(1)').addClass('has-error')
        $(window).scrollTop(0)
        return false;        
    } else {;
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(1)').removeClass('has-error')
    }
    // validating height
    if ($('#heightInsert').val() == '' || height <= 0 || height > 25) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorHeight\'> <strong>Error!</strong> Invalid height. Must be within 1-26 </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').addClass('has-error')
        $(window).scrollTop(0)
        return false;        
    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').removeClass('has-error')
    }

    // validating width
    if ($('#widthInsert').val() == '' || width <= 0 || width > 30) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorWidth\'> <strong>Error!</strong> Invalid width </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').addClass('has-error')
        $(window).scrollTop(0)
        return false;

    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').removeClass('has-error')
    }
    
    // validating classroom size
/*    if (classroomSize < total_students) {
        $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorArea\'> <strong>Error!</strong> Not a big enough classroom </div>")
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').addClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').addClass('has-error')
        $(window).scrollTop(0)
        return false;        
    } else {
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(2)').removeClass('has-error')
        $('.form div:nth-child(1) div:nth-child(1) div:nth-child(3)').removeClass('has-error')
    }*/

    // validating if students per seat is > 0
    if (classType == "lab") {
        if (perStation <= 0) {
            $('.errorMessage').prepend("<div class=\'alert alert-danger\' id=\'errorPerStation\'> <strong>Error!</strong> Please a valid number of students per station </div>")
            $('.form div:nth-child(1) div:nth-child(1) div:nth-child(4)').addClass('has-error')
            $(window).scrollTop(0)
            return false; 
        } else {
            $('.form div:nth-child(1) div:nth-child(1) div:nth-child(4)').removeClass('has-error')
        }
    }
    return true
}