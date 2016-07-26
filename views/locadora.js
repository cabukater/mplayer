<!DOCTYPE html>
<html ng-app="Locadora">
  <head>
 
    <title><%= title %></title>
    <link rel="stylesheet" href="/stylesheets/style.css" />
    <link rel="stylesheet" href="/javascripts/components/bootstrap/dist/css/bootstrap.css">
    <script src="/javascripts/components/angular/angular.js"></script>
      <script src="/javascripts/components/jquery/dist/jquery.js"></script>
   <!-- <script src="/javascripts/controllers/mplay-control.js"></script>-->
<script type="text/javascript">
    angular.module('Locadora',[]).run(function($rootScope) {
      $rootScope.titulo = 'Locadora de Filmes',
      $rootScope.layout = {
           exibeListaFilme: true,
           exibeDetalheFilme:false
      };
    })


.service('BuscarFilmeAPI' ,function($http, $q){
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

.controller('ListaFilmeController', function($rootScope,BuscarFilmeAPI){
   var ctrl = this;
   ctrl.titulo = 'Encontre seu filme';
   ctrl.textoBusca = null;
   ctrl.Buscar = function (){
    BuscarFilmeAPI.Buscar (ctrl.textoBusca).then(function(lista){
       ctrl.lista = lista;
       console.log(lista)
    })
  }

  ctrl.AbrirDetalheFilme = function (filme){
      $rootScope.$broadcast('AbrirFilme', filme);
  }
})

.controller ('DetalheFilmeController', function($rootScope){
       var ctrl = this;

      $rootScope.$on('AbrirFilme', function(evt, filme){
         ctrl.exibeDetalheFilme(filme);
      })

        ctrl.exibeDetalheFilme = function(filme){
           $rootScope.layout = {
              exibeListaFilme: false,
              exibeDetalheFilme:true
           }

           ctrl.filmeSelecionado = filme;
        }

        ctrl.voltarParaLista = function(filme){
           $rootScope.layout = {
              exibeListaFilme: true,
              exibeDetalheFilme:false
           }
}



})





</script>
  <style>
    ul { list-style-type: none;padding: 0px;margin: 0px; }
    ul li { margin: 5px 0px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="jumbotron">
      <h1>Locadora de Filmes</h1>

      <button class="btn btn-warning">
        Carrinho 
        <span class="badge">0</span>
      </button>

      <button class="btn btn-danger">
        Notificações
        <span class="badge">0</span>
      </button>
    </div>

    <div class="panel panel-primary" ng-show="layout.exibeListaFilme" ng-controller="ListaFilmeController as lf">
      <div class="panel-heading">{{lf.titulo }}</div>

      <div class="panel-body">
        <div  class="col-xs-12 col-md-8">
           <div class="input-group">
             <span class="input-group-btn">
               <button class="btn btn-default" type="button" ng-click="lf.Buscar();">Go!</button>
            </span>
            <input type="text" ng-model="lf.textoBusca" class="form-control" placeholder="Search for...">

            </div><!-- /input-group -->
         </div>

          <div  class="col-xs-12 col-md-8" ng-show="lf.lista.length > 0">
               <h3>Filmes Encontrados</h3>
               <ul>
                 <li ng-repeat= "filme in lf.lista"> 
                <img ng-src="{{filme.urlCapa}}">
                     {{filme.titulo}}
                     <button ng-click="lf.AbrirDetalheFilme(filme);">Abrir</button>
                 </li>

               </ul>

          </div>
      </div>


    </div>
  
   <div class="panel panel-primary" ng-show="layout.exibeDetalheFilme" ng-controller="DetalheFilmeController as df">
      <div class="panel-heading">{{df.filmeSelecionado.titulo }}</div>
      <div class="panel-body">

        <img ng-src="{{ df.filmeSelecionado.urlCapa }}">
        <ul>
              <li ng-repeat="info in df.filmeSelecionado.infoAdicional">{{ info.legenda }}  : {{ info.descricao }} </li>
        </ul>
         <button ng-click="df.voltarParaLista();">Voltar</button>
       
      </div>
  </div>

  </div>


</body>
</html>
