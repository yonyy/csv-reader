var classroom = {}

function createClassObject(width, height) {
	$(".seat_item").each(function(index, element){
		var seatId = $(element).attr('id');
		var seat = new Seat(false, false, null, false, seatId);
		classroom[seatId] = seat;
		//console.log(seat);
	})
}

function readForm(form) {
	/*var width = parseInt(form.width.value,10);
	var height = parseInt(form.height.value,10);*/
	var width = form.width.value;
	var height = form.height.value;
	return false;
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
	$('.displayDim').html("<form class=\"newDim\"></form>");
	$(".newDim").attr({
		"action": "/classroom",
		"method": "get",
		"name": "dimensions"
	});

/*    var inputH = $("<input>").attr({
    	"type" : "number",
    	"id" : "height",
    	"name" : "height",
    	"value" : oldH
    });
    var inputW = $("<input>").attr({
    	"type" : "number",
    	"id" : "width",
    	"name" : "width",
    	"value" : oldW
    });
    var button = $("<input>").attr({
    	"type" : "submit",
    	"value" : "Submit",
    	"onclick" : "updateDim"
    });
    $(".newDim").append("Height ",inputH," Width ",inputW," ",button);*/
    var inputH = div_label_input("heightInsert","number","height","Height", oldH);
  	var inputW = div_label_input("widthInsert", "number","width", "Width", oldW);
  	var submit = $("<button>").attr({
  		"id" : "dimensions",
  		"type" : "submit",
  		"class" : "btn btn-default",
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