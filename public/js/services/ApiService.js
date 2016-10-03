angular.module('ApiService', []).factory('ApiService', function($http){




  //get single Competence
  var getCompetence = function(id, callback){
    $http({
      method: 'POST',
      url: '/competencies',
      data: {"id" : id}         
    })
    .success(function(data){
      console.log("result"+ data[0]);
      callback(null, data);
    })
    .error(function (error, status){
      callback(error);
    });
  };

  //search
  var search = function(query, callback){
    $http({
      method: 'POST',
      url: '/search',
      data: {"query" : query}
    })
    .success(function(data){
      callback(null, data);
    })
    .error(function (error, status){
      callback(error);
    });
  };


  //submit URL for parsing data
  var submitURL = function(url, callback){
    $http({
      method: 'POST',
        url: '/submit',
        data: {"url" : url}    
    })
    .success(function(data){
      callback(null, data);
    })
    .error(function (error, status){
      callback(error);
    });
  };




  //Clear Database for Test
  var clearDB = function(callback){
    $http({
      method: 'DELETE',
      url: '/competencies'    
    })
    .success(function(data){
      callback(null, data);
    })
    .error(function (error, status){
      callback(error);
    });
  };

  //Fill Database for Test
  var fillDB = function(callback){
    $http({
      method: 'GET',
      url: '/submit/test'  
    })
    .success(function(data){
      callback(null, data);
    })
    .error(function (error, status){
      callback(error);
    });
  };



  return {
    competence: getCompetence,
    search: search,
    submitURL: submitURL,
    clearDB: clearDB,
    fillDB: fillDB
  }
});
