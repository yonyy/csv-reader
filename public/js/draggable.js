var spanEdit = 'glyphicon glyphicon-edit'
var spanClose = 'glyphicon glyphicon-remove'
function draggable () {
	if ($(this).hasClass(spanEdit)){ 
		$(this).removeClass(spanEdit);
		$(this).addClass(spanClose);
		
		$('.seat_item').draggable({
			start: function(event, ui) { $(this).css("z-index", 100); },
			containent: 'parent',
			axis: 'x',
			distance: 10
		});
	}
	else { 
		$(this).removeClass(spanClose);
		$(this).addClass(spanEdit);
		$('.seat_item').draggable({
			disabled: true
		})
	}
}

function saveCanvas() {
	html2canvas($('.finalCanvas'), {
		onrendered: function(canvas) {
			//var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
			var image = canvas.toDataURL();
			var link = document.createElement("a");
			link.download = 'classLayout.png';
			link.href = image;
			link.click();
		}
	})
}