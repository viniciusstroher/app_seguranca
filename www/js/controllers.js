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

.controller('CamerasCtrl', function($scope,localFactory, $ionicPopup) {
  $scope.novaCamera           = {};
  
  $scope.carrageCameras = function(){
    $scope.cameras    = [];
    var camerasCache  = localFactory.get('cameras'); 
    if(camerasCache){
      if(angular.isArray(camerasCache)){
        $scope.cameras = camerasCache;
      }
    }
  }
  $scope.carrageCameras();

  $scope.adicionar  = false;
  $scope.editar     = false;
  
  $scope.adicionarCamera = function function_name(argument) {
    if(!$scope.editar){
      $scope.adicionar = true;
    }else{
       $ionicPopup.show({
          template: "Termine a edição antes de adicionar nova camera.",
          title: 'Atenção',
          
          scope: $scope,
          buttons: [
           { text: 'Ok' },
           
          ]
        });
    }
    
  }

  $scope.cancelarCamera = function(){
    $scope.adicionar = false;
    $scope.editar    = false;
    $scope.novaCamera       = {};
 
  }

  $scope.salvarCamera = function(){
    console.log($scope.novaCamera);
    if($scope.novaCamera.label == "" || $scope.novaCamera.rtsp == ""){
      $ionicPopup.show({
        template: "Não deixe o campo de label ou o rtsp vazios.",
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
          camerasCache.push($scope.novaCamera);
          localFactory.set('cameras',camerasCache);
        }else{
          localFactory.set('cameras',[$scope.novaCamera]);
        }
      }else{
        localFactory.set('cameras',[$scope.novaCamera]);
      }

      $scope.adicionar            = false;
      $scope.novaCamera           = {};

    }
  }

  $scope.editaCamera = function(index){
    $scope.novaCamera = $scope.cameras[index];
    $scope.editar     = true;
    $scope.editarIndice = index;
  }

  $scope.salvarEditCamera = function(){
    var camerasCache                  = localFactory.get('cameras'); 
    camerasCache[$scope.editarIndice] = $scope.novaCamera;
    
    localFactory.set('cameras',camerasCache); 
    
    $scope.editar               = false;
    $scope.novaCamera           = {};
  }


  $scope.visualizarCamera = function(){
       $ionicPopup.show({
        template: "Deseja visualizar esta camera?",
        title: 'Atenção',
        
        scope: $scope,
        buttons: [
         { text: 'Sim',
           onTap: function(){
              //CODIGO PARA VISUALIZAR CAMERA RTSP PLUGIN
           } },{ text: 'Não',
           onTap: function(){
            
           } }
         
        ]
      });
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



});
