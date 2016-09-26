// swaps type url with type-headline
angular.module('TypeFilter', []).filter('TypeFilter', function() {
    
    //extracts type as last term and filters type map
    return function(url) {
        var type = url.substr(url.lastIndexOf('/') + 1);
        if(typeMap.hasOwnProperty(type)){
            return typeMap[type];
        } else {
            return "Element";
        }
    };
});

var typeMap = {
    "LOCrel": "Child",
    "hasDefinedLevel": "Level"

};


function getTypeOfURL(url){
  return url.substr(url.lastIndexOf('/') + 1);
}