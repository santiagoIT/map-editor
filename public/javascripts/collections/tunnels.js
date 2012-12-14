define([
    'Underscore',
    'backbone',
    'models/tunnelModel'
], function(_, Backbone, Map){

    var Collection = Backbone.Collection.extend({

        model: Map,
        url : 'api/tunnels',

        comparator: function( collection ){
            return( collection.get( 'name' ) );
        }
    });
    return new Collection;
});