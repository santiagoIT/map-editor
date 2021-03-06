define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/maps/index.html',
    'models/mapModel',
    'collections/maps',
    'biz/imageManager',
    'utils/extensions/updatingCollectionView',
    'views/admin/maps/mapItem',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps, imageManager, UpdatingCollectionView, MapItemView) {

        var MapsView = Backbone.View.extend({
            collection:maps,
            template : _.template(html),
            events:{
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {

                // setup collections view
                this._mapCollectionView = new UpdatingCollectionView({
                    collection           : this.collection,
                    childViewConstructor : MapItemView,
                    childViewTagName     : 'tr'
                });

                // fetch data
                this.collection.fetch({ cache: false });
            },

            render:function (eventName) {

                this.$el.html(html);
                this._mapCollectionView.el = this.$('.theMaps');
                this._mapCollectionView.render();
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return MapsView;
    });