var app = angular.module('angularApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");
    //
    // Now set up the states
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "app/partials/state1.html"
        })
        .state('state1.list', {
            url: "/list",
            templateUrl: "app/partials/state1.list.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
          }
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "app/partials/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            templateUrl: "app/partials/state2.list.html",
            controller: function($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            }
    });
});

app.factory('simpleFactory',function () {
    var customers = [
        {name: "John Smith", city: "Phonex"},
        {name: "John Doe", city: "New York"},
        {name: "Jane Doe", city: "San Fracisco"}
    ];

    var factory = {};

    factory.getCustomers = function () {
        return customers;
    };
    factory.postCustomer = function (cust) {
        // body...
    };

    return factory;
});


//Controllers part
app.controller('newController', function($scope, simpleFactory){
        $scope.customers = [];

    init();

    function init () {
        $scope.customers = simpleFactory.getCustomers();
    }
});