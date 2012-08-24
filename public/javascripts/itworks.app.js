define([
    'jquery',
    'Underscore',
    'backbone'
    ],function($, _, Backbone){

    var
        _router = null;

    return {
        getRouter : function() {
            console.log('getRouter');
            console.log(_router);
            return _router;
        },
        setRouter : function(router){
            _router = router;
        }
    }
});