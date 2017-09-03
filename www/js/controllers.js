angular.module('starter.controllers', [])

.controller('SensoresCtrl', function($scope,$timeout,$rootScope,localFactory) {
  $scope.limpaEventos = function(){
    $rootScope.eventos = [];
  }
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

.controller('CamerasCtrl', function($scope,localFactory) {
  $scope.novaCamera           = {};
  $scope.novaCamera.label     = "";
  $scope.novaCamera.rtsp      = "";
  $scope.novaCamera.descricao = "";
  
  $scope.cameras    = [];
  $scope.adicionar  = false;

  var camerasCache  = localFactory.get('cameras'); 
  if(camerasCache){
    if(angular.isArray(camerasCache)){
      $scope.cameras = camerasCache;
    }
  }

  $scope.adicionarCamera = function function_name(argument) {
    $scope.adicionar = true;
  }

  $scope.cancelarCamera = function(){
    $scope.adicionar = false;
  }

  $scope.salvarCamera = function(){
    console.log($scope.novaCamera);
  }

});
