define([
    'jquery',
    'Underscore',
    'backbone',
    'views/map.canvas',
    'views/map.canvas.nodeinfo',
    'require',
    'text!views/node-editor.html',
    'models/mapModel',
    'collections/maps',
    'biz/mapCanvasState',
    'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js'
    ],
    function($, _, Backbone, CanvasMapView, NodeInfoView, require, html, MapModel, maps, state){

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
            'click [name="editor-mode"]' : "onEditorModeSwitched"
        },

        jqueryMap:{},

        initialize : function(mapid) {
            this.$el.html(html);

            var
                self = this;

            this.model = new MapModel({id:mapid});
            this.model.fetch();

            // nodeInfo view
            var nodeInfoView = new NodeInfoView();
            $('#canvasContainer').append(nodeInfoView.el);

            this.canvasView = new CanvasMapView(this.model, state, nodeInfoView);
            $('#canvasContainer').append(this.canvasView.el);

            // set queryMap
            this.jqueryMap.$btnHome = $('#btnHome');
            this.jqueryMap.$nodeInfo = $('#nodeInfo');
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

            // event handlers
            this.jqueryMap.$btnHome.on('click', function(){
                self.navigateHome();
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
            this.model.blockAll();
        },

        clearAll : function(){
            this.model.clearAll();
        },

        navigateHome : function() {
            require(['itworks.app'], function(app){
                app.Router.navigate('', {trigger:true});
            });
        },

        onEditorModeSwitched : function(e){
            var editorMode = $("input:radio[name=editor-mode]:checked").val();
            state.setEditorMode(editorMode);
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
        }
    });
    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return NodeEditorView;
});