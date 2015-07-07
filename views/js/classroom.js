var classroom = {}

function createClassObject(width, height) {
	$(".seat_item").each(function(index, element){
		var seatId = $(element).attr('id');
		var seat = new Seat(false, false, null, false, seatId);
		classroom[seatId] = seat;
		//console.log(seat);
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

function alignGrid(id,cols,cellWidth,cellHeight,padding) {
    var x = 0;
    var y = 0;
    var count = 1;
    
    $("#" + id).each(function() {
        $(this).css("position", "relative");
        $(this).children("div").each(function(i) {
            var item = $(this),
               idx = i+1;
            item.css("width", cellWidth + "px");
            item.css("height", cellHeight + "px");
            item.css("position", "absolute");
            item.css("left", x + "px");
            item.css("top", y + "px");

            if ((count % cols) == 0) {
                x = 0;
                y += cellHeight + padding;
            } else {
                x += cellWidth + padding;
            }
            
            count++;
        });
    });

    createClassObject(cols);
}

function displayDim(oldW,oldH) {
	console.log(oldH + " " + oldW);
	$('.displayDim').html("<form class=\"form-inline newDim\"></form>");
	$(".newDim").attr({
		"action": "/classroom",
		"method": "get",
		"name": "dimensions"
	});

    var inputH = div_label_input("heightInsert","number","height","Height", oldH);
  	var inputW = div_label_input("widthInsert", "number","width", "Width", oldW);
  	var submit = $("<button>").attr({
  		"id" : "dimensions",
  		"type" : "submit",
  		"class" : "btn btn-default edit_submit",
  		"onclick" : "updateDim()"
  	}).text("Submit");
  	$(".newDim").append(inputH, inputW, submit);
}

function div_label_input(id, type, name, text, old){
	var div = $("<div>").attr({
		"class" : "form-group",
		"id" : "dimensions"
	});
	var label = $("<label>").attr({
		"for" : id
	}).text(text + " ");
	var input = $("<input>").attr({
		"type" : type,
		"class" : "form-control",
		"name" : name,
		"id" : id,
		"value" : old
	});
	return div.append(label,input);

}

function updateDim() {
	var newWidth = $("#width").val();
	var newHeight = $("#height").val();
	console.log(newWidth + " " + newHeight);
}