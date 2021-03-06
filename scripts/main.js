"use strict";
/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
    .value('uiTinymceConfig', {})
    .directive('uiTinymce', ['uiTinymceConfig', function(uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ngModel) {
            var expression, options, tinyInstance;
            // generate an ID if not present
            if (!attrs.id) {
                attrs.$set('id', 'uiTinymce' + generatedIds++);
            }
            options = {
                // Update model when calling setContent (such as from the source editor popup)
                setup: function(ed) {
                    ed.on('init', function(args) {
                        ngModel.$render();
                    });
                    // Update model on button click
                    ed.on('ExecCommand', function(e) {
                        ed.save();
                        ngModel.$setViewValue(elm.val());
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });
                    // Update model on keypress
                    ed.on('KeyUp', function(e) {
                        //console.log(ed.isDirty());
                        ed.save();
                        ngModel.$setViewValue(elm.val());
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });
                },
                mode: 'exact',
                elements: attrs.id
            };
            if (attrs.uiTinymce) {
                expression = scope.$eval(attrs.uiTinymce);
            } else {
                expression = {};
            }
            angular.extend(options, uiTinymceConfig, expression);
            setTimeout(function() {
                tinymce.init(options);
            });


            ngModel.$render = function() {
                if (!tinyInstance) {
                    tinyInstance = tinymce.get(attrs.id);
                }
                if (tinyInstance) {
                    tinyInstance.setContent(ngModel.$viewValue || '');
                }
            };
        }
    };
}]); 



