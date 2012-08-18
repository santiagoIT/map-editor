define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            name:'',
            description:'',
            node1 : {
                x : 0,
                y : 0
            },
            node2 : {
                x : 0,
                y : 0
            }
        },
        urlRoot:'api/tunnels',
        idAttribute: "_id"
    });

    // You usually don't return a model instantiated
    return Model;
});