angular.module('starter.controllers', [])

.controller('SensoresCtrl', function($scope,$timeout,$rootScope,localFactory) {
  $scope.limpaEventos = function(){
    $rootScope.eventos = [];
  }
})

.controller('ServerCtrl', function($scope,$rootScope,$timeout,$http,localFactory,$state) { 
  //CHECAR SE JA EXISTE A WINDOW.HTTPD.REQUESTS NO INIT QUANDO TIVER EM BACKGROUND

  $scope.salvarConfigs = function(){
    var configApp               = {};
    configApp.contaNOIP         = $rootScope.contaNOIP;
    configApp.dnsNOIP           = $rootScope.dnsNOIP;
    configApp.atualizarDNSTempo = $rootScope.atualizarDNSTempo;
    configApp.atualizarDNS      = $rootScope.estado.atualizarDNS;
    configApp.notificar         = $rootScope.estado.notificar;
    configApp.startonboot       = $rootScope.estado.startonboot;

    configApp.notificar         = $rootScope.estado.notificar;
    configApp.startonboot       = $rootScope.estado.startonboot;
    configApp.server_api        = $rootScope.server.api;
    configApp.server_porta      = $rootScope.server.porta;
    configApp.server_senha      = $rootScope.server.senha;
    localFactory.set("configApp",configApp);
  }
  
  $scope.killServer = function(){
    if(window.cordova){
      navigator.httpd.stopHttpd();
    }
  }

  $scope.runServer = function(){
    if(window.cordova){
      navigator.httpd.startHttpd($rootScope.server.porta,$rootScope.server.senha,$rootScope.estado.notificar);
    }
  }

})

.controller('CamerasCtrl', function($scope,localFactory, $ionicPopup,$state) {
  $scope.$on('$ionicView.enter', function() {
    $scope.carrageCameras();
  });

  $scope.carrageCameras = function(){
    $scope.cameras    = [];
    var camerasCache  = localFactory.get('cameras'); 
    if(camerasCache){
      if(angular.isArray(camerasCache)){
        $scope.cameras = camerasCache;
      }
    }
  }
  
  $scope.adicionarCamera = function() {
    $state.go("crud");
  }
  $scope.editaCamera = function(index){
    $state.go("crud",{edit: index});
  }
 
  $scope.visualizarCamera = function(index){
       $state.go("view",{index});
  }

  $scope.deletarCamera = function(index){
    $ionicPopup.show({
        template: "Deseja deletar esta camera?",
        title: 'Atenção',
        
        scope: $scope,
        buttons: [
         { text: 'Sim',
           onTap: function(){
              var camerasCache                  = localFactory.get('cameras'); 
              camerasCache.splice($scope.editarIndice,1);
              localFactory.set('cameras',camerasCache); 
              
              $scope.carrageCameras();
           } },{ text: 'Não',
           onTap: function(){
            
           } }
         
        ]
      });
    
  }

}).controller('CrudCamerasCtrl', function($scope,localFactory, $ionicPopup,$state,$stateParams) {
  $scope.c        = {};

  $scope.editando   = false;

  if($stateParams.edit != ""){
    var camerasCache  = localFactory.get('cameras'); 
    var camera        = camerasCache[$stateParams.edit];
    
    $scope.c.ws     = camera.ws;
    $scope.c.camera = camera.camera;
    
    $scope.editando = true;  

  }else{
    
    $scope.c.ws     = "ws://localhost:9000";
    $scope.c.camera = "";
  }
  $scope.salvar = function() {

    if($scope.c.ws == "" || $scope.c.camera == ""){
      $ionicPopup.show({
        template: "Preencha os campos.",
        title: 'Atenção',
        
        scope: $scope,
        buttons: [
         { text: 'Ok' },
         
        ]
      });
    }else{
        var camerasCache  = localFactory.get('cameras'); 
        if(camerasCache){
          if(angular.isArray(camerasCache)){
            camerasCache.push({ws: $scope.c.ws, camera: $scope.c.camera});
            localFactory.set('cameras',camerasCache);
          }else{
            localFactory.set('cameras',[{ws: $scope.c.ws, camera: $scope.c.camera}]);
          }
        }else{
          localFactory.set('cameras',[{ws: $scope.c.ws, camera: $scope.c.camera}]);
        }
        $state.go("tab.cameras");
    }
    
  }

  $scope.editar = function(){
    var camerasCache  = localFactory.get('cameras'); 
    if(!angular.equals(camerasCache,{})){
      if($scope.c.ws == "" || $scope.c.camera == ""){
        $ionicPopup.show({
          template: "Preencha os campos.",
          title: 'Atenção',
          
          scope: $scope,
          buttons: [
           { text: 'Ok' },
           
          ]
        });
      }else{
        camerasCache[$stateParams.edit].ws      = $scope.c.ws;
        camerasCache[$stateParams.edit].camera  = $scope.c.camera;
        localFactory.set('cameras',camerasCache);
        $state.go("tab.cameras");
      }
    }else{
      $state.go("tab.cameras");
    }
    
  }

  $scope.voltar = function() {
    $state.go("tab.cameras");
  }
})
.controller('ViewCamerasCtrl', function($scope,localFactory, $ionicPopup,$state,$stateParams) {
  
  if($stateParams.index != ""){
    var camerasCache  = localFactory.get('cameras'); 
    var camera        = camerasCache[$stateParams.index];
    var canvas = document.getElementById('video-canvas');
    var player = new JSMpeg.Player(camera.ws, {canvas: canvas});
  }
  $scope.voltar = function() {
    $state.go("tab.cameras");
  }
});
;
