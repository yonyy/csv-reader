/*
Goal: List the rosters, be able to select a roster and edit it. By editing the
    user is able to add a new student, remove student, edit student, or completely
    paste a new roster. Save the changes.
    In addition, add a new roster.
*/


angular.module('app', []);

angular.module('app').controller("MainController", ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
    var vm = this;
    vm.rosters = []
    vm.searchInput = '';
    vm.newStudent = {};
    vm.newRoster = {};

    vm.getRosters = function() {
        $http.get('api/rosters')
        .then(function success(response){
            vm.rosters = response.data
        },function error(err){
            console.log(err)
        });
    }

    vm.editRoster = function(rosterID) {
        console.log(rosterID)
        $window.location.href = '/rosters/edit/'+rosterID
    }

    vm.deleteRoster = function(rosterID) {
        $http.delete('api/rosters/'+rosterID)
        .then(function success(response){
            vm.getRosters()
        }, function error(err){
            console.log(err)
        })
    }

    vm.addRoster = function() {
        $http.post('api/rosters', {roster : vm.newRoster})
        .then(function success(response){
            vm.rosters.push(response.data)
        }, function error(err){
            console.log(err)
        });
    }

    vm.addStudentToRoster = function(rosterID) {
        $http.get('api/rosters/'+rosterID)
        .then(function success(response){
            var oldRoster = response.data
            oldRoster.students = newStudents
            $http.put('api/rosters'+rosterID, oldRoster)
            .then(function success(response){
                vm.rosters[rosterIndex] = response.data
            },function error(err){
                console.log(err)
            })
        }, function error(err){
            console.log(err)
        })
        vm.new = {};
    };

    vm.getRosters()
}]);