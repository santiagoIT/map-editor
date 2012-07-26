define([
    'jquery',
    'Underscore',
    'backbone',
    'pathfinder'
],
    function ($, _, Backbone, PF) {

        var CanvasMapView = Backbone.View.extend({
            tagName: 'canvas',
            ctx : null,
            path : null,

            events:{
                'click' : "onCanvasClick",
                'mousemove' : "onCanvasMouseMove",
                'mousedown' : "onCanvasMouseDown",
                'mouseup' : "onCanvasMouseUp",
                'mouseout' : "onCanvasMouseOut"
            },

            initialize:function (model, state) {
                this.model = model;
                this.state = state;

                // bind events
                this.model.on('change', this.render, this);

                // bind events
                this.model.on('GridSizeChanged', this.refresh, this);
                this.model.on('DataChanged', this.refresh, this);
                this.model.on('gridLayoutChanged', this.refresh, this);
                this.model.on('change:targetNode', this.refresh, this);
                this.model.on('change:blockedNodes', this.refresh,  this);

                // bind events
                this.model.on('change:targetNode', this.doPathfinding, this);

                // get canvas context
              //  var canvas = this.$canvas.get(0);
                this.ctx = this.el.getContext('2d');


            },

            render:function () {
                // size canvas
                this.$el.attr('height', this.model.get('imageHeight')).attr('width', this.model.get('imageWidth'));

                // set background
                this.$el.css('background-image', 'url("https://s3.amazonaws.com/itworks.ec/mapeditor/images/' + this.model.get('imageName') + '")'); // Set source path

                this.refresh();

                return this;
            },

            refresh : function(){

                console.log('refreshhed');

                // clear canvas
                this.ctx.clearRect(0,0, this.$el.width(), this.$el.height());

                var margins = this.model.getMargins();

                var columnQty = this.model.get('columnCount');
                var rowQty = this.model.get('rowCount');

                var rowHeight = (this.$el.height()-(margins.top+margins.bottom))/rowQty;
                var columnWidth = (this.$el.width()-(margins.left + margins.right))/columnQty;

                // draw grid lines
                this.ctx.strokeStyle = '#0f0'; // red
                this.ctx.lineWidth   = 1;
                for (var i = 0; i < rowQty; i++) {
                    for (var j=0; j < columnQty; j++){
                        this.ctx.strokeRect(j*columnWidth+margins.left, i*rowHeight+margins.top, columnWidth, rowHeight);
                    }
                }

                // draw marker
                var markerNode = this.model.get('markerNode');
                if (markerNode) {
                    this.ctx.fillStyle = "rgba(0,0,255,0.5)";
                    this.ctx.fillRect(markerNode.row*columnWidth+margins.left, markerNode.column*rowHeight+margins.top, columnWidth, rowHeight);
                }
                // pathfinding target?
                var target = this.model.get('targetNode');
                if (target) {
                    this.ctx.fillStyle = "rgba(0,255,0,0.5)";
                    this.ctx.fillRect(target.row*columnWidth+margins.left, target.column*rowHeight+margins.top, columnWidth, rowHeight);
                }

                // blocked nodes
                var nodes = this.model.get('blockedNodes');
                this.ctx.fillStyle = "rgba(100,100,100, 0.75)";
                for(var key in nodes){
                    var node = nodes[key];
                    this.ctx.fillRect(node.row*columnWidth+margins.left, node.column*rowHeight+margins.top, columnWidth, rowHeight);
                }

                // path
                if (this.path){
                    for (var key in this.path){
                        this.highlight({row:this.path[key][1], column:this.path[key][0]});
                    }
                }
            },

            highlight : function(node) {

                var columnQty = this.model.get('columnCount');
                var rowQty = this.model.get('rowCount');

                var margins = this.model.getMargins();
                var rowHeight = (this.$el.height()-(margins.top+margins.bottom))/rowQty;
                var columnWidth = (this.$el.width()-(margins.left + margins.right))/columnQty;

                this.ctx.fillStyle = "rgba(20,60,80, 0.9)";
                this.ctx.fillRect(node.row*columnWidth+margins.left, node.column*rowHeight+margins.top, columnWidth, rowHeight);
            },

            getMatrixPosition : function(clickX, clickY){
                var columnQty = this.model.get('columnCount');
                var rowQty = this.model.get('rowCount');
                var margins = this.model.getMargins();
                var rowHeight = (this.$el.height()-(margins.top+margins.bottom))/rowQty;
                var columnWidth = (this.$el.width()-(margins.left + margins.right))/columnQty;

                var x = clickX-(this.$el.offset().left+margins.left);
                var y = clickY-(this.$el.offset().top+margins.top);

                var row = Math.floor(x / columnWidth);
                var column = Math.floor(y / rowHeight);

                // in bounds?
                if (row >= rowQty || column >= columnQty || row <0 || column < 0) {
                    return null;
                }

                return {
                    row : row,
                    column : column
                };
            },


            onCanvasClick : function(e){

                var node;
                switch(this.state.getEditorMode()){
                    case 'markerLocation':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        if (node) {
                            this.model.setMarkerLocation(node.row, node.column);
                            this.displayNodeInfo(node);
                        }
                        break;

                    case 'pathfinding':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        if (node) {
                            this.model.set('targetNode', node);
                            this.displayNodeInfo(node);
                        }
                        break;

                    case 'nodeInfo':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        this.displayNodeInfo(node);
                        break;
                }
            },

            onCanvasMouseMove : function(e) {
                if (this.state.getEditorMode() === 'toggleNode') {
                    if (this._mouseDown !== undefined){
                        var node = this.getMatrixPosition(e.pageX, e.pageY);
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
                if (this.state.getEditorMode() === 'toggleNode'){
                    var node = this.getMatrixPosition(e.pageX, e.pageY);
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
                this.path = finder.findPath(node.column, node.row, target.column, target.row, grid);
                if (this.path){
                    this.path.splice(0,1);
                    this.path.splice(-1,1);
                }
            },

            displayNodeInfo : function(node) {
             /*   if (node) {
                    this.jqueryMap.$nodeInfo.html('['+node.column + ','+node.row+']')
                }
                else {
                    this.jqueryMap.$nodeInfo.html('-');
                } */
            }


        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return CanvasMapView;
    });