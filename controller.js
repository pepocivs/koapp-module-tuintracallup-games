(function(){
  'use strict';

  angular
    .controller('tuintracallupgamesCtrl', loadFunction);

  loadFunction.$inject = ['$http','$scope', '$rootScope', '$window', '$location',
                          'structureService', '$sce', '$filter', 'storageService'];

  function loadFunction($http, $scope, $rootScope, $window, $location,
                        structureService, $sce, $filter, storageService){
    structureService.registerModule($location, $scope, 'tuintracallupgames');


    $scope.backButton = backButton;
    $rootScope.isBusy = true;
    var teamId = ($location.search().teamId) ? $location.search().teamId : false;

    if (teamId) init();
    else        showError('team Id not found');

    function init() {
      storageService.get('tuintraLogin')
        .then(getInfo)
        .catch(showError);
    }

    function getInfo(data) {
      var userData = data.value.userInfo;
      $http.get('http://api.tuintra.com/public/'+userData.domain+'/getCalendar?nDays=3&teamId='+teamId)
        .success(function(data){
          $scope.games      = data;
          $rootScope.isBusy = false;
          applyScope();
        })
        .error(showError);
    }

    function backButton() {
      $window.history.back();
    }

    function showError(e){
      $scope.tuintracallupgames.message = $filter('translate')('tuintra-callupgames.error-loading')+' - '+e;
      $rootScope.isBusy = false;
    }

    function applyScope() {
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    }

  }
}());
