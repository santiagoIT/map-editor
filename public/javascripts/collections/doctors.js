define([
    'Underscore',
    'backbone',
    'models/doctorModel'
], function(_, Backbone, Model){

    var Collection = Backbone.Collection.extend({

        model: Model,
        url : 'api/doctors',

        comparator: function( collection ){
            return( collection.get( 'lastName' ) );
        }
    });
    return new Collection;
});