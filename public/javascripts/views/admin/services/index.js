define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/services/index.html',
    'models/serviceModel',
    'collections/services',
    'biz/imageManager',
    'utils/extensions/updatingCollectionView',
    'views/admin/services/serviceItem',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, ServiceModel, services, imageManager, UpdatingCollectionView, ServiceItemView) {

        var View = Backbone.View.extend({
            collection:services,
            template : _.template(html),
            events:{
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {

                // setup collections view
                this._mapCollectionView = new UpdatingCollectionView({
                    collection           : this.collection,
                    childViewConstructor : ServiceItemView,
                    childViewTagName     : 'tr'
                });

                // fetch data
                this.collection.fetch({ cache: false });
            },

            render:function (eventName) {

                this.$el.html(html);
                this._mapCollectionView.el = this.$('.servicesContainer');
                this._mapCollectionView.render();
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });