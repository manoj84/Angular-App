angular.module('sampleApp', ['todoController', 'todoService', 'ui.router']).config(function($stateProvider) {
   $stateProvider.state('grid', {
      url: '/grid',
       templateUrl: 'partials/grid.html'
   });
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'partials/login.html'
    });
});

//Remove CORS header
angular.module('sampleApp')
    .config(function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });