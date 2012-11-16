define([
    'Underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        defaults:{
            // grid layout
            firstName:'',
            lastName:'',
            speciality:'',
            details:''
        },
        urlRoot:'api/doctors',
        idAttribute: "_id"
    });

    // You usually don't return a model instantiated
    return Model;
});