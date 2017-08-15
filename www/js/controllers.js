angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$timeout) {})

.controller('ChatsCtrl', function($scope, Chats,$timeout,$http) {
  $scope.contaNOIP         = "viniciusfs:995865Aa@";
  $scope.dnsNOIP           = "testesmart.ddns.net";
  $scope.atualizarDNS      = {estado:false,availableOptions: [
      {id: true, name: 'SIM'},
      {id: false, name: 'NÃO'},
      
  ]};
  $scope.atualizarDNSTempo = 5000;//ms

  $scope.atualizaDNS = function(){
    if($scope.atualizarDNS.estado){
      $http({
        method: 'GET',
        url: 'http://ipv4.myexternalip.com/json'
      }).then(function successCallback(response) {
        console.log(response.data.ip);
        $http({
          method: 'GET',
          url: 'http://'+$scope.contaNOIP+'dynupdate.no-ip.com/nic/update?hostname='+$scope.dnsNOIP+'&myip='+response.data.ip
        }).then(function successCallback(response) {
            console.log(response.data);

            $timeout(function(){
              $scope.atualizaDNS();
            },$scope.atualizarDNSTempo);
            
          }, function errorCallback(response) {
            
            $timeout(function(){
              $scope.atualizaDNS();
            },$scope.atualizarDNSTempo);
          
          });

        }, function errorCallback(response) {
          $timeout(function(){
            $scope.atualizaDNS();
          },$scope.atualizarDNSTempo);
          
        });
    }else{
      $timeout(function(){
        $scope.atualizaDNS();
      },$scope.atualizarDNSTempo);
    }
  }
  $scope.atualizaDNS();
  //CHECAR SE JA EXISTE A WINDOW.HTTPD.REQUESTS NO INIT QUANDO TIVER EM BACKGROUND
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
