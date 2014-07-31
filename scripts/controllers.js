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
            return $scope.taskRemainingCount = count;
        });
}]).controller("DashboardCtrl", ["$scope", function () { 

}]).controller("oncallCustomerCtrl", ["$scope","$rootScope","$http","$filter","timeDifference", function($scope,$rootScope,$http,$filter,timeDifference) {
        var date = new Date();
        $scope.assignDate = date;
        $scope.assignTime = date;
        $scope.actTime = date;
        $scope.actualTime = date;
        $scope.numberOfHelpers = 0;
        $scope.newCustomer = {};
        $scope.oncallDetails = {}; 
        $scope.oncallCustomer = {};
        $scope.somebinding = $scope.selectedCountries;
        


        $http.post('api/get_customer.php', $scope.newCustomer)
                .success(function(data) {
                
            }); 
        
        $scope.change = function($event) {
            if($event == true){
                console.log('clicked');
                var existing_customer_id =  $('#existing_customer_id').val();
                $scope.oncallCustomer.customer_id = existing_customer_id;
            }else {
                $scope.customer_id = 'not an existing customer';
            };
            
        }

        //angular.element("#customer_id").val()

        $scope.processNewCustomerForm = function(selectedCountries) {
            $rootScope.existing_customer_id = selectedCountries['id'];
            $scope.newCustomer.customer_name = selectedCountries['id'];
            $scope.newCustomer.customer_address = selectedCountries['capital'];
            $scope.newCustomer.customer_phone = selectedCountries['country'];
            $scope.newCustomer.method = 'save_new_customer';
            
            // $http.post('api/customer_controller.php', $scope.newCustomer).success(function(data){
            //     // $scope.countries = data;
            //     console.log(data);
            // });

            $http.post('api/customer_controller.php', $scope.newCustomer)
                .success(function(data) {
                $scope.oncallCustomer.customer_id = data.customer_id;
            });       
        }

        $scope.submitOncall = function() {
            alert('clicked');
            // $scope.oncallDetails.action = 'save_oncall_details';
            // $http.post('api/process.php', $scope.oncallDetails)
            //     .success(function(data) {
            //     console.log(data);
            // });            
        }

        $scope.getBillAmount = function() {
            var working_hours =  $('#working-hours').val();
            var bill_amount = 0;
            var no_of_helper = $('#number_of_helpers').val();
            var helper_charge = no_of_helper * 50;
            if (working_hours == 0) {
                bill_amount = 0;
                $('#bill_amount').val(bill_amount);
            }else if (working_hours == 1 || working_hours < 1) {
                bill_amount = bill_amount + helper_charge + 200;
                $('#bill_amount').val(bill_amount);
            } else if (working_hours >= 2 && working_hours <= 5) {
                bill_amount = bill_amount + 200;
                var remaining_2nd_5th_hours = working_hours - 1;
                var bill_amount_2nd_5th_onward = remaining_2nd_5th_hours * 150;
                bill_amount = bill_amount + bill_amount_2nd_5th_onward + helper_charge;
                $('#bill_amount').val(bill_amount);
            } else if (working_hours >= 6) {
                bill_amount = bill_amount + 200;
                var bill_amount_2nd_5th_onward = 4 * 150;
                var remaining_6th_hours = working_hours - 5;
                var bill_amount_6th_onward = remaining_6th_hours * 100;
                bill_amount = bill_amount + bill_amount_2nd_5th_onward + bill_amount_6th_onward + helper_charge; 
                $('#bill_amount').val(bill_amount);
            }
        };

        $scope.timeDifference = function() {
            var assignTime = $('#actTime').val();
            var actualTime = $('#actualTime').val();

            var start = $filter('date')(assignTime); 
            var end = $filter('date')(actualTime); 
            var s = start.split(':');
            var e = end.split(':');
            var min = e[1]-s[1];
            var hour_carry = 0;
            if(min < 0){
                min += 60;
                hour_carry += 1;
            }
            var hour = e[0]-s[0]-hour_carry;
            min = ((min/60)*100).toString();
            var diff = hour + ":" + min.substring(0,2);
            $('#working-hours').val(hour);
        };
          getCountries(); // Load all countries with capitals
          function getCountries(){  
          $http.get("api/getCustomer.php").success(function(data){
                $scope.countries = data;
               });
          };
        $scope.oncall_services_list = [
            {name:'Electrical' , id:12},
            {name:'Plumbing' , id:22 },
            {name:'Carpentry', id:33},
            {name:'Air Conditioner repair', id:44}
        ];
        $scope.service_charges = [
            {service_name:"1st Hour", price:200,code:"1h"},
            {service_name:"2nd to 5th", price:150, code:"2t5h"},
            {service_name:"6th Onwards", price:100, code:"6h"},

        ]

}]).controller("onCallChargesCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("addOncallChargesForm", ["$scope" , "$http", function($scope, $http) {
     $scope.helper_charge = 50;
       $scope.service = {
            items: [
                {
                service_name: "1st Hour",
                price: 200},
                {
                service_name: "2nd to 5th",
                price: 150
                },
                {
                service_name: "6th Onwards",
                price: 100 
                }  
                
            ]
        };


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
}]).controller("newOtjCustomerCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("otjJobsCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("otjJobsForm", ["$scope", "$http", function($scope, $http) {

    $scope.service = {
        items: [{
            service_name: "Electrical/Plumbing/Carpentry",
            aum_price: 'Rs.100 / hr / technician',
            frequency:"Unlimited"},
            {
            service_name: "Air Conditioner",
            aum_price: 'Rs.1000(Price per unit)',
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

}]).controller("adminSettingsCtrl", ["$scope", "$http", function($scope, $http) {

}]).service("timeDifference", function() {
    return {
        diffTime: function () {
        }     
 
    };
});