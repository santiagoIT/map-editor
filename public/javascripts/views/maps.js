define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/maps.html',
    'models/mapModel',
    'collections/maps',
    'libs/jquery.iframe-transport/jquery.iframe-transport'
],
    function ($, _, Backbone, require, html, MapModel, maps) {

        var MapsView = Backbone.View.extend({
            el:$('#itworks-app'),
            collection:maps,
            events:{
                'click #btnHome':"navigateHome",
                'click #btnSaveMap':"saveMap",
                'click #btnEditMap':"onEditMap"
            },

            jqueryMap:{},

            initialize:function () {
                console.log('MapsView initialize');
                this.$el.html(html);

                var
                    self = this;

                // set queryMap
                this.jqueryMap.$btnHome = $('#btnHome');
                this.jqueryMap.$maps = $('#maps');

                // event handlers
                this.jqueryMap.$btnHome.on('click', function () {
                    self.navigateHome();
                });

                // bind events
                this.collection.on('all', this.render, this);

                // fetch data
                this.collection.fetch();
            },

            render:function () {
                // reset select
                this.jqueryMap.$maps.empty();

                // insert collection
                for (var i = 0; i < this.collection.length; i++) {
                    var map = this.collection.at(i);
                    console.log(map);
                    this.jqueryMap.$maps.append($('<option>', { value:map.get('_id') })
                        .text(map.get('name')));
                }
            },

            navigateHome:function () {
                require(['itworks.app'], function (app) {
                    app.Router.navigate('', {trigger:true});
                });
            },

            saveMap:function () {
                var self = this;
                var persistMap = function (imageName, $form) {

                    var map = new MapModel();

                    map.set('name', $form.find('#name').val());
                    map.set('imageName', imageName);

                    map.save();

                    self.collection.add(map);
                }

               this.uploadImage($('#frmNewMap'), persistMap);

               return false;
            },

            uploadImage:function ($form, callback) {

                $.ajax('api/uploadmapimage', {
                    type:"POST",
                    data:$("input:text", $form).serializeArray(),
                    files:$("input:file", $form),
                    dataType: 'json',
                    iframe:true,
                    processData:false
                }).done(function (data) {
                        callback(data.imagename, $form);
                    });
                // TODO handle failure
            },

            onEditMap:function () {
                var id = this.jqueryMap.$maps.find('option:selected').val();
                require(['itworks.app'], function (app) {
                    app.Router.navigate('node-editor/' + id, {trigger:true});
                });
                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return MapsView;
    });