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
	.controller("MainController", ['$rootScope', '$scope', '$routeParams', '$route', '$http', '$location', '$window', function($rootScope, $scope, $routeParams, $route, $http, $location, $window){
		console.log($location.url())
	    var vm = this;
	    vm.title = '';
	    vm.students = []
	    vm.searchInput = '';
	    vm.addStud = false;

	    vm.columns = [
	    	{val: "Last Name"},
	    	{val: "First Name"},
	    	{val: "Email"},
	    	{val: "Exam ID"},
	    	{val: ""},
	    	{val: ""}
	    ];

	    vm.delimeters = [
	    	{name: "Tab", value: '	'},
	    	{name: "Comma", value: ','},
	    	{name: "Space", value: ' '}
	    ]

	    vm.added = [] // used when pasting a new roster
	    vm.removed = [] // used when pasting a new roster

	    $scope.deli = vm.delimeters[0].value;

	    $scope.studentHand = false;
	    $scope.studentOSD = false;

	    $scope.update = false;
	    $scope.errorUpdate = false;

	    vm.newStudent = {};

	    var rosterID = $location.url().slice($location.url().lastIndexOf('/')+1);

	    $scope.changeDataCells = function($index) {
	    	vm.columns[$index] = $scope.newDataColumn;
	    }

	    vm.getStudents = function() {
	    	$http.get("../../api/rosters/"+rosterID)
	    	.then(function success(response){
	    		console.log(response)
	    		vm.students = response.data["students"]
	    		vm.title = response.data["rosterName"]
	    	}, function error(err){
	    		console.log(err)
	    	})
	    }

	    $scope.deleteStudent = function($index) {
	    	vm.students.splice($index,1);
	    	$scope.updateID();
	    }

	    $scope.addStudent = function() {
	    	console.log("new student")
	    	console.log($scope.studentFirstName)
	    	vm.students.push(new Student($scope.studentLastName, $scope.studentFirstName, $scope.studentEmail, 0, false, false, null));
	    	vm.students = vm.sortStudents(vm.students);

			$scope.updateID();
			$scope.studentEmail = ''
			$scope.studentFirstName = ''
			$scope.studentLastName = ''
		    $scope.studentHand = false;
	    	$scope.studentOSD = false;
	    }

	    $scope.updateID = function() {
	    	console.log("updating")
	    	for (var i = 0; i < vm.students.length; i++) {
				vm.students[i].studentID = i+1;
			};
	    }

	    $scope.updateRoster = function() {
	    	$http.put('../../api/rosters/'+rosterID, {students : vm.students, title : vm.title})
	    	.then(function success(response){
	    		$scope.updated = true;
	    		$scope.errorUpdate = false;

	    	}, function error(err){
	    		$scope.updated = false;
	    		$scope.errorUpdate = true;
	    	});
	    }

	    $scope.newManualRoster = function() {
	    	if (!$scope.manualRoster.length) return
	    	var lastnameIndex = -1;
	    	var firstnameIndex = -1;
	    	var emailIndex = -1;
	    	var examIndex = -1;
	    	var fullnameIndex = -1;

	    	var studentRows = $scope.manualRoster.split('\n')
	    	var studentArray = [];

	    	console.log(vm.columns)
	    	for (var i = 0; i < vm.columns.length; i++) {
	    		var columnData = vm.columns[i].val.toLowerCase()
	    		if (columnData == "student" || columnData == "full name")
	    			fullnameIndex = i;
	    		else if (columnData == "last name" && fullnameIndex < 0)
	    			lastnameIndex = i;
	    		else if (columnData == "first name" && fullnameIndex < 0)
	    			firstnameIndex = i;
	    		else if (columnData == "email")
	    			emailIndex = i;
	    		else if (columnData == "exam id")
	    			examIndex = i;
	    	};

	    	for (var i = 0; i < studentRows.length; i++) {
	    		var studentInfo = studentRows[i].split($scope.deli)
	    		var fullnameInfo = []
	    		
	    		if (fullnameIndex >= 0)
	    			fullnameInfo = studentInfo[0].split(" ")
	    		
	    		var firstname = (firstnameIndex < 0 ) ? fullnameInfo[0] : studentInfo[firstnameIndex]
	    		var lastname = (lastnameIndex < 0 ) ? fullnameInfo[1] : studentInfo[lastnameIndex]
	    		var email = studentInfo[emailIndex]
	    		var exam = (examIndex >= 0) ? studentInfo[examIndex] : 0;

	    		studentArray.push(new Student(lastname, firstname, email, exam, false, false, null));
	    	}

	    	studentArray = vm.sortStudents(studentArray);
	    	var differences = vm.students.filter(function(value){return studentArray.indexOf(value) < 0;});
	    	differences = differences.concat(studentArray.filter(function(value){
	    		return vm.students.indexOf(value) < 0
	    	})).filter(function(value, index){
	    		return differences.indexOf(value) == index;
	    	});

	    	for (var i = 0; i < differences.length; i++) {
	    		if (vm.students.indexOf(differences[i]) < 0)
	    			vm.added.push(differences[i]);
	    		else
	    			vm.removed.push(differences[i]);
	    	}

	    	console.log(vm.added)
	    	console.log(vm.removed)
	    	if (examIndex == -1) {
				for(var i = 0; i < studentArray.length; i++) {
					studentArray[i].studentID = i+1
				}
			}


			vm.students = studentArray;
			$scope.manualRoster = ''
			//$scope.updateRoster()
		}

		vm.sortStudents = function(arr) {
			arr.sort(function sortByName(stud1, stud2) {
				if (stud1.lastname < stud2.lastname) return -1;
				if (stud1.lastname > stud2.lastname) return 1;
				if (stud1.lastname == stud2.lastname) {
					if (stud1.firstname < stud2.firstname) return -1
						else return 1
				}
				return 0;
			});

			return arr;
		}

		$scope.backToRoster = function() {
			$window.location.href = '/rosters'
		}

	    vm.getStudents()
	}])