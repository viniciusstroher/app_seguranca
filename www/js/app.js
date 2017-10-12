angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope,$timeout,$http,localFactory) {
  $rootScope.eventos        = [];
  $rootScope.sensores       = {};
  $rootScope.estado         = {};

  var sensores            = localFactory.get("sensores");
  if(sensores){
    $rootScope.sensores   = sensores;
  }else{
    localFactory.set("sensores",{});
  }

  $rootScope.estadoSensores = true;
  if(angular.equals({},$rootScope.sensores)){
    $rootScope.estadoSensores = false;
  }

  var configApp                 = localFactory.get("configApp");
  if(!configApp){
   
    $rootScope.server           = {};
    $rootScope.server.api       = "http://venizao.dlinkddns.com/";
    $rootScope.server.senha     = "teste";
    $rootScope.estado.notificar = false; 

    var configApp               = {};
    configApp.notificar         = $rootScope.estado.notificar;
    configApp.server_api        = $rootScope.server.api;  
    configApp.server_senha      = $rootScope.server.senha;

    localFactory.set("configApp",configApp);
  }else{
    
    $rootScope.estado.notificar         = configApp.notificar;
    $rootScope.estado.startonboot       = configApp.startonboot;

    $rootScope.server                   = {};
    $rootScope.server.api               = configApp.server_api;
    $rootScope.server.senha             = configApp.server_senha;

  }



  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  var socket = io.connect($rootScope.server.api);
  //socket.emit('estadoSensor');
  socket.on('conectado', function (data) {
    console.log('conectado',data);
  });

  socket.on('statusSensoresAPP', function (data) {
    if(data.evento != null){

      $rootScope.eventos.push(data.evento);
      var maxEventos = 30;
      if($rootScope.eventos.length > maxEventos){
        $rootScope.eventos = $rootScope.eventos.splice(0,maxEventos);
      }

      $rootScope.$apply();
      $rootScope.estadoSensores = true;

      if(data.evento.hasOwnProperty('magnetico')){
        $rootScope.sensores["/porta_aberta"] = data.evento;
      }

      if(data.evento.hasOwnProperty('pir')){
        $rootScope.sensores["/pir"] = data.evento;
      }
      localFactory.set("sensores",$rootScope.sensores);
    }
  });

  $rootScope.socket    = socket;
  $rootScope.atualizar = function(){
    $rootScope.socket.emit('statusSensoresServer',{senha:$rootScope.server.senha});
  }
})

.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    '*://*:*/**',
    'http://*:*/**',
  ]);
  
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.sensores', {
    url: '/sensores',
    views: {
      'tab-sensores': {
        templateUrl: 'templates/tab-sensores.html',
        controller: 'SensoresCtrl'
      }
    }
  })

  .state('tab.server', {
      url: '/server',
      views: {
        'tab-server': {
          templateUrl: 'templates/tab-server.html',
          controller: 'ServerCtrl'
        }
      }
    })
   
  .state('tab.cameras', {
    url: '/cameras',
    views: {
      'tab-cameras': {
        templateUrl: 'templates/tab-cameras.html',
        controller: 'CamerasCtrl'
      }
    }
  })

  .state('crud', {
        url: '/crud/:edit',
        controller: 'CrudCamerasCtrl',
        templateUrl: 'templates/crud-camera.html'
  })

  .state('view', {
        url: '/view/:index',
        controller: 'ViewCamerasCtrl',
        templateUrl: 'templates/view-camera.html'
  }); 
  ;



  $urlRouterProvider.otherwise('/tab/sensores');
});
