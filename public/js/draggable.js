var spanEdit = 'glyphicon glyphicon-edit'
var spanClose = 'glyphicon glyphicon-remove'

var ctrlPressed = false;
var dragOn = false;
var selectedCells = [];
var selectedCellsDisplacement = [];
var selectedCellsBefore = [];
var offset = {
  left: 0,
  top: 0
};
var deltaX = 0;
var mainCellId = "";
var dragging = false;
var dragOff = true;

$(window).keydown(function (evt){
  if (evt.which == 17) { // ctrl
    ctrlPressed = true;
  }
}).keyup(function(evt) {
  if (evt.which == 17) { // ctrl
    ctrlPressed = false;
  }
});


function mouseDown(id){
	if (dragOff) return;
	var $cell = $('#'+id);
	if (!ctrlPressed){
		$('.seat_item').not($cell).css("border-color", "");
		selectedCells = [];
		selectedCellsDisplacement = [];
		selectedCellsBefore = [];
		selectedCells.push(id);
    	//selectedCellsDisplacement.push(0);
	}
	$(this).css("border-color", "#9C27B0");
}

function mouseUp(id){
	if (dragOff) return;
	var $cell = $('#'+id);
	if (ctrlPressed) {
		$cell.css("border-color", "#9C27B0");
		//var id = $(this).attr('id');
		var index = selectedCells.indexOf(id);

		if (index > -1 && !dragging) {
			$cell.css("border-color", "")
			selectedCells.splice(index, 1);
			selectedCellsDisplacement.splice(index, 1);
			selectedCellsBefore.splice(index, 1);
		}
		if (index < 0 && !dragging) {
			selectedCells.push(id);
			selectedCellsDisplacement.push(0);
			selectedCellsBefore.push(0);
		}

	} else {
		selectedCells = [];
		selectedCellsDisplacement = [];
		selectedCells.push(id);
		selectedCellsDisplacement.push(0);
		selectedCellsBefore.push(0);
		$('.seat_item').not($cell).css("border-color", "");
	}
	console.log('id: ' + id);
	console.log(selectedCells);
}

function resetDisplacement() {
  for (var i = 0; i < selectedCellsDisplacement.length; i++) {
    selectedCellsDisplacement[i] = 0;
    selectedCellsBefore[i] = 0;
  }
}

function dragCells(deltaX) {
  $(selectedCells).each(function(index, cell) {
  	if (cell == mainCellId) return;
    var cellId = '#'+cell;
    var displacement = selectedCellsDisplacement[index];
    var before = selectedCellsBefore[index];
    
    //var before = parseFloat($(cellId).css('left').replace('px',''));
    //if ($(cellId).css("left") != "auto") before = parseInt($(cellId).css("left"));
    
    var change = deltaX - displacement;
    var newPos = change + before;
    
    selectedCellsDisplacement[index] = deltaX;
    selectedCellsBefore[index] = newPos;

    console.log(cell);
    console.log('displacement: ' + displacement + ' deltaX: ' + deltaX + ' change: ' +  change + ' before: ' + before + ' newLoc: ' + newPos);
    $(cellId).css("left", newPos);
	$(cellId).css("z-index", 100);
  });
}

function draggable () {
	if ($(this).hasClass(spanEdit)){ 
		$(this).removeClass(spanEdit);
		$(this).addClass(spanClose);
		dragOff = false;
		$('.seat_item').draggable({
			start : function(){
				resetDisplacement();
				dragging = true;
				mainCellId = $(this).attr('id');
				offset = $(this).offset();
				console.log('starting')
				deltaX = $(this).offset().left - offset.left
				if(selectedCells.length > 0) dragCells(deltaX)
				$(this).css("z-index", 100);
			},
			drag : function(){
				deltaX = $(this).offset().left - offset.left;
				if(selectedCells.length > 0) dragCells(deltaX);
			},
			stop : function() {
				if(selectedCells.length > 0) dragCells(deltaX)
				dragging = false;
			}, 
			axis : "x",
			containment: "parent",
			distance : 10,
			disabled: false
    	});
	}
	else {
		selectedCells = [];
		//selectedCellsDisplacement = [];
		$(this).removeClass(spanClose);
		$(this).addClass(spanEdit);
		$('.seat_item').draggable({
			disabled: true
		});
		dragOff = true;
	}
}

function saveCanvas() {
	html2canvas($('.finalCanvas'), {
		onrender: function(canvas) {
			//var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
			var image = canvas.toDataURL();
			var link = document.createElement("a");
			link.download = 'classLayout.png';
			link.href = image;
			link.click();
		}
	});
}