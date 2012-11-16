define([
    'Underscore',
    'backbone',
    'models/doctorModel'
], function(_, Backbone, Model){

    var Collection = Backbone.Collection.extend({

        model: Model,
        url : 'api/doctors'
    });
    return new Collection;
});