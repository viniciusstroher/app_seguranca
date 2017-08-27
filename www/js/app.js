// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope,$timeout,$http,localFactory) {
  $rootScope.eventos        = [];
  $rootScope.sensores       = {};
  $rootScope.estadoServidor = false;

  $rootScope.atualizaEstadoServidor = function(){
    if(window.hasOwnProperty('httpd_server')){
      $rootScope.estadoServidor = window.httpd_server;
    }
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


  $rootScope.salvaRequest = function(){
    $rootScope.atualizaEstadoServidor();
    if(window.httpd){
        var chaves_array = Object.keys(window.httpd.requests);
       
        angular.forEach(chaves_array,function(v,k){
       
          if(angular.isArray(window.httpd.requests[v])){
            //VARRER TODO O ARRAY QUE TIVER NOTIFICACOES
            if(window.httpd.requests[v].length > 0){
              angular.forEach(window.httpd.requests[v],function(v2,k2){
                
                var novaReq           = window.httpd.requests[v].splice(k2,1).pop();
                var sensores          = localFactory.get("sensores");
                window.httpd.contador-=1;
                
                if(sensores){
                  if(!angular.isObject(sensores)){
                    sensores = {};
                  }
                  sensores[novaReq.uri] = novaReq;

                }else{
                  sensores[novaReq.uri] = novaReq;
                }

                $rootScope.eventos.unshift(novaReq);
                if($rootScope.eventos.length > 20){
                  $rootScope.eventos.splice(20,100);
                }
                
                localFactory.set("sensores",sensores);
                $rootScope.sensores = sensores;
                
              });
            }else{
              delete window.httpd.requests[v];
            }
          }
        });
        $timeout(function(){
          $rootScope.salvaRequest();
        },1000);
    }else{
      console.log("objeto HTTP ainda nao criado.")
    }
  }

  $rootScope.contaNOIP                = "viniciusfs:995865Aa@";
  $rootScope.dnsNOIP                  = "testesmart.ddns.net";
  $rootScope.atualizarDNSTempo        = 5000;//ms
  $rootScope.estado                   = {};
  $rootScope.estado.atualizarDNS      = true,
  $rootScope.estado.notificar         = false,
  
  $rootScope.atualizaDNS = function(){
    if($rootScope.estado.atualizarDNS){
      $http({
        timeout: 5000,
        method: 'GET',
        url: 'http://ipv4.myexternalip.com/json'
      }).then(function successCallback(response) {
        //console.log(response.data.ip);
        $http({
          timeout: 5000,
          method: 'GET',
          url: 'http://'+$rootScope.contaNOIP+'dynupdate.no-ip.com/nic/update?hostname='+$rootScope.dnsNOIP+'&myip='+response.data.ip
        }).then(function successCallback(response) {
            console.log(response);
            $timeout(function(){
              $rootScope.atualizaDNS();
            },$rootScope.atualizarDNSTempo);
            
          }, function errorCallback(response) {
            
            $timeout(function(){
              $rootScope.atualizaDNS();
            },$rootScope.atualizarDNSTempo);
          
          });

        }, function errorCallback(response) {
          $timeout(function(){
            $rootScope.atualizaDNS();
          },$rootScope.atualizarDNSTempo);
          
        });
    }else{
      $timeout(function(){
        $rootScope.atualizaDNS();
      },$rootScope.atualizarDNSTempo);
    }
  }
  

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $rootScope.salvaRequest();
    $rootScope.atualizaDNS();
    $rootScope.atualizaEstadoServidor();
  });


})

.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    '*://*:*/**',
    'http://*:*/**',
  ]);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/sensores');

});
