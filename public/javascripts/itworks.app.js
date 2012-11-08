define([
    'jquery',
    'Underscore',
    'backbone'
    ],function($, _, Backbone){

    var
        _router = null;

    return {
        getRouter : function() {
            return _router;
        },
        setRouter : function(router){
            _router = router;
        }
    }
});