angular.module("app.controllers", ['ngCookies','ui.tinymce']).controller("AppCtrl", ["$scope", "$location", function ($scope, $location) {
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
}]).controller("loginCtrl", ["$scope","loginService", function ($scope,loginService) { 
    $scope.msgtxt='';
    $scope.login=function(data){
      data.method = "login";
    loginService.login(data,$scope); //call login service
  };

}]).controller("logoutCtrl", ["$scope","$http","$cookieStore","loginService", function ($scope,$http,$cookieStore,loginService) { 

    $scope.lock_screen = function() {
        var url = document.URL;
        var current_url = url.split('#');
        $cookieStore.put('current_url', current_url[1]);
        
    }
    $http.post('api/admin_controller.php', {method:'get_admin_details'})
          .success(function(data) {
             $scope.admin_details = data;       
      });  
    $scope.logout=function(){
      loginService.logout();
    }
}]).controller("lockScreenCtrl", ["$scope","$http","loginService","$cookieStore","$location", function ($scope,$http, loginService,$cookieStore,$location) { 
    //console.log($cookieStore.get('current_url'));
    var admin_password;
    $scope.unlock_screen = function() {
        var user_password = angular.element('#lockPassword').val();
        if (!user_password) {
            toastr.error("You must enter password to unlock");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
        } else if(user_password != admin_password) {
            toastr.error("Incorrect Password");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
        }else {
          var connected=loginService.islogged();
          connected.then(function(msg){
            if(!msg.data){
                $location.path('/pages/signin');
            }else {
                $location.path($cookieStore.get('current_url'));
            }
          });
        }

    }
    
    $http.post('api/admin_controller.php', {method:'get_admin_details'})
          .success(function(data) {
               $scope.admin_details = data;
               admin_password = data.password;        
      });  
}]).controller("forgotPasswordCtrl", ["$scope","$http", function ($scope,$http) { 

  $scope.secret_code = function(data) {
    data.method = "forgotpassword";
      $http.post('api/user.php', data)
      .success(function(data) {
          if (data.status == true) {
            alert('Email: ' +data.results.email+ ' & Password: '+data.results.password);
          }else{
            alert('Invalid code!!');
          }
  }); 
  }

}]).controller("navCtrl", ["$scope","$http", function ($scope,$http) { 
      var employee_count = {};
      employee_count.method = "get_employee_count";
      $http.post('api/employee_controller.php', employee_count)
      .success(function(data) {
          $scope.employee_count = parseInt(data);          
        });

}]).controller("DashboardCtrl", ["$scope","$http", function ($scope,$http) { 
      var customer_count = {};
      customer_count.method = "get_customer_count";
      $http.post('api/dashboard_controller.php', customer_count)
      .success(function(data) {
          $scope.count_list = data; 
          $scope.growth = parseInt(data.total_income /data.customer_count);         
        });

        $http.get('api/getOncallNotifications.php').success(function(data){

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            $scope.current_date = today;
          // console.log(data);
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

}]).controller("otjAdminNotificationsCtrl", ["$scope","$http", function ($scope,$http) { 

        $http.get('api/getOtjNotifications.php').success(function(data){

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            $scope.current_date = today;
          // console.log(data);
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

}]).controller("otjEmployeeNotificationsCtrl", ["$scope","$http", function ($scope,$http) { 

        $scope.changeColor = true;
        $http.get('api/getEmployeeOtjNotifications.php').success(function(data){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            $scope.current_date = today;
          // console.log(data);
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

}]).controller("aumAdminNotificationsCtrl", ["$scope","$http", function ($scope,$http) { 

        $scope.changeColor = true;
        $http.get('api/getAdminAumNotifications.php').success(function(data){
          // console.log(data);
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



}]).controller("aumEmployeeNotificationsCtrl", ["$scope","$http", function ($scope,$http) { 

        $scope.changeColor = true;
        $scope.changeAumStatus = function(aum_id) {
          var post_data = {};
          post_data.aum_order_id = aum_id;
          post_data.method = 'update_aum_employee_notification';
          $http.post('api/aum_controller.php', post_data)
              .success(function(data) {      
              
          }); 
        }
        $http.get('api/getEmployeeAumNotifications.php').success(function(data){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            $scope.current_date = today;
          // console.log(data);
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

}]).controller("getAmcAdminNotifications", ["$scope","$http", function ($scope,$http) { 

        $scope.changeColor = true;
        $scope.addCurrentDate = function(amc_id,bill_date) {
          var post_data = {};
          // console.log(bill_date);
          post_data.amc_order_id = amc_id;
          post_data.next_date = bill_date;
          post_data.method = 'update_amc_bill_date';
          $http.post('api/amc_controller.php', post_data)
              .success(function(data) {
                  
              
          }); 
        }
        $http.get('api/getAmcAdminNotifications.php').success(function(data){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            $scope.current_date = today;
          // console.log(data);
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

}]).controller("oncallCustomerCtrl", ["$scope","$timeout","$rootScope","$http","$filter","timeDifference", function($scope,$timeout,$rootScope,$http,$filter,timeDifference) {
        // var x = new Date('3/16/2013 17:00:00');// x is now a date object
       // x.setHours(0,0,0,0); set  hours to 0, min Secs and milliSecs as well
       // Logger.log(x);
        $scope.rate = 0;
        var date = new Date();
        $scope.assignDate = date;
        $scope.assignTime = date;
        var dt = new Date();
        dt.setHours(0,0,0,0);
        $scope.actTime = dt;
        var at = new Date();
        at.setHours(0,0,0,0);
        $scope.actualTime = at;
        $scope.numberOfHelpers = 0;
        $scope.newCustomer = {};
        $scope.oncallDetails = {}; 
        $scope.oncallCustomer = {};
        $scope.somebinding = $scope.selectedCountries;


        // $http.post('api/get_customer.php', $scope.newCustomer)
        //         .success(function(data) {
                
        //     }); 
        $scope.actDateChanged = function(actDate) {
            var d = new Date(actDate);
            var dd = d.getDate();
            var mm = d.getMonth()+1; //January is 0!
            var yyyy = d.getFullYear();

            if(dd<10) {
                dd='0'+dd
            } 

            if(mm<10) {
                mm='0'+mm
            } 
            var action_date = yyyy+'-'+mm+'-'+dd;
            var post_data = {};
            post_data.method = 'get_avilable_employee_by_date';
            post_data.action_date = action_date;
            $http.post('api/employee_controller.php', post_data)
                .success(function(data) {
                    $scope.service_employee_list = data;
                    
            }); 
        }

        $scope.change = function($event) {
            if($event == true){
                // console.log('clicked');
                var existing_customer_id =  $('#existing_customer_id').val();
                $scope.oncallCustomer.customer_id = existing_customer_id;
            }else {
                $scope.customer_id = 'not an existing customer';
            };
            
        }

        $scope.changeBlacklist = function($event) {
            if($event == true && $('#existing_customer_id').val() != ''){
                var existing_customer_id =  $('#existing_customer_id').val();
                var post_data = {};
                post_data.existing_customer_id = existing_customer_id;
                post_data.method = 'backlist_customer';
                $http.post('api/customer_controller.php', post_data)
                              .success(function(data) {
                                  if (data.status == true) {
                                      toastr.success("Customer Backlisted successfully");
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
            }else {
                    toastr.error("Idiot!! You must find customer first to backlist");
                    toastr.options = {
                      "closeButton": false,
                      "debug": false,
                      "positionClass": "toast-bottom-left",
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
        }

        $http.get('api/getOncallCustomerList.php').success(function(data){
          // console.log(data);
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
          if (angular.element('#customer_id').val() == '') {
            toastr.error("Idiot!! You must insert customer first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
          }else{
            var post_data = {};
            post_data.customer_id = angular.element('#customer_id').val();
            post_data.service_type = angular.element('#serviceName').val();
            post_data.assign_employee_id = angular.element('#employee_list').val();
            post_data.order_date = angular.element('#order_date').val();
            post_data.act_date = angular.element('#actDate').val();
            post_data.act_time = angular.element('#actTime').val();
            post_data.completion_date = angular.element('#actualDate').val();
            post_data.completion_time = angular.element('#actualTime').val();
            post_data.number_of_helpers = angular.element('#number_of_helpers').val();
            post_data.working_hours = angular.element('#working-hours').val();
            post_data.bill_amount = angular.element('#bill_amount').val();
            post_data.bill_number = angular.element('#bill-number').val();
            post_data.short_desc = angular.element('#shortDesc').val();
            post_data.customer_feedback = angular.element('#customer_feedback').val();
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
           
        }

        $scope.getBillAmount = function() {
            var working_hours =  $('#working-hours').val();
            var bill_amount = 0;
            var helper_hourly_charge = 0
            var no_of_helper = $('#number_of_helpers').val();
            // if (no_of_helper > 0) {
            //   helper_hourly_charge = working_hours * 50;
            // }else {
            //   helper_hourly_charge = 0;
            // };
            var helper_charge = (no_of_helper * 50) * working_hours;
            if (working_hours == 0) {
                bill_amount = 0;
                $('#bill_amount').val(bill_amount);
            }else if (working_hours == 1 || working_hours < 1) {
                bill_amount = bill_amount + helper_charge + 200 ;
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
            if (min >= 20) { 
              hour = hour + 1;
              $('#working-hours').val(hour);
            }else{
              $('#working-hours').val(hour);
            };
            min = ((min/60)*100).toString();
            var diff = hour + ":" + min.substring(0,2);
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

}]).controller("editOncallCustomerCtrl", ["$scope","$timeout", "$routeParams","$rootScope","$http","$filter","timeDifference", function($scope,$routeParams,$timeout,$rootScope,$http,$filter,timeDifference) {
        //$scope.rate = 5;
        var post_oncall_data = {};
        var url = document.URL
        var id = url.substring(url.lastIndexOf('/') + 1);
        post_oncall_data.oncall_service_id = id;
        post_oncall_data.method = 'get_service_by_id';
        $http.post('api/oncall_controller.php', post_oncall_data)
                .success(function(data) {
                  // console.log(data);
                  $scope.oncall_customer_list = data;
                  $scope.ext_employee_id = data.assigned_employee_id;
                  $scope.customer_name = data.customer_name;
                  $scope.customer_address = data.customer_address;
                  $scope.customer_phone = data.customer_phone;
                  $scope.customer_id = data.customer_id;
                  $scope.service_name = data.service_name;
                  $scope.assigned_employee = data.employee_name;
                  $scope.assignDate = new Date(data.order_date_time);
                  $scope.orderTime = data.order_date_time_all;
                  $scope.numberOfHelpers = data.helper_number;
                  $scope.workingHour = data.working_hour;
                  $scope.billAmount = data.billing_price;
                  $scope.billNumber = data.bill_number;
                  $scope.rate = data.customer_feedback;
                  $scope.short_description = data.description;
                  //$scope.actDate = data.act_date;
                  //$scope.actualDate = data.completion_date;
                  //$scope.actionTime = data.act_time;
                  //$scope.completionTime = data.completion_time;

                  if (data.act_date == "0000-00-00") {
                    $scope.actDate = '';
                  }else {
                    $scope.actDate = data.act_date;
                  };

                  if (data.completion_date == "0000-00-00") {
                    $scope.actualDate = '';
                  }else{
                    $scope.actualDate = data.completion_date;
                  };

                  if (data.act_time == "12:00 AM") {
                    $scope.actionTime = '';
                  }else{
                    $scope.actionTime = data.act_time;
                  };

                  if (data.completion_time == "12:00 AM") {
                    $scope.completionTime = '';
                  }else{
                    $scope.completionTime = data.completion_time;
                  };
        });

        $scope.updateOrder = function() {
            var url = document.URL
            var id = url.substring(url.lastIndexOf('/') + 1);
            var post_data = {};
            post_data.oncall_service_id = id;
            post_data.customer_id = angular.element('#customer_id').val();
            post_data.assigned_employee_id = angular.element('#employee_id_assigned').val();
            post_data.act_date = angular.element('#actDate').val();
            post_data.act_time = angular.element('#actTime').val();
            post_data.completion_date = angular.element('#actualDate').val();
            post_data.completion_time = angular.element('#actualTime').val();
            post_data.number_of_helpers = angular.element('#number_of_helpers').val();
            post_data.working_hours = angular.element('#working-hours').val();
            post_data.bill_amount = angular.element('#bill_amount').val();
            post_data.bill_number = angular.element('#bill-number').val();
            post_data.short_desc = angular.element('#shortDesc').val();
            post_data.customer_feedback = angular.element('#customer_feedback').val();
            post_data.method = 'update_oncall_details'; 
            $http.post('api/oncall_controller.php', post_data)
                .success(function(data) {
                    if (data.status == true) {
                        toastr.success("Order Updated successfully");
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

        $scope.cancelOncallOrder = function() {
            var url = document.URL
            var id = url.substring(url.lastIndexOf('/') + 1);
            var post_data = {};
            post_data.oncall_service_id = id;
            post_data.method = 'cancel_oncall_order'; 
             $http.post('api/oncall_controller.php', post_data)
                  .success(function(data) {
                      if (data.status == true) {
                          toastr.success("Order Cancelled Successfully");
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

        var date = new Date();
        $scope.assignDate = date;
        $scope.assignTime = date;
        var dt = new Date();
        dt.setHours(0,0,0,0);
        $scope.actTime = dt;
        var at = new Date();
        at.setHours(0,0,0,0);
        $scope.actualTime = at;
        $scope.numberOfHelpers = 0;
        $scope.newCustomer = {};
        $scope.oncallDetails = {}; 
        $scope.oncallCustomer = {};

       $scope.getBillAmount = function() {
            var working_hours =  $('#working-hours').val();
            var bill_amount = 0;
            var helper_hourly_charge = 0
            var no_of_helper = $('#number_of_helpers').val();
            if (no_of_helper > 0) {
              helper_hourly_charge = working_hours * 50;
            }else {
              helper_hourly_charge = 0;
            };

            var helper_charge = no_of_helper * 50;
            if (working_hours == 0) {
                bill_amount = 0;
                $('#bill_amount').val(bill_amount);
            }else if (working_hours == 1 || working_hours < 1) {
                bill_amount = bill_amount + helper_charge + 200 + helper_hourly_charge;
                $('#bill_amount').val(bill_amount);
            } else if (working_hours >= 2 && working_hours <= 5) {
                bill_amount = bill_amount + 200;
                var remaining_2nd_5th_hours = working_hours - 1;
                var bill_amount_2nd_5th_onward = remaining_2nd_5th_hours * 150;
                bill_amount = bill_amount + bill_amount_2nd_5th_onward + helper_charge + helper_hourly_charge;
                $('#bill_amount').val(bill_amount);
            } else if (working_hours >= 6) {
                bill_amount = bill_amount + 200;
                var bill_amount_2nd_5th_onward = 4 * 150;
                var remaining_6th_hours = working_hours - 5;
                var bill_amount_6th_onward = remaining_6th_hours * 100;
                bill_amount = bill_amount + bill_amount_2nd_5th_onward + bill_amount_6th_onward + helper_charge + helper_hourly_charge; 
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
            if (min >= 20) { 
              hour = hour + 1;
              $('#working-hours').val(hour);
            }else{
              $('#working-hours').val(hour);
            };
            min = ((min/60)*100).toString();
            var diff = hour + ":" + min.substring(0,2);
        }; 

}]).controller("onCallChargesCtrl", ["$scope","$http", function($scope, $http) {

}]).controller("oncallRatingCtrl", ["$scope","$http", function($scope, $http) {


      return $scope.max = 10, $scope.isReadonly = !1, $scope.hoveringOver = function (value) {
          return $scope.overStar = value, $scope.percent = 100 * (value / $scope.max)
      }, $scope.ratingStates = [{
          stateOn: "glyphicon-ok-sign",
          stateOff: "glyphicon-ok-circle"
      }, {
          stateOn: "glyphicon-star",
          stateOff: "glyphicon-star-empty"
      }, {
          stateOn: "glyphicon-heart",
          stateOff: "glyphicon-ban-circle"
      }, {
          stateOn: "glyphicon-heart"
      }, {
          stateOff: "glyphicon-off"
      }];

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
        // console.log(employee_id);
        var r = confirm("Are You Sure! It can't be Undo");
        if (r == true) {
            $http.post("api/employee_controller.php",{method:'delete_employee',employee_id:employee_id} ).success(function(data){
                // console.log(data);
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
        // console.log(data);
    });

}]).controller("EmployeeWorkDetailsCtrl", ["$scope","$http", function($scope, $http) {
    var url = document.URL
    var id = url.substring(url.lastIndexOf('/') + 1);
    var post_data = {};
    post_data.method = 'get_employee_services_by_id';
    post_data.employee_id = id
    $http.post("api/employee_controller.php",post_data ).success(function(data){
      $scope.employee_services = data
    });
}]).controller("newOtjCustomerCtrl", ["$scope", "$http", function($scope, $http) {

          $http.get('api/getOtjCustomerList.php').success(function(data){
            // console.log(data);
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
          $scope.enquiry_date = new Date()
          $scope.newCustomer = {};
          $scope.processNewCustomerForm = function(selectedCustomer) {
            $scope.newCustomer.customer_name = selectedCustomer['customer_name'];
            $scope.newCustomer.customer_address = selectedCustomer['customer_address'];
            $scope.newCustomer.customer_phone = selectedCustomer['customer_phone'];
            $scope.newCustomer.method = 'save_new_customer';
          
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

        $scope.oncallCustomer = {};
         $scope.change = function($event) {
            if($event == true){
                // console.log('clicked');
                var existing_customer_id =  $('#existing_customer_id').val();
                $scope.oncallCustomer.customer_id = existing_customer_id;
            }else {
                $scope.customer_id = 'not an existing customer';
            };
            
        }

        $scope.enquiry_type_list = [
          {type:'Assessment'},
          {type:'Quotation'},
          {type:'FollowUp'}
        ],

        $scope.follow_up_type_list = [
          {type:'Delay'},
          {type:'Cancel'},
          {type:'Confirm'}
        ];

        $scope.createOtjOrder = function() {
          if (angular.element('#customer_id').val() == '') {
            toastr.error("Idiot!! You must insert customer first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
          }else {
              var post_data = {};
              post_data.method = 'save_otj_customer';
              post_data.customer_id = angular.element('#customer_id').val();
              post_data.enquiry_type = angular.element('#enquiry_type').val();
              post_data.follow_up_type = angular.element('#follow_up_type').val();
              post_data.enquiry_date = angular.element('#enquiry_date').val();
              post_data.start_date = angular.element('#start_date').val();
              post_data.end_date = angular.element('#end_date').val();
              post_data.service_name = angular.element('#serviceName').val();
              post_data.price = angular.element('#aumPrice').val();
              post_data.assigned_employee_id = angular.element('#employee_list').val();
              post_data.short_description = angular.element('#short_description').val();
              post_data.customer_feedback = angular.element('#customer_feedback').val();
              // console.log(post_data);
                $http.post('api/otj_controller.php', post_data)
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

        }
          getCustomerList();
          getServiceList();
          getEmployeeList();
          function getCustomerList(){  
            $http.get("api/customerlist.php").success(function(data){
                $scope.customers = data;
            });
          };

           function getServiceList() {
            $http.post('api/otj_controller.php', {method:'get_service_list'})
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

}]).controller("editOtjCustomerCtrl", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) {
          getServiceList();
          getEmployeeList();
           function getServiceList() {
            $http.post('api/otj_controller.php', {method:'get_service_list'})
                .success(function(data) {
                    $scope.oncall_services_list = data;
                
            });    
          }

          function getEmployeeList() {
            $http.post('api/employee_controller.php', {method:'get_free_employee_list'})
                .success(function(data) {
                    $scope.service_employee_list = data;
                    var post_data = {};
                    post_data.otj_service_id = $routeParams.id;
                    post_data.method = 'get_otj_details_by_id'; 
                    $http.post('api/otj_controller.php', post_data)
                      .success(function(data) {
                        //$scope.otj_customer_details = data;
                         $scope.otj_customer_list = data;
                         angular.element('#customer_name').val(data.customer_name);
                         angular.element('#customer_address').val(data.customer_address);
                         angular.element('#customer_phone').val(data.customer_phone);
                         angular.element('#customer_id').val(data.customer_id);
                         angular.element('#enquiry_type').val(data.enquiry_type);
                         angular.element('#follow_up_type').val(data.follow_up_type);
                         angular.element('#start_date').val(data.start_date);
                         angular.element('#end_date').val(data.end_date);
                         angular.element('#enquiry_date').val(data.action_date);
                         angular.element('#serviceName').val(data.service_name);
                         angular.element('#otj_price').val(data.aum_price);
                         angular.element('#employee_list').val(data.assigned_employee_id);
                         angular.element('#short_description').val(data.short_desc);
                         $scope.short_description = data.short_desc;
                         $scope.rate = data.customer_feedback;
                    });                 
            }); 
          }  


        $scope.enquiry_date = new Date();
        $scope.enquiry_type_list = [
          {type:'Assessment'},
          {type:'Quotation'},
          {type:'FollowUp'}
        ],

        $scope.follow_up_type_list = [
          {type:'Delay'},
          {type:'Cancel'},
          {type:'Confirm'}
        ];

        $scope.updateOtjOrder = function() {
          if (angular.element('#customer_id').val() == '') {
            toastr.error("Idiot!! You must insert customer first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
          }else {
              var post_data = {};
              post_data.method = 'update_otj_customer';
              post_data.otj_service_id = $routeParams.id;
              post_data.customer_id = angular.element('#customer_id').val();
              post_data.enquiry_type = angular.element('#enquiry_type').val();
              post_data.follow_up_type = angular.element('#follow_up_type').val();
              post_data.action_date = angular.element('#enquiry_date').val();
              post_data.start_date = angular.element('#start_date').val();
              post_data.end_date = angular.element('#end_date').val();
              post_data.service_name = angular.element('#serviceName').val();
              post_data.aum_price = angular.element('#otj_price').val();
              post_data.assigned_employee_id = angular.element('#employee_list').val();
              post_data.short_desc = angular.element('#short_description').val();
              post_data.customer_feedback = angular.element('#customer_feedback').val();

                $http.post('api/otj_controller.php', post_data)
                    .success(function(data) {
                       if (data.status == true) {
                                toastr.success("Order Updated successfully");
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

        } 

}]).controller("otjJobsCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("otjJobsForm", ["$scope", "$http", function($scope, $http) {
    getServiceList()
    function getServiceList() {
        $http.post('api/otj_controller.php', {method:'get_service_list'})
            .success(function(data) {
                $scope.service = data;
            
        }); 
    }

    // $scope.service = [
    //         {
    //         service_name: "Electrical/Plumbing/Carpentry",
    //         frequency:"Unlimited"
    //         },
    //         {
    //         service_name: "Air Conditioner",
    //         frequency:"Half Yearly"
    //         }
    //     ]

     $scope.addService =  function() {
      var service_list = {};
      service_list.method = 'save_otj_service';
      service_list.service_name = $scope.service_name;
      service_list.service_frequency = $scope.service_frequency;
      $scope.service.push(service_list);

      $http.post('api/otj_controller.php', service_list)
        .success(function(data) {
            if (data.status == true) {
                    toastr.success("Service Added successfully");
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
            $scope.service_name = '';
            $scope.service_frequency= '';
            };            
        
      }); 

     }

    $scope.addItem = function() {
        $scope.service.push({
            service_name: '',
            aum_price: '',
            qty: 0,
            frequency:''
        });
    },
    $scope.removeItem = function(idx) {
        var service_to_delete = $scope.service[idx];
        var post_data = {};
        post_data.method = 'delete_service_by_id';
        post_data.service_id = service_to_delete.service_id
        $http.post('api/otj_controller.php', post_data)
        .success(function(data) {
            if (data.status == true) {
                    $scope.service.splice(idx, 1);
                    toastr.success("Service Deleted successfully");
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

    $scope.saveService = function(item) {
        // console.log(item);
    }

}]).controller("otjInvoiceCtrl", ["$scope","$http","$routeParams", "$window" , function($scope, $http, $routeParams) {
      $scope.order_id = $routeParams.id;
      $scope.main_name = 'Aumfs Automation Company';

      var post_data = {};
      post_data.otj_service_id = $routeParams.id;
      post_data.method = 'get_otj_details_by_id'; 
      $http.post('api/otj_controller.php', post_data)
        .success(function(data) {
          $scope.otj_services_list = data;
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
              dd='0'+dd
          } 

          if(mm<10) {
              mm='0'+mm
          } 
          today = dd+'/'+mm+'/'+yyyy;
          $scope.invoice_date = today;
          $scope.package_name = 'OTJ';
          $scope.invoice_number = '#OTJ'+$routeParams.id;

      }); 
        return $scope.printInvoice = function () {
            var originalContents, popupWin, printContents;
            return printContents = document.getElementById("invoice").innerHTML, originalContents = document.body.innerHTML, popupWin = window.open(), popupWin.document.open(), popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"), popupWin.document.close()
        }
        
}]).controller("otjAgreementCtrl", ["$scope","$http","$routeParams", "$window" , function($scope, $http, $routeParams) {
      $scope.order_id = $routeParams.id;
      $scope.main_name = 'Aumfs Automation Company';

      var post_data = {};
      post_data.otj_service_id = $routeParams.id;
      post_data.method = 'get_otj_details_by_id'; 
      $http.post('api/otj_controller.php', post_data)
        .success(function(data) {
          $scope.otj_services_list = data;

      }); 
        return $scope.printInvoice = function () {
            var originalContents, popupWin, printContents;
            return printContents = document.getElementById("order_agreement").innerHTML, originalContents = document.body.innerHTML, popupWin = window.open(), popupWin.document.open(), popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"), popupWin.document.close()
        }
        
}]).controller("adminSettingsCtrl", ["$scope", "$http", function($scope, $http) {
      $http.post('api/admin_controller.php', {method:'get_admin_details'})
          .success(function(data) {
              $scope.admin_details = data;          
      });    
}]).controller("adminUpdateCtrl", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) {
      $http.post('api/admin_controller.php', {method:'get_admin_details_by_id', id:$routeParams.id})
          .success(function(data) {
              $scope.admin = {};
              $scope.admin_details = data;
              $scope.admin.name = data.name;  
              $scope.admin.email = data.email;
              $scope.admin.short_description = data.short_desc;        
      }); 

    $scope.UpdateAdmin = function() {

      if (angular.element('#admin_old_password').val() == '' || angular.element('#admin_new_password').val() == '') {
          toastr.error("Idiot!! You must enter Old password first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
      }else{
        var updated_data = {};
        updated_data.method = 'update_admin_data';
        updated_data.email = angular.element('#admin_email').val(); 
        updated_data.short_desc = angular.element('#admin_short_desc').val(); 
        updated_data.old_password = angular.element('#admin_old_password').val(); 
        updated_data.new_password = angular.element('#admin_new_password').val(); 
        updated_data.admin_id = $routeParams.id;
        updated_data.admin_name = angular.element('#admin_name').val(); ;
        $http.post("api/admin_controller.php", updated_data).success(function(data) {
           if (data.status == true) {
                    toastr.success("Admin Updated successfully");
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
       
    }
      $scope.uploadFile = function(files) {
          var fd = new FormData();
          //Take the first selected file
          fd.append("file", files[0]);
          fd.append("admin_id", $routeParams.id);
          fd.append("method","update_admin_image");
          $http.post("/api/admin_controller.php", fd, {
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
                  $scope.admin_details.admin_image= data.admin_image;

                  };
          }).error();

      };     
}]).controller("aumCustomerCtrl", ["$scope", "$http", function($scope, $http) {

        $http.get('api/getAumCustomerList.php').success(function(data){
          // console.log(data);
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

        $scope.removeService = function($index) {
           $scope.aum_services_list.splice($index, 1);
        }


      $scope.enquiry_date = new Date();
      $scope.subscription_fee = 1000;
      $scope.service_quantity = 0;
      $scope.oncallCustomer = {};
      $scope.newCustomer = {};
      $scope.processNewCustomerForm = function(selectedCustomer) {
        $scope.newCustomer.customer_name = selectedCustomer['customer_name'];
        $scope.newCustomer.customer_address = selectedCustomer['customer_address'];
        $scope.newCustomer.customer_phone = selectedCustomer['customer_phone'];
        $scope.newCustomer.method = 'save_new_customer';
      
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
       $scope.change = function($event) {
          if($event == true){
              // console.log('clicked');
              var existing_customer_id =  $('#existing_customer_id').val();
              $scope.oncallCustomer.customer_id = existing_customer_id;
          }else {
              $scope.customer_id = 'not an existing customer';
          };
          
      }
          getCustomerList();
          getServiceList();
          //getEmployeeList();
          function getCustomerList(){  
            $http.get("api/customerlist.php").success(function(data){
                $scope.customers = data;
            });
          };

          function getServiceList() {
            $http.post('api/aum_controller.php', {method:'get_service_list'})
                .success(function(data) {
                    $scope.aum_services_list = data;
                
            });    
          }


    $scope.calculatePrice = function() {
      if (angular.element('#customer_id').val() == '') {
            toastr.error("Idiot!! You must insert customer first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
      }else {

        var aum_service_array = [];
        var total = [];
        var test = document.getElementById("service_list_data").getElementsByTagName("input");
        for(var i=0;i<test.length;i++) {
            var text_id = test[i].id;
            var service_price = parseInt(angular.element('#'+text_id).closest('td').prev().html());
            var total_price = service_price * test[i].value;
            var aum_service = {};
            aum_service.service_id = test[i].id;
            aum_service.quantity = test[i].value;
            aum_service.qty_total = total_price;
            aum_service_array.push(aum_service);
            total.push(total_price);
        }  
        var aum_price = total.reduce(function(prev, cur) {
          return prev + cur;
        });
        // console.log(aum_service_array);
        if (angular.element('#subscription_fee').val() == '1000/yr') {
         aum_price = aum_price + 1000; 
         }else if(angular.element('#subscription_fee').val() == '1900/yr') {
           aum_price = aum_price + 1900; 
         }else{
          aum_price = 0;
         }
        
        $scope.price_result = aum_price

        var post_data = {};
        post_data.method = 'save_aum_customer_details';
        post_data.customer_id = angular.element('#customer_id').val();
        post_data.enquiry_date = angular.element('#enquiry_date').val();
        post_data.start_date = angular.element('#start_date').val();
        post_data.end_date = angular.element('#end_date').val();
        post_data.subscription_type = angular.element('#subscription_fee').val();
        post_data.customer_feedback = angular.element('#customer_feedback').val();
        post_data.total = aum_price;
        $http.post('api/aum_controller.php', post_data)
          .success(function(data) {
               if (data.status == true) {
                var aum_service_details = {};
                aum_service_details.method = 'save_aum_service_details'
                aum_service_details.aum_order_id = data.aum_order_id;
                aum_service_details.details = aum_service_array
                  $http.post('api/aum_controller.php', aum_service_details)
                    .success(function(data) {
                         if (data.status == true) {
                            toastr.success("Customer Added Successfully");
                              toastr.options = {
                                "closeButton": false,
                                "debug": false,
                                "positionClass": "toast-bottom-left",
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

                };              
          
        }); 
       
      }
    }



}]).controller("editAumCustomerCtrl", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) {

    $scope.removeService = function($index) {
       $scope.aum_services_list.splice($index, 1);
    }
    var post_data = {};
    post_data.aum_order_id = $routeParams.id;
    post_data.method = 'get_aum_details_by_id'; 
    $http.post('api/aum_controller.php', post_data)
      .success(function(data) {
        $scope.aum_services_list = data;
         // console.log(data); 
          angular.element('#customer_name').val(data[0]['customer_name']);
          angular.element('#customer_address').val(data[0]['customer_address']);  
          angular.element('#customer_phone').val(data[0]['customer_phone']);  
          angular.element('#enquiry_date').val(data[0]['order_date']);
          angular.element('#customer_id').val(data[0]['customer_id']);
          angular.element('#subscription_fee').val(data[0]['subscription_type']);
          angular.element('#start_date').val(data[0]['start_date']);
          angular.element('#end_date').val(data[0]['end_date']);
          angular.element('#price_result').val(data[0]['total']);
          $scope.rate = data[0].customer_feedback;

    }); 

    $scope.calculatePrice = function() {
      if (angular.element('#customer_id').val() == '') {
            toastr.error("Idiot!! You must insert organization first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
      }else {

        var aum_service_array = [];
        var total = [];
        var test = document.getElementById("service_list_data").getElementsByTagName("input");
        for(var i=0;i<test.length;i++) {
            var text_id = test[i].id;
            var service_price = parseInt(angular.element('#'+text_id).closest('td').prev().html());
            var total_price = service_price * test[i].value;
            var aum_service = {};
            aum_service.service_id = test[i].id;
            aum_service.quantity = test[i].value;
            aum_service.qty_total = total_price;
            aum_service_array.push(aum_service);
            total.push(total_price);
        }  
        var aum_price = total.reduce(function(prev, cur) {
          return prev + cur;
        });
        // console.log(aum_service_array);
        if (angular.element('#subscription_fee').val() == '1000/yr') {
         aum_price = aum_price + 1000; 
       }else {
         aum_price = aum_price + 1900; 
       }
        
        $scope.price_result = aum_price

        var post_data = {};
        post_data.method = 'update_aum_customer_details';
        post_data.aum_order_id = $routeParams.id;
        post_data.enquiry_date = angular.element('#enquiry_date').val();
        post_data.start_date = angular.element('#start_date').val();
        post_data.end_date = angular.element('#end_date').val();
        post_data.subscription_type = angular.element('#subscription_fee').val();
        post_data.customer_feedback = angular.element('#customer_feedback').val();
        post_data.total = aum_price;
        $http.post('api/aum_controller.php', post_data)
          .success(function(data) {
               if (data.status == true) {
                var aum_service_details = {};
                aum_service_details.method = 'update_aum_service_details'
                aum_service_details.aum_order_id = $routeParams.id;
                aum_service_details.details = aum_service_array
                  $http.post('api/aum_controller.php', aum_service_details)
                    .success(function(data) {
                         if (data.status == true) {
                            toastr.success("Customer Updated Successfully");
                              toastr.options = {
                                "closeButton": false,
                                "debug": false,
                                "positionClass": "toast-bottom-left",
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

                };              
          
        }); 
       
      }
    }

}]).controller("aumJobsCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("aumJobsForm", ["$scope", "$http", function($scope, $http) {
    getServiceList()
    function getServiceList() {
        $http.post('api/aum_controller.php', {method:'get_service_list'})
            .success(function(data) {
                $scope.service = data;
            
        }); 
    }

      $scope.addService =  function() {
      var service_list = {};
      service_list.method = 'save_aum_service';
      service_list.service_name = $scope.service_name;
      service_list.service_price = $scope.service_price;
      service_list.service_frequency = $scope.service_frequency;
      $scope.service.push(service_list);

      $http.post('api/aum_controller.php', service_list)
        .success(function(data) {
            if (data.status == true) {
                    toastr.success("Service Added successfully");
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
            $scope.service_name = '';
            $scope.service_frequency= '';
            $scope.service_price = '';
            };            
        
      }); 

     }

    $scope.addItem = function() {
        $scope.service.push({
            service_name: '',
            aum_price: '',
            qty: 0,
            frequency:''
        });
    },
    $scope.removeItem = function(idx) {
        var service_to_delete = $scope.service[idx];
        var post_data = {};
        post_data.method = 'delete_service_by_id';
        post_data.service_id = service_to_delete.service_id
        $http.post('api/aum_controller.php', post_data)
        .success(function(data) {
            if (data.status == true) {
                    $scope.service.splice(idx, 1);
                    toastr.success("Service Deleted successfully");
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

}]).controller("aumInvoiceCtrl", ["$scope","$http","$routeParams", "$window", function ($scope, $http, $routeParams) {
 
      var post_data = {};
      post_data.aum_order_id = $routeParams.id;
      post_data.method = 'get_aum_details_by_id'; 
      $http.post('api/aum_controller.php', post_data)
        .success(function(data) {
          $scope.aum_services_list = data;
          $scope.get_sub_total = function() {
            var total = 0;
            for(var i = 0; i < data.length; i++){
                total += parseInt(data[i]['qty_total']);
            }
            return total;
          }
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
              dd='0'+dd
          } 

          if(mm<10) {
              mm='0'+mm
          } 
          today = dd+'/'+mm+'/'+yyyy;
          $scope.invoice_date = today;
          $scope.package_name = 'AUM Package';
          $scope.invoice_number = '#AUM'+$routeParams.id;
          $scope.customer_name = data[0]['customer_name'];
          $scope.customer_phone = data[0]['customer_phone'];
          $scope.customer_address = data[0]['customer_address'];
          $scope.subscription_type = data[0]['subscription_type'];
          $scope.start_date = data[0]['start_date'];
          $scope.end_date = data[0]['end_date'];
          $scope.grand_total = data[0]['total'];
           // console.log(data); 

      }); 
        return $scope.printInvoice = function () {
            var originalContents, popupWin, printContents;
            return printContents = document.getElementById("invoice").innerHTML, originalContents = document.body.innerHTML, popupWin = window.open(), popupWin.document.open(), popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"), popupWin.document.close()
        }
}]).controller("amcCustomerCtrl", ["$scope", "$http", function($scope, $http) {

        $http.get('api/getAmcCustomerList.php').success(function(data){
          // console.log(data);
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

      $scope.enquiry_date = new Date();
      $scope.order_date = new Date();
      $scope.subscription_fee = 1000;
      $scope.service_quantity = 0;
      $scope.oncallCustomer = {};
      $scope.newCustomer = {};
      $scope.processNewCustomerForm = function(selectedCustomer) {
        $scope.newCustomer.customer_name = selectedCustomer['customer_name'];
        $scope.newCustomer.customer_address = selectedCustomer['customer_address'];
        $scope.newCustomer.customer_phone = selectedCustomer['customer_phone'];
        $scope.newCustomer.method = 'save_new_customer';
      
        $http.post('api/customer_controller.php', $scope.newCustomer)
            .success(function(data) {
                if (data.status == true) {
                        toastr.success("Organization Added successfully");
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
       $scope.change = function($event) {
          if($event == true){
              // console.log('clicked');
              var existing_customer_id =  $('#existing_customer_id').val();
              $scope.oncallCustomer.customer_id = existing_customer_id;
          }else {
              $scope.customer_id = 'not an existing customer';
          };
          
      }

      $scope.enquiry_type_list = [
        {type:'Assessment'},
        {type:'Quotation'},
        {type:'FollowUp'}
      ],

      $scope.follow_up_type_list = [
        {type:'Delay'},
        {type:'Cancel'},
        {type:'Confirm'}
      ];

      $scope.removeService = function($index) {
         $scope.amc_services_list.splice($index, 1);
      }
        getCustomerList();
        getServiceList();
        //getEmployeeList();
        function getCustomerList(){  
          $http.get("api/customerlist.php").success(function(data){
              $scope.customers = data;
          });
        };

        function getServiceList() {
            $http.post('api/amc_controller.php', {method:'get_service_list'})
                .success(function(data) {
                    $scope.amc_services_list = data;
                
            });    
          }

      $scope.calculatePrice = function() {
        if (angular.element('#customer_id').val() == '') {
              toastr.error("Idiot!! You must insert customer first");
              toastr.options = {
                "closeButton": false,
                "debug": false,
                "positionClass": "toast-bottom-left",
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
        }else {

          var aum_service_array = [];
          var total = [];
          var test = document.getElementById("service_list_data").getElementsByTagName("input");
          for(var i=0;i<test.length;i++) {
              var text_id = test[i].id;
              var service_price = parseInt(angular.element('#'+text_id).closest('td').prev().html());
              var total_price = service_price * test[i].value;
              var aum_service = {};
              aum_service.service_id = test[i].id;
              aum_service.quantity = test[i].value;
              aum_service.qty_total = total_price;
              aum_service_array.push(aum_service);
              total.push(total_price);
          }  
          var aum_price = total.reduce(function(prev, cur) {
            return prev + cur;
          });
          // console.log(aum_service_array);
          aum_price = aum_price + 0;
          $scope.price_result = aum_price

          var post_data = {};
          post_data.method = 'save_amc_customer_details';
          post_data.customer_id = angular.element('#customer_id').val();
          post_data.order_date = angular.element('#order_date').val();
          post_data.end_date = angular.element('#end_date').val();
          post_data.enquiry_type = angular.element('#enquiry_type').val();
          post_data.enquiry_date = angular.element('#enquiry_date').val();
          post_data.follow_up_type = angular.element('#follow_up_type').val();
          post_data.subscription_type = angular.element('#subscription_fee').val();
          post_data.extra_inventory = angular.element('#extra_inventory').val();
          post_data.customer_feedback = angular.element('#customer_feedback').val();
          post_data.billing_frequency = angular.element('#billing_frequency').val();
          post_data.total = aum_price;
          $http.post('api/amc_controller.php', post_data)
            .success(function(data) {
                 if (data.status == true) {
                  var amc_service_details = {};
                  amc_service_details.method = 'save_amc_service_details'
                  amc_service_details.amc_order_id = data.amc_order_id;
                  amc_service_details.details = aum_service_array
                    $http.post('api/amc_controller.php', amc_service_details)
                      .success(function(data) {
                           if (data.status == true) {
                              toastr.success("Customer Added Successfully");
                                toastr.options = {
                                  "closeButton": false,
                                  "debug": false,
                                  "positionClass": "toast-bottom-left",
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

                  };              
            
          }); 
         
        }
      }



}]).controller("amcJobsCtrl", ["$scope", "$http", function($scope, $http) {

}]).controller("editAmcCustomerCtrl", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) {
    $scope.enquiry_type_list = [
        {type:'Assessment'},
        {type:'Quotation'},
        {type:'FollowUp'}
      ],

      $scope.follow_up_type_list = [
        {type:'Delay'},
        {type:'Cancel'},
        {type:'Confirm'}
      ];

    $scope.removeService = function($index) {
       $scope.amc_services_list.splice($index, 1);
    }
    var post_data = {};
    post_data.amc_order_id = $routeParams.id;
    post_data.method = 'get_amc_details_by_id'; 
    $http.post('api/amc_controller.php', post_data)
      .success(function(data) {
        $scope.amc_services_list = data;
         // console.log(data); 
          angular.element('#organization_name').val(data[0]['customer_name']);
          angular.element('#organization_address').val(data[0]['customer_address']);  
          angular.element('#organization_phone').val(data[0]['customer_phone']); 
          angular.element('#enquiry_type').val(data[0]['enquiry_type']); 
          angular.element('#follow_up_type').val(data[0]['follow_up_type']); 
          angular.element('#enquiry_date').val(data[0]['enquiry_date']);
          angular.element('#organization_id').val(data[0]['customer_id']);
          angular.element('#subscription_fee').val(data[0]['subscription_type']);
          angular.element('#order_date').val(data[0]['start_date']);
          angular.element('#end_date').val(data[0]['end_date']);
          angular.element('#extra_inventory').val(data[0]['extra_inventory']);
          angular.element('#price_result').val(data[0]['total']);
          angular.element('#billing_frequency').val(data[0]['billing_frequency']);
          $scope.rate = data[0].customer_feedback;

    }); 

    $scope.calculatePrice = function() {
      if (angular.element('#organization_id').val() == '') {
            toastr.error("Idiot!! You must insert organization first");
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-bottom-left",
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
      }else {

        var aum_service_array = [];
        var total = [];
        var test = document.getElementById("service_list_data").getElementsByTagName("input");
        for(var i=0;i<test.length;i++) {
            var text_id = test[i].id;
            var service_price = parseInt(angular.element('#'+text_id).closest('td').prev().html());
            var total_price = service_price * test[i].value;
            var aum_service = {};
            aum_service.service_id = test[i].id;
            aum_service.quantity = test[i].value;
            aum_service.qty_total = total_price;
            aum_service_array.push(aum_service);
            total.push(total_price);
        }  
        var aum_price = total.reduce(function(prev, cur) {
          return prev + cur;
        });
        // console.log(aum_service_array);
          aum_price = aum_price + 0; 

        
        $scope.price_result = aum_price

        var post_data = {};
        post_data.method = 'update_amc_customer_details';
        post_data.amc_order_id = $routeParams.id;
        post_data.enquiry_date = angular.element('#enquiry_date').val();
        post_data.start_date = angular.element('#order_date').val();
        post_data.end_date = angular.element('#end_date').val();
        post_data.enquiry_type = angular.element('#enquiry_type').val();
        post_data.enquiry_date = angular.element('#enquiry_date').val();
        post_data.follow_up_type = angular.element('#follow_up_type').val();
        post_data.subscription_type = angular.element('#subscription_fee').val();
        post_data.extra_inventory = angular.element('#extra_inventory').val();
        post_data.customer_feedback = angular.element('#customer_feedback').val();
        post_data.customer_feedback = angular.element('#billing_frequency').val();
        post_data.bill_date = angular.element('#order_date').val();

        post_data.total = aum_price;
        $http.post('api/amc_controller.php', post_data)
          .success(function(data) {
               if (data.status == true) {
                var amc_service_details = {};
                amc_service_details.method = 'update_amc_service_details'
                amc_service_details.amc_order_id = $routeParams.id;
                amc_service_details.details = aum_service_array
                  $http.post('api/amc_controller.php', amc_service_details)
                    .success(function(data) {
                         if (data.status == true) {
                            toastr.success("Organization Updated Successfully");
                              toastr.options = {
                                "closeButton": false,
                                "debug": false,
                                "positionClass": "toast-bottom-left",
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

                };              
          
        }); 
       
      }
    }

}]).controller("amcJobsForm", ["$scope", "$http", function($scope, $http) {
    getServiceList()
    function getServiceList() {
        $http.post('api/amc_controller.php', {method:'get_service_list'})
            .success(function(data) {
                $scope.service = data;
            
        }); 
    }

      $scope.addService =  function() {
      var service_list = {};
      service_list.method = 'save_amc_service';
      service_list.service_name = $scope.service_name;
      service_list.service_price = $scope.service_price;
      service_list.service_frequency = $scope.service_frequency;
      $scope.service.push(service_list);

      $http.post('api/amc_controller.php', service_list)
        .success(function(data) {
            if (data.status == true) {
                    toastr.success("Service Added successfully");
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
            $scope.service_name = '';
            $scope.service_frequency= '';
            $scope.service_price = '';
            };            
        
      }); 

     }

    $scope.removeItem = function(idx) {
        var service_to_delete = $scope.service[idx];
        var post_data = {};
        post_data.method = 'delete_service_by_id';
        post_data.service_id = service_to_delete.service_id
        $http.post('api/amc_controller.php', post_data)
        .success(function(data) {
            if (data.status == true) {
                    $scope.service.splice(idx, 1);
                    toastr.success("Service Deleted successfully");
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

}]).controller("amcInvoiceCtrl", ["$scope","$http","$routeParams", "$window" , function($scope, $http, $routeParams) {
      $scope.order_id = $routeParams.id;
      $scope.main_name = 'Aumfs Automation Company';

      var post_data = {};
      post_data.amc_order_id = $routeParams.id;
      post_data.method = 'get_amc_details_by_id'; 
      $http.post('api/amc_controller.php', post_data)
        .success(function(data) {
          $scope.amc_services_list = data;
          $scope.get_sub_total = function() {
            var total = 0;
            for(var i = 0; i < data.length; i++){
                total += parseInt(data[i]['qty_total']);
            }
            return total;
          }
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
              dd='0'+dd
          } 

          if(mm<10) {
              mm='0'+mm
          } 
          today = dd+'/'+mm+'/'+yyyy;
          $scope.invoice_date = today;
          $scope.package_name = 'Corporate AMC';
          $scope.invoice_number = '#AMC'+$routeParams.id;
          $scope.customer_name = data[0]['customer_name'];
          $scope.customer_phone = data[0]['customer_phone'];
          $scope.customer_address = data[0]['customer_address'];
          $scope.subscription_type = data[0]['subscription_type'];
          $scope.start_date = data[0]['start_date'];
          $scope.end_date = data[0]['end_date'];
          $scope.grand_total = data[0]['total'];
          $scope.extra_inventory = data[0]['extra_inventory'];
           // console.log(data); 

      }); 
        return $scope.printInvoice = function () {
            var originalContents, popupWin, printContents;
            return printContents = document.getElementById("invoice").innerHTML, originalContents = document.body.innerHTML, popupWin = window.open(), popupWin.document.open(), popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"), popupWin.document.close()
        }
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
}).factory("loginService", ["$http", "$location", "sessionService",function ($http, $location, sessionService) {
  return{
    login:function(data,scope){
      var $promise=$http.post('api/user.php',data); //send data to user.php
      $promise.then(function(msg){
        var uid=msg.data;
        if(uid){
          //scope.msgtxt='Correct information';
          sessionService.set('uid',uid);
          $location.path('/dashboard');
        }        
        
        else  {
          scope.msgtxt='incorrect information';
          $location.path('/pages/signin');
        }          
      });
    },
    logout:function(){
      sessionService.destroy('uid');
      $location.path('/pages/signin');
    },
    islogged:function(){
      var $checkSessionServer=$http.post('api/check_session.php');
      return $checkSessionServer;
      /*
      if(sessionService.get('user')) return true;
      else return false;
      */
    }
  }
}]).factory("sessionService", ["$http",function ($http) {
  return{
    set:function(key,value){
      return sessionStorage.setItem(key,value);
    },
    get:function(key){
      return sessionStorage.getItem(key);
    },
    destroy:function(key){
      $http.post('api/destroy_session.php');
      return sessionStorage.removeItem(key);
    }
  };
}]).run(function($rootScope, $location, loginService){
  var routespermission=['/dashboard','/settings','/about','/oncall','/oncall/:id','/oncall-charges','/aum','/aum-jobs','/aum/:id','/aum-invoice/:id','/amc','/amc/:id','/amc-jobs','/amc-invoice/:id','/employee-listing','/employee-status','/employee-status/:id','/employee-listing/:id','/otj','/otj/:id','/otj-invoice/:id','/otj-jobs'];  //route that require login
  $rootScope.$on('$routeChangeStart', function(){
    if( routespermission.indexOf($location.path()) !=-1)
    {
      var connected=loginService.islogged();
      connected.then(function(msg){
        if(!msg.data) $location.path('/pages/signin');
      });
    }
  });
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