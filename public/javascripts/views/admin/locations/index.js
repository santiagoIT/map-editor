define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/locations/index.html',
    'collections/locations',
    'collections/maps',
    'biz/imageManager',
    'utils/extensions/updatingCollectionView',
    'views/admin/locations/locationItem'
],
    function ($, _, Backbone, require, html, locations, maps, imageManager,UpdatingCollectionView, LocationItemView) {

        var View = Backbone.View.extend({
            collection:locations,
            events:{
                'click .navItem':"onNavigateTo"
            },

            initialize:function () {

                // load maps synchronously
                maps.fetch({async:false});

                // setup collections view
                this._collectionView = new UpdatingCollectionView({
                    collection           : this.collection,
                    childViewConstructor : LocationItemView,
                    childViewTagName     : 'tr',
                    childViewOptions     : {
                        maps : maps
                    }
                });

                this.collection.fetch({ cache: false });
            },

            render:function () {
                this.$el.html(html);
                this._collectionView.el = this.$('.servicesContainer');
                this._collectionView.render();
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });