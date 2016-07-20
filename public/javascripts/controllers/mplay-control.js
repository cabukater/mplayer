  angular.module('Locadora',[]).run(function($rootScope) {
      $rootScope.titulo = 'Locadora de Filmes';
    })


.service('BuscarFilmeAPI' ,function($http, $q){
  var servico = this;
  servico.Buscar = function (sNome){
    var resultado = $q.defer();

    var urlAPI = 'http://essearch.allocine.net/br/autocomplete?q=' + sNome;
     $http.get(urlAPI).then(function(resposta){
          var lista = resposta.data.map (function(filmeAPI){
            return{
              titulo: (filmeAPI.title1) ? filmeAPI.title1 : filmeAPI.title2,
              urlCapa: filmeAPI.thumbnail,
              infoAdicional : filmeAPI.metadata.map(function(metadata){
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

.controller('ListaFilmeController', function(BuscarFilmeAPI){
   var ctrl = this;
   ctrl.titulo = 'Encontre seu filme';
   ctrl.textoBusca = null;
   ctrl.Buscar = function (){
    BuscarFilmeAPI.Buscar (ctrl.textoBusca).then(function(lista){
       ctrl.lista = lista;
       console.log(lista)
    })

   }
})



