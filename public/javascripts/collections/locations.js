define([
    'Underscore',
    'backbone',
    'models/locationModel'
], function(_, Backbone, Map){

    var LocationCollection = Backbone.Collection.extend({

        model: Map,
        url : 'api/locations',

        comparator: function( collection ){
            return( collection.get( 'name' ) );
        }
    });
    return new LocationCollection;
});