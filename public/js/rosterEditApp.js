angular.module('app', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider.when('/rosters/edit/:id', {
			controller: 'MainController'
		})

		// configure html5
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	})
	.controller("MainController", ['$rootScope', '$scope', '$routeParams', '$route', '$http', '$location', function($rootScope, $scope, $routeParams, $route, $http, $location){
		console.log($location.url())
	    var vm = this;
	    vm.students = []
	    vm.searchInput = '';
	    vm.visible = false;
	    vm.newStudent = {};
	    var rosterID = $location.url().slice($location.url().lastIndexOf('/')+1);

	    vm.getStudents = function() {
	    	$http.get("../../api/rosters/"+rosterID)
	    	.then(function success(response){
	    		console.log(response)
	    		vm.students = response.data["students"]
	    	}, function error(err){
	    		console.log(err)
	    	})
	    }

	    vm.addStudent = function() {
	    	vm.students.push(new Student(vm.studentFirstName, vm.studentLastName, vm.studentEmail, 0, vm.studentHand, vm.studentOSD))
	    	vm.students.sort(function sortByName(stud1, stud2) {
				if (stud1.lastname < stud2.lastname) return -1;
				if (stud1.lastname > stud2.lastname) return 1;
				if (stud1.lastname == stud2.lastname) {
					if (stud1.firstname < stud2.firstname) return -1
						else return 1
				}
				return 0;
			})
	    }

	    vm.updateRoster = function() {
	    	$http.get('../../api/rosters/'+rosterID)
	    	.then(function success(response){
	    		var newRoster = response.data
	    		newRoster.students = vm.students
	    		$http.put('api/rosters/'+rosterID, {'roster': newRoster})
	    		.then(function success(response){
	    			console.log(response)
	    		})
	    	})
	    }

	    vm.newManualRoster = function() {
	    	console.log("sample")
	    	var studentRows = vm.manualRoster.split('\n')
	    	var studentArray = []
	    	for (var i = 0; i < studentRows.length; i++) {
	    		var studentInfo = studentRows[i].split('	')
	    		var firstname = studentInfo[0]
	    		var lastname = studentInfo[1]
	    		var email = studentInfo[2]
	    		studentArray.push({
					lastname : lastname.replace(/"/g, ''),
					firstname : firstname.replace(/"/g, ''),
					email : email,
					studentID : 0,
					isLeftHanded : false,
					isOSD : false,
					seat : null
	    		});
	    	}

	    	studentArray.sort(function sortByName(stud1, stud2) {
				if (stud1.lastname < stud2.lastname) return -1;
				if (stud1.lastname > stud2.lastname) return 1;
				if (stud1.lastname == stud2.lastname) {
					if (stud1.firstname < stud2.firstname) return -1
						else return 1
				}
				return 0;
			});

			for(var i = 0; i < studentsArr.length; i++) {
				students[i].studentID = i+1
			}
			vm.students = studentArray;
			vm.updateRoster()
		}

	    vm.getStudents()
	}])