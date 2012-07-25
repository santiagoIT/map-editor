define([
    'jquery',
    'Underscore',
    'backbone',
    'require',
    'text!views/node-editor.html',
    'models/mapModel',
    'collections/maps',
    'biz/node-editor-canvas-helper',
    'pathfinder',
    'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js'
    ],
    function($, _, Backbone, require, html, MapModel, maps, canvasHelper, PF){

    var NodeEditorView = Backbone.View.extend({
        el: $('#itworks-app'),
        events : {
            'click #btnHome' : "navigateHome",
            'click btnSave' : "onSaveMap",
            'click #btnChangeMesh' : "changeMesh",
            'click #btnChangeMargins' : "changeMargins",
            'click #btnBlockAll' : "blockAll",
            'click #btnClearAll' : "clearAll",
            'click #canvas' : "onCanvasClick",
            'mousemove #canvas' : "onCanvasMouseMove",
            'mousedown #canvas' : "onCanvasMouseDown",
            'mouseup #canvas' : "onCanvasMouseUp",
            'mouseout #canvas' : "onCanvasMouseOut",
            'click [name="editor-mode"]' : "onEditorModeSwitched"
        },

        jqueryMap:{},
        _canvasHelper : canvasHelper,
        _editorMode : null,

        initialize : function(mapid) {
            console.log('editor-view initialize');
            this.$el.html(html);

            var
                self = this;

            this.model = new MapModel({id:mapid});
            this.model.fetch();

            console.log('Fetched model: ' + mapid);
            console.log(this.model);

            // set queryMap
            this.jqueryMap.$btnHome = $('#btnHome');
            this.jqueryMap.$canvas = $('#canvas');
            this.jqueryMap.$nodeInfo = $('#nodeInfo');
            this.jqueryMap.$marginTop = $('#marginTop');
            this.jqueryMap.$marginLeft = $('#marginLeft');
            this.jqueryMap.$marginBottom = $('#marginBottom');
            this.jqueryMap.$marginRight = $('#marginRight');
            this.jqueryMap.$columnCount = $('#columnCount');
            this.jqueryMap.$rowCount = $('#rowCount');

            // set form validate
            $('#frmGrid').validate({
                rules : {
                    columnCount : {required: true, number: true},
                    rowCount : {required: true, number: true}
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

            // size canvas
            this.jqueryMap.$canvas.attr('height', this.model.get('imageHeight')).attr('width', this.model.get('imageWidth'));

            // set background
            this.jqueryMap.$canvas.css('background-image', 'url("data/images/' + this.model.get('imageName') + '")'); // Set source path

            // init canvas helper
            this._canvasHelper.initialize(this.model, this.jqueryMap.$canvas);

            // set editor mode
            this.onEditorModeSwitched();

            // bind events
            this.model.on('change:targetNode', this.doPathfinding, this);
            this.model.on('gridLayoutChanged', this.displayMapMetaData, this);

            this.displayMapMetaData();
        },


        render: function() {
            console.log('editor-view render');
            this._canvasHelper.refresh();
        },

        displayMapMetaData : function() {
            // display margins
            this.jqueryMap.$marginTop.val(this.model.get('top'));
            this.jqueryMap.$marginLeft.val(this.model.get('left'));
            this.jqueryMap.$marginBottom.val(this.model.get('bottom'));
            this.jqueryMap.$marginRight.val(this.model.get('right'));

            // grid size
            this.jqueryMap.$columnCount.val(this.model.get('columnCount'));
            this.jqueryMap.$rowCount.val(this.model.get('rowCount'));
        },

        doPathfinding : function() {
            var node = this.model.get('markerNode');
            var target = this.model.get('targetNode');
            if (!(node && target)){
                return;
            }

            var grid = new PF.Grid(this.model.get('columnCount'), this.model.get('rowCount'));
            // block cells
            var blockedNodes = this.model.get('blockedNodes');
            for (var i in blockedNodes){
                grid.setWalkableAt(blockedNodes[i].column, blockedNodes[i].row, false);
            }
            var finder = new PF.AStarFinder();
            var path = finder.findPath(node.column, node.row, target.column, target.row, grid);
            if (path){
                path.splice(0,1);
                path.splice(-1,1);
                for (var key in path){
                    this._canvasHelper.highlight({row:path[key][1], column:path[key][0]});
                }
            }
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

        displayNodeInfo : function(node) {
            if (node) {
                this.jqueryMap.$nodeInfo.html('['+node.column + ','+node.row+']')
            }
            else {
                this.jqueryMap.$nodeInfo.html('-');
            }
        },

        onCanvasClick : function(e){
            var node;
            switch(this._editorMode){
                case 'markerLocation':
                    node = this._canvasHelper.getMatrixPosition(e.pageX, e.pageY);
                    if (node) {
                        this.model.setMarkerLocation(node.row, node.column);
                        this.displayNodeInfo(node);
                    }
                    break;

                case 'pathfinding':
                    node = this._canvasHelper.getMatrixPosition(e.pageX, e.pageY);
                    if (node) {
                        this.model.set('targetNode', node);
                        this.displayNodeInfo(node);
                    }
                    break;

                case 'nodeInfo':
                    node = this._canvasHelper.getMatrixPosition(e.pageX, e.pageY);
                    this.displayNodeInfo(node);
                break;
            }
        },

        onCanvasMouseMove : function(e) {
            if (this._editorMode === 'toggleNode') {
                if (this._mouseDown !== undefined){
                    var node = this._canvasHelper.getMatrixPosition(e.pageX, e.pageY);
                    if (node) {
                        if (this._mouseDown) {
                            this.model.clearNode(node.row, node.column);
                        }
                        else {
                            this.model.blockNode(node.row, node.column);
                        }
                    }
                }
            }
        },

        onCanvasMouseDown : function (e) {
            if (this._editorMode === 'toggleNode'){
                var node = this._canvasHelper.getMatrixPosition(e.pageX, e.pageY);
                if (node) {
                    this._mouseDown = this.model.toggleNode(node.row, node.column);
                }
            }
        },

        onCanvasMouseUp : function(e) {
            if (this._mouseDown !== undefined){
                delete this._mouseDown;
            }
        },

        onCanvasMouseOut : function(e) {
            if (this._mouseDown){
                delete this._mouseDown;
            }
        },

        onEditorModeSwitched : function(e){
            this._editorMode = $("input:radio[name=editor-mode]:checked").val();
        },

        onSaveMap : function() {

            this.model.save();
        },

        changeMesh : function(){
            var columnCount = this.jqueryMap.$columnCount.val();
            var rowCount = this.jqueryMap.$rowCount.val();

            columnCount = parseInt(columnCount);
            rowCount = parseInt(rowCount);

            console.log(this);

            this.model.setGridSize(columnCount, rowCount);

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