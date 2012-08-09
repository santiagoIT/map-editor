define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // true when navigating. Will influence UI
            navigating :  false,
            currentMapId : null,
        },

        initialize : function(){
        },

        showMap : function(id) {
            this.set('currentMapId', id);
        },

        navigateJourney : function(path, callback){
            this.set('navigating', true);

            // callback wraper
            var wrapper = function(){
                callback();
                this.set('navigating', false);
            }

            // TODO: execute
        }
    });
    // You usually don't return a model instantiated
    return Model;
});