    
var BuscarFilmeAPI = angular.module('BuscarFilmeAPI', []);

BuscarFilmeAPI.factory('BuscarFilmeAPI' ,function($http, $q){
  var servico = this;
  servico.Buscar = function (sNome){
    var resultado = $q.defer();

    var urlAPI = 'http://essearch.allocine.net/br/autocomplete?q=' + sNome;

     $http.get(urlAPI).then(function(resposta){
          var lista = resposta.data.map (function(filmeAPI) {
            return{
              titulo: (filmeAPI.title1) ? filmeAPI.title1 : filmeAPI.title2,
              urlCapa: filmeAPI.thumbnail,
              infoAdicional : filmeAPI.metadata.map(function(metadataAPI){
                return{ 
                       legenda: metadataAPI.property,
                       descricao: metadataAPI.value
                  }
               
              })              
           }
          });

          resultado.resolve(lista);

     }, function(){
         resultado.reject()

    });
     return resultado.promise;

   
  }
})