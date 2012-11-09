define([
    'jquery',
    'Underscore',
    'backbone',
    'views/maps/edit/map',
    'views/maps/edit/nodeinfo',
    'require',
    'text!views/maps/edit/edit.html',
    'models/mapModel',
    'collections/maps',
    'collections/locations',
    'biz/mapStateSingleton',
    'views/maps/edit/locations',
    'biz/imageManager',
    'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js',
    'libs/jquery.iframe-transport/jquery.iframe-transport',
    'libs/jquery-plugins/jquery-to-json'
    ],
    function($, _, Backbone, MapView, NodeInfoView, require, html, MapModel, maps, locations, mapState, LocationView, imageManager){

    var View = Backbone.View.extend({
        canvasView : null,
        template:_.template(html),
        events : {
            'click .navItem' : "onNavigateTo",
            'click .saveChanges' : "onSaveMap",
            'click #btnChangeMesh' : "changeMesh",
            'click #btnChangeMargins' : "changeMargins",
            'click #btnBlockAll' : "blockAll",
            'click #btnClearAll' : "clearAll",
            'click [name="editor-mode"]' : "onEditorModeSwitched",
            'click .editor-config' : "onEditorConfigChanged",
            'click .btnImageChange' : "onChangeMapImage",
            'click #btnSaveNewImage' : "onSaveNewMapImage",
            'click #btnSaveMapIcon' : "onSaveMapIconImage",
            'click #btnSaveMapMetaData' : "onSaveMapMetaData"
        },

        jqueryMap:{},

        initialize : function(mapid) {
            var
                self = this;

            // reset editor defaults
            mapState.set(mapState.defaults);

            this.model = new MapModel({_id:mapid});
            this.model.fetch({success:function(model, response){
                self.setupView(mapid);
            }});
        },

        setupView: function(mapid) {
            var
                self = this;
            console.log('setupView');
            console.log(this);

            this.render();
            var $container =  this.$('#canvasContainer');
            this.canvasView = new MapView(this.model);
            this.addChildView(this.canvasView);
            $container.append(this.canvasView.el);

            // nodeInfo view
            var nodeInfoView = new NodeInfoView();
            nodeInfoView.render();
            $container.append(nodeInfoView.el);

            // set queryMap
            this.jqueryMap.$marginTop = this.$('#marginTop');
            this.jqueryMap.$marginLeft = this.$('#marginLeft');
            this.jqueryMap.$marginBottom = this.$('#marginBottom');
            this.jqueryMap.$marginRight = this.$('#marginRight');
            this.jqueryMap.$x = this.$('#x');
            this.jqueryMap.$y = this.$('#y');

            // set form validate
            this.$('#frmGrid').validate({
                rules : {
                    x : {required: true, number: true},
                    y : {required: true, number: true}
                }
            });
            this.$('#frmMargins').validate({
                rules : {
                    marginLeft : {required: true, number: true},
                    marginTop : {required: true, number: true},
                    marginBottom : {required: true, number: true},
                    marginRight : {required: true, number: true}
                }
            });

            // set editor mode
            this.onEditorModeSwitched();

            this.bindTo(this.model, 'change:top change:left change:bottom change:right', this.displayMargins);
            this.bindTo(this.model, 'change:x change:y', this.displayGridSize);
            this.bindTo(this.model, 'change:name', this.render);

            this.displayMargins();
            this.displayGridSize();

            var locView = new LocationView(mapid);
            this.addChildView(locView);
            this.$('.locations').append(locView.el);
        },

        render: function() {
            var options = {
                map:this.model.toJSON()
            };

            var iconName = this.model.get('linkImageName');
            if (iconName){
                console.log('iconName: ' + iconName);
                options.mapIconImageUrl = imageManager.getS3Url(iconName);
                console.log('iconUrl: ' + options.mapIconImageUrl);
            }

            this.$el.html(this.template(options));
            return this;
        },

        displayMargins : function() {

            // display margins
            this.jqueryMap.$marginTop.val(this.model.get('top'));
            this.jqueryMap.$marginLeft.val(this.model.get('left'));
            this.jqueryMap.$marginBottom.val(this.model.get('bottom'));
            this.jqueryMap.$marginRight.val(this.model.get('right'));
        },

        displayGridSize : function() {

            // grid size
            this.jqueryMap.$x.val(this.model.get('x'));
            this.jqueryMap.$y.val(this.model.get('y'));
        },

        blockAll : function(){
            this.model.blockAllNodes();
        },

        clearAll : function(){
            this.model.clearAllNodes();
        },

        onEditorModeSwitched : function(e){
            var editorMode = this.$("input:radio[name=editor-mode]:checked").val();
            mapState.set('editorMode',editorMode);
        },

        onSaveMap : function() {
            this.model.save();
        },

        changeMesh : function(){
            var x = this.jqueryMap.$x.val();
            var y = this.jqueryMap.$y.val();

            x = parseInt(x);
            y = parseInt(y);

            this.model.setGridSize(x, y);

            return false;
        },

        changeMargins : function() {
            var top = this.jqueryMap.$marginTop.val();
            var left = this.jqueryMap.$marginLeft.val();
            var bottom = this.jqueryMap.$marginBottom.val();
            var right = this.jqueryMap.$marginRight.val();

            top = parseInt(top);
            left = parseInt(left);
            bottom = parseInt(bottom);
            right = parseInt(right);

            this.model.setMargins(top,left,bottom,right);

            return false;
        },

        onEditorConfigChanged : function(el){
            var $el = $(el.target);
            var name = $el.attr('name');
            if (name){
                mapState.set(name, $el.is(':checked'));
            }
        },

        onChangeMapImage : function(){
            this.$('.modal').modal('show');
        },

        onSaveNewMapImage : function(){
            var
                $form = $('#frmChangeImage'),
                self = this;

            $.ajax('api/uploadmapimage', {
                type:"POST",
                data:$("input:text", $form).serializeArray(),
                files:$("input:file", $form),
                dataType:'json',
                iframe:true,
                processData:false
            }).done(function (data) {
                    self.model.set('imageName', data.imagename);
                    self.model.save();
                    self.$('.modal').modal('hide');
                });
            return false;
        },

        onSaveMapIconImage : function(){
            var
                $form = $('#frmSetMapIcon'),
                self = this;

            $.ajax('api/uploadmapiconimage', {
                type:"POST",
                data:$("input:text", $form).serializeArray(),
                files:$("input:file", $form),
                dataType:'json',
                iframe:true,
                processData:false
            }).done(function (data) {
                    self.model.set('linkImageName', data.linkImageName);
                    self.model.save();
                });
            return false;
        },

        onSaveMapMetaData : function() {

            var data = $('#frmMapMetaData').toJSON();
            this.model.set(data);
            this.model.save();

            return false;
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return View;
});