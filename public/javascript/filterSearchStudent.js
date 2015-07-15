var roster = JSON.parse(sessionStorage.getItem('all_students'));	// Array of students
var rosterMap = {}

/* Creates a temporary map of the roster, K: student email, V: student object 
 * This will be used when assigning the students as left handed or OSD. */
for(var i = 0; i < roster.length; i++) {
  rosterMap[roster[i].email] = i;
}


/* Angular module to search for the students, and sort them */
angular.module('sortApp', [])

angular.module('sortApp').controller('mainController', function($scope){
  $scope.sortType     = 'lastname'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchStudent   = '';     // set the default search/filter term
  
  // create the list of students
  $scope.roster = roster
});

