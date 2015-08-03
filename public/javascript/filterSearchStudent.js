/*var roster = JSON.parse(sessionStorage.getItem('all_students')); // Array of students*/
var rosterMap = {}	// A map that will be used in students.js in order to quickly lookup students and assign them as left handed or OSD
var roster = []

function setRoster(students) {
	roster = students
	/* Creates a temporary map of the roster, K: student email, V: student object 
 	* This will be used when assigning the students as left handed or OSD. */
	for(var i = 0; i < roster.length; i++) {
	  rosterMap[roster[i].email] = i;
	}
	searchList()
}

function filterStudents() {
	var text = $('.search').val().toLowerCase()
	var td = 6
	var contains = false
	console.log(text)
	/* Look through each table data and check if any table data contains the text */
	$('tbody tr td').each(function(index, element){
		if (index % td == 0) /* Want to look through each row, since each row contains 6 td, reset bool */
			contains = false;
		if (index % td < td) {	/* If any table data in a row contains the text, do not make that row hidden */
			if (!contains) {
				if ($(element).text().toLowerCase().indexOf(text) == -1) {
					$(element).parent().addClass('hidden')
				}
				else {	/* ONLY mark a row as hidden if none of it's columns contains the text */
					$(element).parent().removeClass('hidden')
					contains = true;
				}
			}
		}
	});
}

/*This function implements jQuery autocomplete in the searchbox. */
function searchList() {                
    //array of list items
    var listArray = [];
  
     $(".lastname").each(function() {
     	var listText = $(this).text().trim();
     	listArray.push(listText);
    });

	$(".firstname").each(function() {
		var listText = $(this).text().trim();
		listArray.push(listText);
    });

	$(".email").each(function() {
		var listText = $(this).text().trim();
		listArray.push(listText);
    });
    
    var uniqueNames = [];
    $.each(listArray, function(i, el){
    	if($.inArray(el, uniqueNames) === -1)
    		uniqueNames.push(el);
    });

    $('.search').autocomplete({
        source: uniqueNames
    });
	
	console.log(listArray)    
}