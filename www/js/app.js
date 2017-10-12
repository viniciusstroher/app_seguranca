angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope,$timeout,$http,localFactory) {
  

   $rootScope.token = null;
   $rootScope.cli   = "web";

   if(window.cordova){
     if(ionic.Platform.isAndroid()){
      $rootScope.cli = "android";
     }

     if(ionic.Platform.isIOS()){
      $rootScope.cli = "ios";
     }

     var push = PushNotification.init({
      android: {
          senderID: 956432534015
      },
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      }
    });

    push.on('registration', function(data) {
      $rootScope.token = data.registrationId
    });

    push.on('notification', function(data) {
      console.log('notification',data);
    });

    push.on('error', function(e) {
      console.log(e.message);
    });
  }else{
    $rootScope.token = "web";
  }


  $rootScope.eventos        = [];
  $rootScope.sensores       = {};
  $rootScope.estado         = {};

  var cameras = localFactory.get("cameras");
  if(!cameras){
    localFactory.set("cameras",[{ws:"ws://venizao.dlinkddns.com:9001",camera:"casa"}]);
  }

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
    $rootScope.server.api       = "http://venizao.dlinkddns.com:10000/";
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

  $rootScope.conectado = false;
  $rootScope.socket    = null;

  $rootScope.inciarSocket = function(){
    var socket = io.connect($rootScope.server.api);

    socket.on('conectado', function (data) {
      console.log('conectado');
      $rootScope.conectado = true;
      socket.emit('enviaToken',{token: $rootScope.token,cli:$rootScope.cli});
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

    socket.on('disconnect', function() {
      $rootScope.conectado = false;
      console.log('desconectado');
    });
    $rootScope.socket    = socket;
  }
  
  $rootScope.inciarSocket();

  $rootScope.reconnect = function(){
    $rootScope.socket.disconnect();
    $rootScope.inciarSocket();
  }

   window.addEventListener("online", function(e) {
      $rootScope.reconnect();
   }, false);   
   
   window.addEventListener("offline", function(e) {
      if($rootScope.socket != null){
        $rootScope.socket.disconnect();
      }
   }, false); 



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
