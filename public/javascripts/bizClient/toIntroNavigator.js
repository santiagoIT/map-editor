define([
    'jquery',
    'Underscore',
    'backbone',
    'biz/kioskHelper',
    'text!views/client/common/toIntroModal.html'
],
    function ($, _, Backbone, kioskHelper, modalHtml) {

       var
           _secsToWait = 100, // number of seconds
           _counter,
           _timerId,
           _$modal = null,
           _routeToNavigateTo = '',
           _additionalHomeRoutes = [],
           _$countdownText = null;

        // allow secs to wait override
        _secsToWait = parseInt(kioskHelper.getValueFromLocalStorage('toIntroTimerAt', "100"));
      //  _secsToWait = 12;
        console.log('_secsToWait', _secsToWait);

       var startCounting = function() {
           if (!_timerId) {
               _timerId = setInterval(onTick, 1000);
           }

           if (_$modal) {
               _$modal.modal('hide');
           }

           _counter = _secsToWait;
       };

        var onTick = function() {
            _counter--;

            var $modal = null;

            if (_counter == 10 && !isHomeRoute()) {

                // show modal
                var self = this;
                // show modal
                _$modal = $(modalHtml);
                _$countdownText = _$modal.find('span');

                _$modal.modal('show');
                _$modal.on('hidden', function () {
                    _$modal.remove();
                    _$modal = null;
                    _$countdownText = null;


                    if (_counter <= 0) {
                        navigate();
                    }
                    else {
                        startCounting();
                    }
                });
            }

            if (_counter <= 0) {

                if (!isHomeRoute()) {
                    _$modal.modal('hide'); // navigate();
                }
                else {
                    // just reset counter until a change happens
                    _counter = _secsToWait;
                    console.log('skipped because on home route');
                }

                return;
            }

            if (_$countdownText) {
                _$countdownText.text(_counter);
            }

        };

        var navigate = function() {
            _counter = _secsToWait;

            require(['itworks.app'], function (app) {
                // hide any modals
                $('.modal').modal('hide');
                app.getRouter().navigate(_routeToNavigateTo, {trigger:true});
            });
        };

        var isHomeRoute = function() {
            if (!window.location.hash) {
                return true;
            }

            return _additionalHomeRoutes.indexOf(window.location.hash) != -1;
        };

        var exports = {
            startCounting : startCounting,
            setRouteToNavigateTo : function(route) {
                _routeToNavigateTo = route;
            },

            addHomeRoute : function (route) {
                _additionalHomeRoutes.push(route);
            }
        };

        return exports;
    }
);