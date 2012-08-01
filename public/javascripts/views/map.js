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
            $nodeInfo : null,
            nodeInfoView : null,

            events:{
                'click' : "onCanvasClick",
                'mousemove' : "onCanvasMouseMove",
                'mousedown' : "onCanvasMouseDown",
                'mouseup' : "onCanvasMouseUp",
                'mouseout' : "onCanvasMouseOut"
            },

            initialize:function (model, state, nodeInfoView) {
                this.model = model;
                this.state = state;
                this.nodeInfoView = nodeInfoView;

                // bind events
                this.state.on('change:targetNode', this.doPathfinding, this);
                this.state.on('change:markerNode change:targetNode', this.nodeInfoView.showNode, this.nodeInfoView);

                this.model.on('change:rows change:columns', this.render, this);
                this.model.on('change:top change:left change:bottom change:right', this.render, this);
                this.model.on('change:blockedNodes', this.render,  this);
                this.model.on('change:imageName', this.onImageNameChanged, this);
                this.state.on('change:targetNode change:markerNode', this.render, this);

                // get canvas context
                this.ctx = this.el.getContext('2d');
            },

            onImageNameChanged : function(model, imageName) {
                var url =  'https://s3.amazonaws.com/itworks.ec/mapeditor/images/' + imageName;
                // set background
                this.$el.css('background-image', 'url("' + url + '")'); // Set source path
                this.render();

                // get image
                var image = new Image();
                var self = this;
                image.onload = function() {
                    self.$el.attr('height', this.height).attr('width', this.width);
                    self.render();
                }
                image.src = 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/' + imageName;
            },

            render:function () {

                console.log('map.render');

                // clear canvas
                this.ctx.clearRect(0,0, this.$el.width(), this.$el.height());

                var margins = this.model.getMargins();

                var columnQty = this.model.get('columns');
                var rowQty = this.model.get('rows');

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
                var markerNode = this.state.get('markerNode');
                if (markerNode) {
                    this.ctx.fillStyle = "rgba(0,0,255,0.5)";
                    this.ctx.fillRect(markerNode.row*columnWidth+margins.left, markerNode.column*rowHeight+margins.top, columnWidth, rowHeight);
                }
                // pathfinding target?
                var target = this.state.get('targetNode');
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

                return this;
            },

            highlight : function(node) {

                var columnQty = this.model.get('columns');
                var rowQty = this.model.get('rows');

                var margins = this.model.getMargins();
                var rowHeight = (this.$el.height()-(margins.top+margins.bottom))/rowQty;
                var columnWidth = (this.$el.width()-(margins.left + margins.right))/columnQty;

                this.ctx.fillStyle = "rgba(20,60,80, 0.9)";
                this.ctx.fillRect(node.row*columnWidth+margins.left, node.column*rowHeight+margins.top, columnWidth, rowHeight);
            },

            getMatrixPosition : function(clickX, clickY){
                var columnQty = this.model.get('columns');
                var rowQty = this.model.get('rows');
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
                switch(this.state.get('editorMode')){
                    case 'markerLocation':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        if (node) {
                            this.state.set('markerNode', {row:node.row, column: node.column});
                        }
                        break;

                    case 'pathfinding':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        if (node) {
                            this.state.set('targetNode', node);
                          //  this.nodeInfoView.showNode(node);
                        }
                        break;

                    case 'nodeInfo':
                        node = this.getMatrixPosition(e.pageX, e.pageY);
                        this.nodeInfoView.showNode(node);
                        break;
                }
            },

            onCanvasMouseMove : function(e) {
                if (this.state.get('editorMode') === 'toggleNode') {
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
                if (this.state.get('editorMode') === 'toggleNode'){
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

                var node = this.state.get('markerNode');
                var target = this.state.get('targetNode');
                if (!(node && target)){
                    return;
                }

                var grid = new PF.Grid(this.model.get('columns'), this.model.get('rows'));
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
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return CanvasMapView;
    });