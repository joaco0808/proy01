'use strict'
app.service('ErrorHandlerService', ['$location', 'SessionService', function($location, SessionService) {
    return {
        //hand the app errors
        handError: function(error) {
            if (error.status === 401) { //unauthorized
                alert("you don't have permission to use the application!");
                SessionService.unsetAll();
                SessionService.logoutServer();
                $location.path('/signin');
            }

            if(error.status === 404) { //resource not found
                alert("the resource will not be found!");
            }
        }
    }
}]);
