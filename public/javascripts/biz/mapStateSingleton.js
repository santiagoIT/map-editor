define([
    'jquery',
    'Underscore',
    'biz/mapStateModel'
],
    function ($, _, MapStateModel) {

        var singleton = new MapStateModel();

        return singleton;
    });