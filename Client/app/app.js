var app = angular.module('angularApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");
    //
    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "app/partials/login.html",
            controller: 'LoginController'
        })
        .state('home', {
            url: "/home",
            templateUrl: "app/partials/home.html"
        })
        .state('about', {
            url: "/about",
            views: {
                '':{templateUrl: "app/partials/about.html"}
            }
            
        });
});

app.factory('AuthService', function ($http, Session) {
  var authService = {};
 
  authService.login = function (credentials) {
    return $http({
                method: 'POST',
                url: '/login',
                params: credentials,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .success(function (res, status, headers, config) {
                
                Session.create(res.id, res.user.id,
                               res.user.role);
                return res.user;
            })
            .error(function (data, status, headers, config) {
                
                alert(status);
            });
  };

  authService.isloggedin = function (callback, scope) {
    return $http({
                method: 'GET',
                url: '/loggedin'
            })
            .then(function (res) {
                var data = res.data;
                debugger;
                if(data === '0')
                    Session.destroy();
                else 
                    Session.create(data.id, data.user.id, data.user.role);

                callback(data,scope);
            });
  };

  authService.isAuthenticated = function () {
    return !!Session.get("userId");
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
})

app.service('Session', function () {
    
    this.get = function(key) {
        return sessionStorage.getItem(key);
    };

    this.create = function (sessionId, userId, userRole) {
        sessionStorage.setItem('id', sessionId);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userRole', userRole);
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };

    this.destroy = function () {
        sessionStorage.clear();
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
return this;
})


//Controllers part
app.controller('LoginController', ['$rootScope', '$scope', '$location', 'AUTH_EVENTS', 'AuthService',function($rootScope, $scope, $location, AUTH_EVENTS, AuthService) {
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (res) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            
            sessionStorage.user = JSON.stringify(res.data.user);
            $scope.setCurrentUser(res.data.user);
            $location.path('/home');
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
}]);

app.controller('ApplicationController', ['$scope', 'USER_ROLES', 'AuthService', 'Session',function ($scope,
                                               USER_ROLES,
                                               AuthService, Session) {
    
    var setUser = function (data, scope){
        if (data.id == '0') {
            scope.currentUser = null;
        }else{
            scope.currentUser = data.user;
        };

        scope.userRoles = USER_ROLES;
        scope.isAuthorized = AuthService.isAuthorized;
        scope.isAuthenticated = AuthService.isAuthenticated;
    }

    var x = AuthService.isloggedin(setUser, $scope);

    $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        }; 
}])

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

app.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})