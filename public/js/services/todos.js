angular.module('todoService', []).service('LoginService', ['$state',function($state) {
	'use strict';
		this.switchToLoginPage = function(){
			$state.go('login');
		}
	}]);

angular.module('todoService').factory('LoginInterceptor', ['$q', '$injector',

	function ($q, $injector) {
		'use strict';
		return {
			'response': function (response) {
				return response;
			},
			'responseError': function (rejection) {
				console.info('Interceptor rejection:', rejection);
				if (rejection.status === 401) {
					$injector.invoke(['LoginService',
						function (LoginService) {
							LoginService.switchToLoginPage();
						}
					]);
				}
				return $q.reject(rejection);
			}
		};
	}
]);

angular.module('sampleApp').config(['$httpProvider',function($httpProvider) {
	$httpProvider.interceptors.push('LoginInterceptor');
}]);

