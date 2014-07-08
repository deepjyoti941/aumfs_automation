"use strict";
angular.module("app.controllers", []).controller("AppCtrl", ["$scope", "$location", function ($scope, $location) {
    return $scope.isSpecificPage = function () {
        var path;
        return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/forgot", "/pages/lock-screen"], path)
    }, $scope.main = {
        brand: "AUMFS Automation",
        name: "Admin"
    }
}]).controller("NavCtrl", ["$scope", "taskStorage", "filterFilter", function ($scope, taskStorage, filterFilter) {
        var tasks;
        return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
            completed: !1
        }).length, $scope.$on("taskRemaining:changed", function (event, count) {
            return $scope.taskRemainingCount = count
        })
}]).controller("DashboardCtrl", ["$scope", function () { }]).controller("newCustomerCtrl", ["$scope", function($scope) {
        $scope.today = new Date();

}]).controller("employeeCtrl", ["$scope", "$http", function($scope, $http) {

	$scope.uploadFile = function(files) {
	    var fd = new FormData();
	    //Take the first selected file
	    fd.append("file", files[0]);

	    $http.post("/api/employee/upload-image", fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }).success().error();

	};        
}]).controller("onCallJobsCtrl",["$scope", "$http", function($scope, $http) {

}]).controller("addOncallJobsForm", ["$scope", "$http", function($scope, $http) {
    $scope.service = {
        items: [{
            service_name: "Electrical/Plumbing/Carpentry",
            aum_price: 'Rs.100 / hr / technician',
            qty: 9,
            frequency:"Unlimited"},
            {
            service_name: "Air Conditioner",
            aum_price: 'Rs.1000(Price per unit)',
            qty: 1,
            frequency:"Half Yearly"
        }]
    };

    $scope.addItem = function() {
        $scope.service.items.push({
            service_name: '',
            aum_price: '',
            qty: 0,
            frequency:''
        });
    },
    $scope.removeItem = function(index) {
        $scope.service.items.splice(index, 1);
    }

}]);