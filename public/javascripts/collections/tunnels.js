define([
    'Underscore',
    'backbone',
    'models/tunnelModel'
], function(_, Backbone, Map){

    var Collection = Backbone.Collection.extend({

        model: Map,
        url : 'api/tunnels'
    });
    return new Collection;
});