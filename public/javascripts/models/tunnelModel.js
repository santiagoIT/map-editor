define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            name:'',
            description:''
        },
        urlRoot:'api/tunnels',
        idAttribute: "_id"
    });

    // You usually don't return a model instantiated
    return Model;
});