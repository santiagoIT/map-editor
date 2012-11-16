define([
    'Underscore',
    'backbone',
    'models/serviceModel'
], function(_, Backbone, Model){

    var Collection = Backbone.Collection.extend({

        model: Model,
        url : 'api/services'
    });
    return new Collection;
});