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
    'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js'
    ],
    function($, _, Backbone, MapView, NodeInfoView, require, html, MapModel, maps, locations, mapState, LocationView){

    var View = Backbone.View.extend({
        canvasView : null,
        events : {
            'click .navItem' : "onNavigateTo",
            'click .saveChanges' : "onSaveMap",
            'click #btnChangeMesh' : "changeMesh",
            'click #btnChangeMargins' : "changeMargins",
            'click #btnBlockAll' : "blockAll",
            'click #btnClearAll' : "clearAll",
            'click [name="editor-mode"]' : "onEditorModeSwitched",
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
            this.jqueryMap.$columns = this.$('#columns');
            this.jqueryMap.$rows = this.$('#rows');

            // set form validate
            this.$('#frmGrid').validate({
                rules : {
                    columns : {required: true, number: true},
                    rows : {required: true, number: true}
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
            this.bindTo(this.model, 'change:columns change:rows', this.displayGridSize);

            this.displayMargins();
            this.displayGridSize();

            var locView = new LocationView(mapid);
            this.addChildView(locView);
            this.$('.locations').append(locView.el);
        },

        render: function() {
            console.log('editor-view render');
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
            this.jqueryMap.$columns.val(this.model.get('columns'));
            this.jqueryMap.$rows.val(this.model.get('rows'));
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
    return View;
});