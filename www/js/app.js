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
    $rootScope.server.api       = "http://venizao.dlinkddns.com/seguranca";
    $rootScope.server.porta     = 10000;
    $rootScope.server.senha     = "teste";
    $rootScope.estado.notificar = false; 

    var configApp               = {};
    configApp.notificar         = $rootScope.estado.notificar;
    configApp.server_api        = $rootScope.server.api;  
    configApp.server_porta      = $rootScope.server.porta;
    configApp.server_senha      = $rootScope.server.senha;

    localFactory.set("configApp",configApp);
  }else{
    
    $rootScope.estado.notificar         = configApp.notificar;
    $rootScope.estado.startonboot       = configApp.startonboot;

    $rootScope.server                   = {};
    $rootScope.server.api               = configApp.server_api;
    $rootScope.server.porta             = configApp.server_porta;
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

})

.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider) {
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
          

      }); 
  ;



  $urlRouterProvider.otherwise('/tab/sensores');
});
