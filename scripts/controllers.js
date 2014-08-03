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

        $scope.processNewCustomerForm = function(selectedCustomer) {
            $rootScope.existing_customer_id = selectedCustomer['customer_id'];
            $scope.newCustomer.customer_name = selectedCustomer['customer_name'];
            $scope.newCustomer.customer_address = selectedCustomer['customer_address'];
            $scope.newCustomer.customer_phone = selectedCustomer['customer_phone'];
            $scope.newCustomer.method = 'save_new_customer';
            
            // $http.post('api/customer_controller.php', $scope.newCustomer).success(function(data){
            //     // $scope.countries = data;
            //     console.log(data);
            // });

            $http.post('api/customer_controller.php', $scope.newCustomer)
                .success(function(data) {
                    if (data.status == true) {
                            toastr.success("Customer Added successfully");
                            toastr.options = {
                              "closeButton": false,
                              "debug": false,
                              "positionClass": "toast-top-right",
                              "onclick": null,
                              "showDuration": "800",
                              "hideDuration": "1000",
                              "timeOut": "5000",
                              "extendedTimeOut": "1000",
                              "showEasing": "swing",
                              "hideEasing": "linear",
                              "showMethod": "fadeIn",
                              "hideMethod": "fadeOut"
                            }
                        $scope.oncallCustomer.customer_id = data.customer_id;
 
                    };
            });       
        }

        $scope.submitOncall = function() {
            var post_data = {};
            post_data.customer_id = angular.element('#customer_id').val();
            post_data.service_type = angular.element('#serviceName').val();
            post_data.employee_list = angular.element('#employee_list').val();
            post_data.act_date = angular.element('#actDate').val();
            post_data.act_time = angular.element('#actTime').val();
            post_data.completion_date = angular.element('#actualDate').val();
            post_data.completion_time = angular.element('#actualTime').val();
            post_data.number_of_helpers = angular.element('#number_of_helpers').val();
            post_data.working_hours = angular.element('#working-hours').val();
            post_data.bill_amount = angular.element('#bill_amount').val();
            post_data.bill_number = angular.element('#bill-number').val();
            post_data.short_desc = angular.element('#shortDesc').val();
            // $scope.oncallDetails.action = 'save_oncall_details';
            $http.post('api/oncall_controller.php', post_data)
                .success(function(data) {
                //console.log(data);
            });            
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
          $http.get("api/customerlist.php").success(function(data){
                $scope.customers = data;
               });
          };
        $scope.oncall_services_list = [
            {name:'Electrical' , id:12},
            {name:'Plumbing' , id:22 },
            {name:'Carpentry', id:33},
            {name:'Air Conditioner repair', id:44}
        ];

        $scope.service_employee_list = [
            {name:'dev das', id:'E1'},
            {name:'deep das', id:'E2'},
            {name:'rohit sharma', id:'E3'},
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


}]).controller("employeeCtrl", ["$scope","$route", "$http", function($scope ,$route ,$http) {

    $http.post("api/employee_controller.php",{method:'get_employee_list'} ).success(function(data){
        $scope.employee_list = data;
        console.log($scope.employee_list)
    });

   $scope.createEmployee = function(newEmployee) {
        newEmployee.method = 'save_new_employee';
        $http.post('api/employee_controller.php', newEmployee)
            .success(function(data) {
                if (data.status == true) {
                        toastr.success("Employee Added successfully");
                        toastr.options = {
                          "closeButton": false,
                          "debug": false,
                          "positionClass": "toast-top-right",
                          "onclick": null,
                          "showDuration": "800",
                          "hideDuration": "1000",
                          "timeOut": "5000",
                          "extendedTimeOut": "1000",
                          "showEasing": "swing",
                          "hideEasing": "linear",
                          "showMethod": "fadeIn",
                          "hideMethod": "fadeOut"
                        }
                    $scope.employee_id = data.employee_id;
                    $scope.ajax_success = true;
                };
                
        });
 
    };

	$scope.uploadFile = function(files) {
	    var fd = new FormData();
	    //Take the first selected file
	    fd.append("file", files[0]);
        fd.append("employee_id", $scope.employee_id);
        fd.append("method","upload_employee_image");
	    $http.post("/api/employee_controller.php", fd, {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }).success(function(data) {
               if (data.status == true) {
                        toastr.success("Image Uploaded successfully");
                        toastr.options = {
                          "closeButton": false,
                          "debug": false,
                          "positionClass": "toast-top-right",
                          "onclick": null,
                          "showDuration": "800",
                          "hideDuration": "1000",
                          "timeOut": "5000",
                          "extendedTimeOut": "1000",
                          "showEasing": "swing",
                          "hideEasing": "linear",
                          "showMethod": "fadeIn",
                          "hideMethod": "fadeOut"
                        }
                    $scope.oncallCustomer.customer_id = data.customer_id;
                    $scope.ajax_success_upload = true;

                };
        }).error();

        $scope.addNewEmployee = function() {
            $route.reload();
        }

	};        
}]).controller("EmployeeEditCtrl", ["$scope","$routeParams","$route", "$http", function($scope ,$routeParams, $route ,$http) {
    var data = {};
    data.method =  'get_employee_by_id';
    data.employee_id = $routeParams.id;
    $http.post("api/employee_controller.php", data).success(function(data){
        $scope.employee_email = data.employee_email;
        $scope.employee_desc = data.employee_desc;
        $scope.employee_mobile = data.employee_mobile;
        $scope.employee_name = data.employee_name;
        $scope.employee_id = data.employee_id;
        $scope.employee = data;
    });   


}]).controller("EmployeeStatusCtrl", ["$scope", "$http", function($scope, $http) {

       $http.post("api/employee_controller.php",{method:'get_employee_list'} ).success(function(data){
        $scope.employee_list = data;
    });

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