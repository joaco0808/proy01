var app = angular.module('angularApp', ['ngRoute']);

app.config(function ($routeProvider) {
    
})

app.factory('simpleFactory',function () {
    var customers = [
        {name: "John Smith", city: "Phonex"},
        {name: "John Doe", city: "New York"},
        {name: "Jane Doe", city: "San Fracisco"}
    ];

    var factory = {};

    factory.getCustomers = function () {
        return customers;
    }
    factory.postCustomer = function (custº) {
        // body...
    }

});

//Controllers part
var controllers = {};
controllers.newController = function ($scope, simpleFactory) {
    $scope.customers = [];

    init();

    function init () {
        $scope.customers = simpleFactory.getCustomers();
    }
}

controllers.otherController = function ($scope) {
    $scope.data = [
        {data1: "John Smith", data2: "Phonex"},
        {data1: "John Doe", data2: "New York"},
        {data1: "Jane Doe", data2: "San Fracisco"}
    ];
}


app.controller(controllers);