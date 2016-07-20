module.factory('CepService', function($http) {

    var getCep = function(model) {
      return $http({
        url: "http://viacep.com.br/ws/" + model.endereco + "/json",
        method: "get"
      });
    };
    return {
      getCep: getCep
    };
  });


module.factory('LatLongService', function($http){

    var getLatLong = function(model){
      return $http({
        url: "http://maps.google.com/maps/api/geocode/json?address="+ model.endereco + "&sensor=false&region=$region",
        method: "get"
      });
    };
    return {
      getLatLong: getLatLong
    };
});