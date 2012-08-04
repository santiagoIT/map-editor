define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var locationModel = Backbone.Model.extend({
        defaults:{
            // grid layout
            name:'Name me',
            description:'Please provide',
            node : {
                column : 0,
                row : 0
            }
        },
        urlRoot:'api/locations',
        idAttribute: "_id"
    });

    // You usually don't return a model instantiated
    return locationModel;
});