angular.module('Competence', []).factory('Competence', ['$http', function($http) {  
    function Competence(compData) {
        if (compData) {
            this.setData(compData);
        }
        // Some other initializations related to comp
    };
    Competence.prototype = {
        setData: function(compData) {
            angular.extend(this, compData);
        },
        delete: function() {
            $http.delete('ourserver/books/' + compId);
        },
        update: function() {
            $http.put('ourserver/books/' + compId, this);
        },
        isAvailable: function() {
            if (!this.comp.stores || this.comp.stores.length === 0) {
                return false;
            }
            return this.comp.stores.some(function(store) {
                return store.quantity > 0;
            });
        }
    };
    return Competence;
}]);