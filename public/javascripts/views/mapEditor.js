define([
    'jquery',
    'Underscore',
    'backbone',
    'views/map',
    'views/nodeinfo',
    'require',
    'text!views/mapEditor.html',
    'models/mapModel',
    'collections/maps',
    'collections/locations',
    'biz/mapStateSingleton',
    'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js'
    ],
    function($, _, Backbone, MapView, NodeInfoView, require, html, MapModel, maps, locations, mapState){

    var NodeEditorView = Backbone.View.extend({
        el: $('#itworks-app'),
        canvasView : null,
        events : {
            'click #btnHome' : "navigateHome",
            'click #btnSave' : "onSaveMap",
            'click #btnChangeMesh' : "changeMesh",
            'click #btnChangeMargins' : "changeMargins",
            'click #btnBlockAll' : "blockAll",
            'click #btnClearAll' : "clearAll",
            'click [name="editor-mode"]' : "onEditorModeSwitched",
            'click #btnCreateLocation'  : "onCreateLocation",
            'click .editor-config' : "onEditorConfigChanged"
        },

        jqueryMap:{},

        initialize : function(mapid) {
            this.$el.html(html);

            var
                self = this;

            // reset editor defaults
            mapState.set(mapState.defaults);

            this.model = new MapModel({_id:mapid});
            this.model.fetch();

            // nodeInfo view
            var nodeInfoView = new NodeInfoView();
            $('#canvasContainer').append(nodeInfoView.el);

            this.canvasView = new MapView(this.model);
            $('#canvasContainer').append(this.canvasView.el);

            // set queryMap
            this.jqueryMap.$marginTop = $('#marginTop');
            this.jqueryMap.$marginLeft = $('#marginLeft');
            this.jqueryMap.$marginBottom = $('#marginBottom');
            this.jqueryMap.$marginRight = $('#marginRight');
            this.jqueryMap.$columns = $('#columns');
            this.jqueryMap.$rows = $('#rows');

            // set form validate
            $('#frmGrid').validate({
                rules : {
                    columns : {required: true, number: true},
                    rows : {required: true, number: true}
                }
            });
            $('#frmMargins').validate({
                rules : {
                    marginLeft : {required: true, number: true},
                    marginTop : {required: true, number: true},
                    marginBottom : {required: true, number: true},
                    marginRight : {required: true, number: true}
                }
            });

            // set editor mode
            this.onEditorModeSwitched();

            this.model.on('change:top', this.displayMapMetaData, this);
            this.model.on('change:left', this.displayMapMetaData, this);
            this.model.on('change:bottom', this.displayMapMetaData, this);
            this.model.on('change:right', this.displayMapMetaData, this);

            this.model.on('change:columns', this.displayGridSize, this);
            this.model.on('change:rows', this.displayGridSize, this);

            this.displayMapMetaData();
        },

        render: function() {
            console.log('editor-view render');
        },

        displayMapMetaData : function() {

            // display margins
            this.jqueryMap.$marginTop.val(this.model.get('top'));
            this.jqueryMap.$marginLeft.val(this.model.get('left'));
            this.jqueryMap.$marginBottom.val(this.model.get('bottom'));
            this.jqueryMap.$marginRight.val(this.model.get('right'));
        },

        displayGridSize : function() {

            // grid size
            this.jqueryMap.$columns.val(this.model.get('columns'));
            this.jqueryMap.$rows.val(this.model.get('rows'));
        },

        blockAll : function(){
            this.model.blockAllNodes();
        },

        clearAll : function(){
            this.model.clearAllNodes();
        },

        navigateHome : function() {
            require(['itworks.app'], function(app){
                app.Router.navigate('maps', {trigger:true});
            });
        },

        onEditorModeSwitched : function(e){
            var editorMode = $("input:radio[name=editor-mode]:checked").val();
            mapState.set('editorMode',editorMode);
        },

        onSaveMap : function() {
            this.model.save();
        },

        changeMesh : function(){
            var columns = this.jqueryMap.$columns.val();
            var rows = this.jqueryMap.$rows.val();

            columns = parseInt(columns);
            rows = parseInt(rows);

            this.model.setGridSize(columns, rows);

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

        onCreateLocation : function() {
            var self = this;
            var node = mapState.get('selected-node') || {row:0, column:0};
            // load location creator
            require(['modals/locationCreate/module', 'models/locationModel'], function(module, LocationModel) {

                module(self.model, node, function($form){
                    var location = new LocationModel();
                    location.set('name', $form.find('input[name="name"]').val());
                    location.set('description', $form.find('input[name="description"]').val());
                    location.set('mapId', self.model.get('_id'));
                    node.column = $form.find('input[name="column"]').val();
                    node.row = $form.find('input[name="row"]').val()
                    location.set('node', node);
                    location.save(null, {
                        success:function(model, response){
                            locations.add(location);
                        },
                        error : function(err){
                            // TODO:
                            throw(err);
                        }
                    });
                });
            });
            return false;
        },

        onEditorConfigChanged : function(el){
            var $el = $(el.target);
            var name = $el.attr('name');
            if (name){
                mapState.set(name, $el.is(':checked'));
            }
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return NodeEditorView;
});