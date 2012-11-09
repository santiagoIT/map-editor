define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/maps/index.html',
    'models/mapModel',
    'collections/maps',
    'biz/imageManager',
    'utils/extensions/updatingCollectionView',
    'views/maps/mapItem',
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

                console.log('UpdatingCollectionView: ');
                console.log(UpdatingCollectionView);


                this._mapCollectionView = new UpdatingCollectionView({
                    collection           : this.collection,
                    childViewConstructor : MapItemView,
                    childViewTagName     : 'tr'
                });

                // bind events
        //        this.bindTo(this.collection, 'reset', this.render);
        //        this.bindTo(this.collection, 'remove', this.removeMap);

                // fetch data
                this.collection.fetch();
            },



            render:function (eventName) {
//                console.log('Event name');
//                console.log(eventName);
//
//                // We keep track of the rendered state of the view
//                this._rendered = true;
//
//                // reset select
//                this.$el.html(this.template({s3Root: imageManager.getS3Root(), maps:this.collection.toJSON()}));


                $(this.el).empty();
                this.$el.html(html);

                // And here I use the template to render this object,
                // then take the rendered template
                // and append it to this view's element.
              //  $.tmpl(this.template, this.model.toJSON()).appendTo(this.el);

                this._mapCollectionView.el = this.$('.theMaps');
                this._mapCollectionView.render();
            },

            removeMap:function(map) {
                console.log('map erased:');
                console.log(map);

                var viewToRemove = _(this._donutViews).select(function(cv) { return cv.model === model; })[0];
                this._donutViews = _(this._donutViews).without(viewToRemove);

                if (this._rendered) $(viewToRemove.el).remove();
            },

            onEditMap:function (el) {
                var id = $(el.target).attr('data-id');
                require(['itworks.app'], function (app) {
                    app.getRouter().navigate('map_edit/' + id, {trigger:true});
                });
                return false;
            },

            onConfirmDelete : function(el) {
                var idToDelete = $(el.target).attr('data-id');
                if (idToDelete){
                    var self = this;
                    var model = this.collection.get(idToDelete);
                    if (model) {
                        require(['biz/deleteConfirm'], function(lib){
                            lib('Map: ' + model.get('name'), function(model){
                                model.destroy({success:function(){
                                    self.collection.remove(model);
                                }});
                            }, model);
                        });
                    }
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return MapsView;
    });