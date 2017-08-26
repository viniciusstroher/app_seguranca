angular.module('starter.services', [])
.factory('localFactory', function() {
    var pacote = "br.com.tcc_ads.view.";
    return {
        set: function(name, data) {
            localStorage.setItem(pacote + name, JSON.stringify(data));
            return true;
        },
        get: function(name) {
            try{
              
                return JSON.parse(localStorage.getItem(pacote + name));
            }catch(Exception){

                return false;
            }
        },
        delete: function(name) {
            return localStorage.removeItem(pacote + name);
        },
        clear: function() {
            return localStorage.clear();
        }
    };
});
