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

