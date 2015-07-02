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
}

function displayDim(oldW,oldH) {
	console.log(oldH + " " + oldW);
	$('.displayDim').html("<form class=\"newDim\"></form>");
	$(".newDim").attr({
		"action": "/classroom",
		"method": "get",
		"name": "dimensions"
	});
    var inputH = $("<input>").attr({
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
    $(".newDim").append("Height ",inputH," Width ",inputW," ",button);
}

function updateDim() {
	var newWidth = $("#width").val();
	var newHeight = $("#height").val();
	console.log(newWidth + " " + newHeight);
}