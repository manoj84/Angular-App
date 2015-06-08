angular.module('todoController', ['ui.grid', 'ui.grid.resizeColumns'])

    // Controller with LogOut Function
    .controller('mainController', ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.signOut = function () {
            var logoutPromise = $http({
                url: 'http://localhost:8080/logout',
                method: 'POST'
            });

            logoutPromise.then(function (response) {
                $state.go('login');
                sessionStorage.removeItem('current');
                sessionStorage.removeItem('tokens');
                sessionStorage.removeItem('initialLoad');
            }, function (error) {
                sessionStorage.removeItem('current');
                sessionStorage.removeItem('tokens');
                sessionStorage.removeItem('initialLoad');
            });
        };

    // The Grid Controller, which fecthes data and displayes in UI Grid.
    // I have put pagination support for 5 items per page.
    //To disable it please, remove limit=5 from Line 36.
    }]).controller('GridController', ['$scope', '$http', function ($scope, $http) {

        //Disable Buttons on Page Load.
        $scope.disableNextButton = true;
        $scope.disablePreviousButton = true;


        //AJAX call to get the data
        var getData = function (token) {
            var currentCount = parseInt(sessionStorage.getItem('current'));
            if (currentCount > 0) {
                $scope.disablePreviousButton = false;
            }
            var tokens = JSON.parse(sessionStorage.getItem('tokens'));
            if (typeof token !== 'undefined' && token) {
                url = 'http://localhost:8080/api/all/instances?limit=5&token=' + token;
            }
            else {
                url = 'http://localhost:8080/api/all/instances?limit=5';
            }
            var instancePromise = $http({
                url: url,
                method: 'GET'
            });

            instancePromise.then(function (res) {
                    $scope.disableNextButton = true;
                    $scope.gridOptions.data = [];
                    for (var i = 0; i < res.data.Reservations.length; i++) {
                        var temp = res.data.Reservations[i].Instances;
                        for (var j = 0; j < temp.length; j++) {
                            $scope.gridOptions.data.push(temp[j]);
                        }
                    }
                    console.log($scope.gridOptions.data);
                    //Push the tokens in Session Storage, so that you can retrieve them for Next and Back operations.
                    var nextToken = res.data.NextToken;
                    if (nextToken !== null && typeof nextToken !== 'undefined' && sessionStorage.getItem('initialLoad') !== 'done' ){
                        tokens.push(nextToken);
                        sessionStorage.setItem('tokens', JSON.stringify(tokens));
                        $scope.disableNextButton = false;
                            sessionStorage.setItem('initialLoad', 'done');
                    }

                    else if (nextToken !== null && typeof nextToken !== 'undefined') {
                            $scope.disableNextButton = false;
                        }

                }, function (error) {
                    console.log('Fetching data failed');
                }
            );
            return instancePromise;
        };

        //Next button picks up the token from Session Storage and sends it as part of request to get next 5 items.
        $scope.nextButton = function () {
            $scope.disablePreviousButton = false;
            var currentCount = parseInt(sessionStorage.getItem('current'));
            var tokens = JSON.parse(sessionStorage.getItem('tokens'));
            var promise = getData(tokens[currentCount]);
            promise.then(function(res){
                var nextToken = res.data.NextToken;
                if (nextToken !== null && typeof nextToken !== 'undefined') {
                    tokens.push(nextToken);
                    sessionStorage.setItem('tokens', JSON.stringify(tokens));
                    currentCount = currentCount + 1;
                    sessionStorage.setItem('current', currentCount);
                    $scope.disableNextButton = false;
                }
            }, function(error){});
        };

        //Previous Button fetches the Token from Session Storage and gets the Previous 5 items.
        $scope.previousButton = function () {
            var currentCount = parseInt(sessionStorage.getItem('current'));
            var tokens = JSON.parse(sessionStorage.getItem('tokens'));
            var promise = getData(tokens[currentCount - 1 ]);
            promise.then(function(res){
                if(currentCount === 0) {
                    $scope.disablePreviousButton = true;

                }
                else {
                    currentCount = currentCount - 1;
                    sessionStorage.setItem('current', currentCount);
                }
            });
        };

        //Page Refresh and Initial Load.
        //Set a counter in Session Storage and Create an array.
        //Push the tokens that you get from REST Service into the Array and increment the Counter.
        //The value of the counter and Token Array is used to decide which pagination results to come next.
        var currentCount = parseInt(sessionStorage.getItem('current'));
        var tokens = JSON.parse(sessionStorage.getItem('tokens'));
        if (tokens == undefined) {
            getData(null);
        }
        else {
            getData(tokens[currentCount]);
        }

        $scope.gridOptions = {
            resizable: true,
            enableSorting: true,
            enableColumnResizing: true,
            onRegisterApi: function (gridApi) {
                $scope.grid1Api = gridApi;
            },
            columnDefs: [{field: 'Name', displayName: 'Name'},
                {field: 'InstanceId', displayName: 'InstanceId'},
                {field: 'InstanceType', displayName: 'Instance Type'},
                {field: 'State', displayName: 'Instance State'},
                {field: 'PublicDnsName', displayName: 'Public DNS'},
                {field: 'PrivateIpAddress', displyaName: 'Public Ip'},
                {field: 'KeyName', displayName: 'Key Name'},
                {
                    field: 'Monitoring',
                    displayName: 'Monitoring',
                    cellTemplate: '<span>{{row.entity[col.field].State}}</span>'
                },
                {field: 'LaunchTime', displayName: 'Launch Time'},
                {
                    field: 'State',
                    displayName: 'Instance State',
                    cellTemplate: '<span>{{row.entity[col.field].Name}}</span>'
                },
                {
                    field: 'SecurityGroups',
                    displayName: 'Security Groups',
                    cellTemplate: '<span>{{row.entity[col.field][0].GroupName}}</span>'
                }
            ]
        };
    }
    ]).
    // Login Controller, which takes care of Authentication.
    controller('LoginController', ['$scope', '$http', '$state', function ($scope, $http, $state) {

        $scope.submit = function () {
            var loginPromise = $http({
                url: 'http://localhost:8080/login',
                method: 'POST',
                data: {username: $scope.username, password: $scope.password}
            });

            loginPromise.then(function (response) {
                var tokens = [];
                sessionStorage.setItem('current', 0);
                sessionStorage.setItem('tokens', JSON.stringify(tokens));
                $state.go('grid');
            }, function (error) {
                $scope.error = 'Login Failed. Try Username test, password test';
            });
        }

    }]);