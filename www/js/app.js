// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$rootScope) {
  $rootScope.salvaRequest = function(){
    if(window.httpd){
      if(window.httpd.ultimaUri != ""){
        if(angular.isArray(window.httpd.requests[window.httpd.ultimaUri])){
          if(window.httpd.requests[window.httpd.ultimaUri].length > 0){
            var ultimoIndex = window.httpd.requests[window.httpd.ultimaUri].length-1;
            var novaReq     = window.httpd.requests[window.httpd.ultimaUri].splice(ultimoIndex,1);
            var req         = localFactory.get("requisicoes");
            
            if(req){
              if(!angular.isArray(req)){
                req = [];
              }
              req.push(novaReq);

            }else{
              req = [novaReq];
            }
            localFactory.set("requisicoes",req);
          }
        }
      }
    }else{
      console.log("objeto HTTP ainda nao criado.")
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

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
