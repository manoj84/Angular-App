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

angular.module('sampleApp').config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);