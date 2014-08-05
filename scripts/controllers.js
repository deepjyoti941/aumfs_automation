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

}]).controller("oncallCustomerCtrl", ["$scope","$timeout","$rootScope","$http","$filter","timeDifference", function($scope,$timeout,$rootScope,$http,$filter,timeDifference) {
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


        // $http.post('api/get_customer.php', $scope.newCustomer)
        //         .success(function(data) {
                
        //     }); 
        
        $scope.change = function($event) {
            if($event == true){
                console.log('clicked');
                var existing_customer_id =  $('#existing_customer_id').val();
                $scope.oncallCustomer.customer_id = existing_customer_id;
            }else {
                $scope.customer_id = 'not an existing customer';
            };
            
        }

        $http.get('api/getOncallCustomerList.php').success(function(data){
          console.log(data);
            $scope.list = data;
            $scope.currentPage = 1; //current page
            $scope.entryLimit = 5; //max no of items to display in a page
            $scope.filteredItems = $scope.list.length; //Initially for no filter  
            $scope.totalItems = $scope.list.length;
        });
        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.filter = function() {
            $timeout(function() { 
                $scope.filteredItems = $scope.filtered.length;
            }, 10);
        };
        $scope.sort_by = function(predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
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
            post_data.assign_employee_id = angular.element('#employee_list').val();
            // post_data.act_date = angular.element('#actDate').val();
            // post_data.act_time = angular.element('#actTime').val();
            // post_data.completion_date = angular.element('#actualDate').val();
            // post_data.completion_time = angular.element('#actualTime').val();
            // post_data.number_of_helpers = angular.element('#number_of_helpers').val();
            // post_data.working_hours = angular.element('#working-hours').val();
            // post_data.bill_amount = angular.element('#bill_amount').val();
            // post_data.bill_number = angular.element('#bill-number').val();
            //post_data.short_desc = angular.element('#shortDesc').val();
            post_data.method = 'save_oncall_details';
            $http.post('api/oncall_controller.php', post_data)
                .success(function(data) {
                    if (data.status == true) {
                        toastr.success("Order Created successfully");
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
 
                    };
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

          getCustomerList();
          getServiceList();
          getEmployeeList();
          function getCustomerList(){  
            $http.get("api/customerlist.php").success(function(data){
                $scope.customers = data;
            });
          };

          function getServiceList() {
            $http.post('api/oncall_controller.php', {method:'get_service_list'})
                .success(function(data) {
                    $scope.oncall_services_list = data;
                
            });    
          }

          function getEmployeeList() {
            $http.post('api/employee_controller.php', {method:'get_free_employee_list'})
                .success(function(data) {
                    $scope.service_employee_list = data;
                
            }); 
          }

        // $scope.oncall_services_list = [
        //     {name:'Electrical' , id:12},
        //     {name:'Plumbing' , id:22 },
        //     {name:'Carpentry', id:33},
        //     {name:'Air Conditioner repair', id:44}
        // ];

        // $scope.service_employee_list = [
        //     {name:'dev das', id:'E1'},
        //     {name:'deep das', id:'E2'},
        //     {name:'rohit sharma', id:'E3'},
        // ];

        $scope.service_charges = [
            {service_name:"1st Hour", price:200,code:"1h"},
            {service_name:"2nd to 5th", price:150, code:"2t5h"},
            {service_name:"6th Onwards", price:100, code:"6h"},

        ]

}]).controller("editOncallCustomerCtrl", ["$scope","$timeout","$routeParams","$rootScope","$http","$filter","timeDifference", function($scope,$routeParams,$timeout,$rootScope,$http,$filter,timeDifference) {
        var post_oncall_data = {};
        var url = document.URL
        var id = url.substring(url.lastIndexOf('/') + 1);
        post_oncall_data.oncall_service_id = id;
        post_oncall_data.method = 'get_service_by_id';
        $http.post('api/oncall_controller.php', post_oncall_data)
                .success(function(data) {
                  console.log(data);
                  $scope.customer_name = data[0].customer_name;
                  $scope.customer_address = data[0].customer_address;
                  $scope.customer_phone = data[0].customer_phone;
                  $scope.customer_id = data[0].customer_id;
                  $scope.service_name = data[0].service_name;
                  $scope.assigned_employee = data[0].employee_name;
                  $scope.assignDate = new Date(data[0].order_date_time);
                  $scope.orderTime = data[0].order_date_time_all;
        });

        var date = new Date();
        $scope.assignDate = date;
        $scope.assignTime = date;
        $scope.actTime = date;
        $scope.actualTime = date;
        $scope.numberOfHelpers = 0;
        $scope.newCustomer = {};
        $scope.oncallDetails = {}; 
        $scope.oncallCustomer = {};

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

    $scope.deleteEmployee = function(employee_id) {
        console.log(employee_id);
        var r = confirm("Are You Sure! It can't be Undo");
        if (r == true) {
            $http.post("api/employee_controller.php",{method:'delete_employee',employee_id:employee_id} ).success(function(data){
                console.log(data);
                angular.element('#employee_'+employee_id).remove();
                toastr.success("Employee Deleted successfully");
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
            });
        } else {}

    }    

}]).controller("EmployeeEditCtrl", ["$scope","$routeParams","$route", "$http", function($scope ,$routeParams, $route ,$http) {
    var data = {};
    data.method =  'get_employee_by_id';
    data.employee_id = $routeParams.id;
    $http.post("api/employee_controller.php", data).success(function(data) {
        $scope.employee_email = data.employee_email;
        $scope.employee_desc = data.employee_desc;
        $scope.employee_mobile = data.employee_mobile;
        $scope.employee_name = data.employee_name;
        $scope.employee_id = data.employee_id;
        $scope.employee = data;
    });   

    $scope.UpdateEmployee = function() {
        var updated_data = {};
        updated_data.method = 'update_employee';
        updated_data.employee_email = $scope.employee_email; 
        updated_data.employee_desc = $scope.employee_desc;
        updated_data.employee_mobile = $scope.employee_mobile;
        updated_data.employee_name = $scope.employee_name;
        updated_data.employee_id = $scope.employee_id;
        $http.post("api/employee_controller.php", updated_data).success(function(data) {
           if (data.status == true) {
                    toastr.success("Employee Updated successfully");
                    toastr.options = {
                      "closeButton": false,
                      "debug": false,
                      "positionClass": "toast-top-right",
                      "onclick": null,
                      "showDuration": "900",
                      "hideDuration": "1000",
                      "timeOut": "5000",
                      "extendedTimeOut": "1000",
                      "showEasing": "swing",
                      "hideEasing": "linear",
                      "showMethod": "fadeIn",
                      "hideMethod": "fadeOut"
                    }

            };
            
        });        
    }


    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);
        fd.append("employee_id", $routeParams.id);
        fd.append("method","update_employee_image");
        $http.post("/api/employee_controller.php", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data) {
               if (data.status == true) {
                        toastr.success("Image Updated successfully");
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
                $scope.employee.employee_photo = data.emoloyee_image;

                };
        }).error();

    };  

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

}]).filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
}).service("timeDifference", function() {
    return {
        diffTime: function () {
        }     
 
    };
});



// var numbers = "0123456789";

// var chars= "acdefhiklmnoqrstuvwxyz";

// var string_length = 3;
// var randomstring = '';
// var randomstring2 = '';

// for (var x=0;x<string_length;x++) {

//     var letterOrNumber = Math.floor(Math.random() * 2);

//         var rnum = Math.floor(Math.random() * chars.length);
//         randomstring += chars.substring(rnum,rnum+1);


// } for (var y=0;y<string_length;y++) {

//     var letterOrNumber2 = Math.floor(Math.random() * 2);

//         var rnum2 = Math.floor(Math.random() * numbers.length);
//         randomstring2 += numbers.substring(rnum2,rnum2+1);


// }

// function shuffle(o){
//     for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//     return o;
// };

// var code=shuffle((randomstring+randomstring2).split('')).join('');