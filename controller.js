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
    $scope.selectGame = selectGame;

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
      if (!data) showError($filter('translate')('tuintra-callupgames.notloged'));
      else{
        var userData = data.value.userInfo;
        $http.get('http://api.tuintra.com/'+userData.domain+'/calendar?nDays=3&teamId='+teamId)
          .success(function(data){
            $scope.games      = data;
            $rootScope.isBusy = false;
            applyScope();
          })
          .error(showError);
      }
    }

    function selectGame(gameId) {
      $location.path($scope.tuintracallupgames.modulescope.childrenUrl.tuintracallup).search('gameId', gameId);
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
