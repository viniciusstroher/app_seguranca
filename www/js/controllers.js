angular.module('starter.controllers', [])

.controller('SensoresCtrl', function($scope,$timeout,localFactory) {

})

.controller('ServerCtrl', function($scope,$rootScope,$timeout,$http,localFactory) { 
  //CHECAR SE JA EXISTE A WINDOW.HTTPD.REQUESTS NO INIT QUANDO TIVER EM BACKGROUND

  $scope.server        = {};
  $scope.server.porta  = 10000;
  $scope.server.senha  = "teste";
  
  $scope.killServer = function(){
    if(window.cordova){
      navigator.httpd.stopHttpd();
    }
  }

  $scope.runServer = function(){
    if(window.cordova){
      navigator.httpd.startHttpd($scope.server.porta,$scope.server.senha,$rootScope.estado.notificar);
    }
  }

})

.controller('CamerasCtrl', function($scope) {
});
