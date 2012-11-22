define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // grid layout
            title:'',
            description:'',
            'floorDescription' :''
        },
        urlRoot:'api/services',
        idAttribute: "_id"
    });

    // You usually don't return a model instantiated
    return Model;
});