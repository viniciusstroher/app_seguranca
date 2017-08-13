angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats,$timeout) {

  $scope.server = {};
  $scope.server.porta = 10000;
  $scope.server.senha = "teste";
  $scope.runServer = function(){
    navigator.httpd.startHttpd($scope.server.porta,$scope.server.senha);
    $timeout(function(){
      WatchJS.watch(window.httpd, "contador", function(prop, action, newvalue, oldvalue) {
        console.log("Novo request:",window.httpd.requests[window.httpd.ultimaUri][window.httpd.requests[window.httpd.ultimaUri].length-1]);
      });
    },1000);
  }

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
