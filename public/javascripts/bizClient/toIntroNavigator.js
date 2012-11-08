define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

       var
           _secsToWait = 25, // number of seconds
           _counter,
           _timerId;

       var startCounting = function() {
           if (!_timerId) {
               _timerId = setInterval(onTick, 1000);
           }

           _counter = _secsToWait;
       };

        var onTick = function() {
            _counter--;
            if (_counter < 0) {
                if (window.location.hash) {
                    navigate();
                }
                else {
                    // just reset counter until a change happens
                    _counter = _secsToWait;
                }
            }
        };

        var navigate = function() {
            _counter = _secsToWait;

            require(['itworks.app'], function (app) {
                app.getRouter().navigate('', {trigger:true});
            });
        };

        var exports = {
            startCounting : startCounting
        };

        return exports;
    }
);