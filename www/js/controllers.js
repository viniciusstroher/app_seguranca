angular.module('starter.controllers', [])

.controller('SensoresCtrl', function($scope,$timeout,localFactory) {
  $scope.localFactory = localFactory;
})

.controller('ServerCtrl', function($scope,$rootScope, Chats,$timeout,$http,localFactory) { 
  //CHECAR SE JA EXISTE A WINDOW.HTTPD.REQUESTS NO INIT QUANDO TIVER EM BACKGROUND
  $scope.server       = {};
  $scope.server.porta = 10000;
  $scope.server.senha = "teste";
  
  $scope.killServer = function(){
    if(window.cordova){
      navigator.httpd.stopHttpd();
    }
  }

  $scope.runServer = function(){
    if(window.cordova){
      navigator.httpd.startHttpd($scope.server.porta,$scope.server.senha,$scope.estado.notificar);
    }
  }

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})

.controller('CamerasCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
