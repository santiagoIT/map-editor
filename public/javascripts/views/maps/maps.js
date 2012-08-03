define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/maps/maps.html',
    'models/mapModel',
    'collections/maps',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps) {

        var MapsView = Backbone.View.extend({
            el:$('#itworks-app'),
            collection:maps,
            template : null,
            events:{
                'click .navItem' : "onNavigateTo",
                'click .edit':"onEditMap",
                'click .delete' : "onConfirmDelete"
            },
            s3Root : 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/',

            jqueryMap:{},

            initialize:function () {
                console.log('MapsView initialize');
                this.$el.html(html);

                var
                    self = this;

                // set queryMap
                this.jqueryMap.$btnHome = $('#btnHome');

                // event handlers
                this.jqueryMap.$btnHome.on('click', function () {
                    self.navigateHome();
                });

                // bind events
                this.collection.on('all', this.render, this);

                // fetch data
                this.collection.fetch();

                // compile template:
                this.template =  _.template(html);
            },

            render:function () {
                // reset select
                this.$el.html(this.template({s3Root: this.s3Root, maps:this.collection.toJSON()}));
            },

            onEditMap:function (el) {
                var id = $(el.target).attr('data-id');
                console.log('el:');
                console.log(el);
                require(['itworks.app'], function (app) {
                    app.Router.navigate('map_edit/' + id, {trigger:true});
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