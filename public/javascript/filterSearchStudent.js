var roster = JSON.parse(sessionStorage.getItem('all_students'));
var rosterMap = {}

for(var i = 0; i < roster.length; i++) {
  rosterMap[roster[i].email] = i;
}

angular.module('sortApp', [])

angular.module('sortApp').controller('mainController', function($scope){
  $scope.sortType     = 'lastname'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.searchStudent   = '';     // set the default search/filter term
  
  // create the list of sushi rolls 
  $scope.roster = roster
});

