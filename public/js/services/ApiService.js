angular.module("ApiService", []).factory("Api", function($http){


  var getAllCompetences = function() {
        $http({
            method: 'GET',
            url: '/competences'         
        })
        .success(function(data){
            return data;
        });
  };


  var search = function(query, next){

        $http({
            method: 'POST',
            url: '/search',
            data: {"query" : query}         
        })
        .success(function(data){
            next(data);
        });
    };





/*
  var queryAuthors = function(next){
    //use a callback instead of a promise
    authorResource.query({}, function(results){
      var out = [];
      //Underscore's "each" method
      _.each(results,function(result){
          //using our Author prototype above
          out.push(Author(result));
      });
      next(result);
    });
  }
  */



  return {
    competences: getAllCompetences,
    search: search
  }
});
