define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/admin/doctors/index.html',
    'models/doctorModel',
    'collections/doctors',
    'biz/imageManager',
    'utils/extensions/updatingCollectionView',
    'views/admin/doctors/doctorItem',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, DoctorModel, doctors, imageManager, UpdatingCollectionView, DoctorItemView) {

        var View = Backbone.View.extend({
            collection:doctors,
            template : _.template(html),
            events:{
                'click .navItem' : "onNavigateTo"
            },

            initialize:function () {

                // setup collections view
                this._mapCollectionView = new UpdatingCollectionView({
                    collection           : this.collection,
                    childViewConstructor : DoctorItemView,
                    childViewTagName     : 'tr'
                });

                // fetch data
                this.collection.fetch({ cache: false });
            },

            render:function (eventName) {

                this.$el.html(html);
                this._mapCollectionView.el = this.$('.doctorsContainer');
                this._mapCollectionView.render();
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });