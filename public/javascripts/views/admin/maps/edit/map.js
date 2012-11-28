define([
    'jquery',
    'Underscore',
    'backbone',
    'pathfinder',
    'collections/locations',
    'biz/mapStateSingleton',
    'biz/kioskHelper',
    'biz/imageManager',
    'biz/mapIcons'
],
    function ($, _, Backbone, PF, locations, mapState, kioskHelper, imageManager, mapIcons) {

        var MapView = Backbone.View.extend({
            tagName:'canvas',
            ctx:null,
            path:null,
            $nodeInfo:null,

            events:{
                'click':"onCanvasClick",
                'mousemove':"onCanvasMouseMove",
                'mousedown':"onCanvasMouseDown",
                'mouseup':"onCanvasMouseUp",
                'mouseout':"onCanvasMouseOut"
            },

            initialize:function (model) {
                this.model = model;

                // bind events
                this.bindTo(mapState, 'change:targetNode', this.doPathfinding);

                this.bindTo(this.model, 'change:x change:y', this.render);
                this.bindTo(this.model, 'change:top change:left change:bottom change:right', this.render);
                this.bindTo(this.model, 'change:blockedNodes', this.render);
                this.bindTo(this.model, 'change:imageName', this.onImageNameChanged);
                this.bindTo(mapState, 'change:editorMode change:markerNode change:targetNode change:showGrid change:showHotSpots change:showBlockedTiles change:selectedNode', this.render);

                // locations
                this.bindTo(locations, 'all', this.render);
                locations.fetch();

                // get canvas context
                this.ctx = this.el.getContext('2d');

                // model might be fetched by now
                var imageName = this.model.get('imageName');
                if (imageName && imageName.length > 0){
                    this.onImageNameChanged(this.model, imageName);
                }
            },

            onImageNameChanged:function (model, imageName) {

                console.log('onImageNameChanged');

                var url = imageManager.getS3Url(imageName);
                // set background
                this.$el.css('background-image', 'url("' + url + '")'); // Set source path
                this.render();

                // get image
                var image = new Image();
                var self = this;
                image.onload = function () {
                    self.$el.attr('height', this.height).attr('width', this.width);
                    self.render();
                }
                image.src = url;
            },

            render:function () {

                console.log('map.render');

                // clear canvas
                this.ctx.clearRect(0, 0, this.$el.width(), this.$el.height());

                var margins = this.model.getMargins();

                var columnQty = this.model.get('x');
                var rowQty = this.model.get('y');

                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                var node;

                // draw grid lines
                if (mapState.get('showGrid')) {
                    this.ctx.strokeStyle = '#0f0'; // red
                    this.ctx.lineWidth = 1;
                    for (var i = 0; i < rowQty; i++) {
                        for (var j = 0; j < columnQty; j++) {
                            this.ctx.strokeRect(j * columnWidth + margins.left, i * rowHeight + margins.top, columnWidth, rowHeight);
                        }
                    }
                }

                // draw marker
                var
                    markerNode = mapState.get('markerNode'),
                    kioskInfo = kioskHelper.getKioskLocation();
                if (markerNode) {

                    mapIcons.drawKiosk(this.ctx, markerNode.x * columnWidth + margins.left + columnWidth*0.5, markerNode.y * rowHeight + margins.top+rowHeight*0.5);
                }
                // pathfinding target?
                var target = mapState.get('targetNode');
                if (target) {
                    mapIcons.drawTarget(this.ctx, target.x * columnWidth + margins.left + columnWidth*0.5, target.y * rowHeight + margins.top+rowHeight*0.5);
                }

                // blocked nodes
                if (mapState.get('showBlockedTiles')) {
                    var nodes = this.model.get('blockedNodes');
                    this.ctx.fillStyle = "rgba(100,100,100, 0.75)";
                    for (var key in nodes) {
                        var node = nodes[key];
                        this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }

                // path
                if (this.path && this.path.length > 0) {

                    mapIcons.drawPath(this.ctx, this.path.length-1, this.path, rowHeight, columnWidth, margins);
                }

                // hotspots
                if (mapState.get('showHotSpots')) {
                    var arLocations = locations.where({mapId:this.model.get('_id')});
                    for (var i in arLocations) {
                        node = arLocations[i].get('node');
                        this.ctx.fillStyle = "rgba(255,0,0,0.5)";
                        this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }

                node = mapState.get('selectedNode');
                if (node){
                    this.ctx.fillStyle = "rgb(255,255,0)";
                    this.ctx.fillRect(node.x * columnWidth + margins.top, node.y * rowHeight + margins.left, columnWidth, rowHeight);
                }

                if (kioskInfo && kioskInfo.mapId === this.model.get('_id'))
                {
                    node = kioskInfo.node;
                    if (node){
                        this.ctx.fillStyle = "rgb(19,159,119)";
                        this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }

                return this;
            },

            highlight:function (node) {

                var columnQty = this.model.get('x');
                var rowQty = this.model.get('y');

                var margins = this.model.getMargins();
                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                this.ctx.fillStyle = "rgba(20,60,80, 0.9)";
                this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
            },

            onCanvasClick:function (e) {

                var
                    node;

                switch (mapState.get('editorMode')) {
                    case 'markerLocation':
                        node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                        if (node) {
                            mapState.set('markerNode', {x:node.x, y:node.y});
                        }
                        break;

                    case 'pathfinding':
                        node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                        if (node) {
                            mapState.set('targetNode', node);
                        }
                        break;

                    case 'nodeInfo':
                        node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                        mapState.set('selectedNode', node);
                        break;

                    case 'setKioskLocation':
                        node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                        kioskHelper.setKioskLocation(this.model.get('_id'), node);
                        this.render();
                        break;
                }
            },

            onCanvasMouseMove:function (e) {
                if (mapState.get('editorMode') === 'toggleNode') {
                    if (this._mouseDown !== undefined) {
                        var node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                        if (node) {
                            if (this._mouseDown) {
                                this.model.clearNode(node.x, node.y);
                            }
                            else {
                                this.model.blockNode(node.x, node.y);
                            }
                        }
                    }
                }
            },

            onCanvasMouseDown:function (e) {
                if (mapState.get('editorMode') === 'toggleNode') {
                    var node = mapIcons.getNodeFromMouseCoordinates(this.model, this.$el, e.pageX, e.pageY);
                    if (node) {
                        this._mouseDown = this.model.toggleNode(node.x, node.y);
                    }
                }
            },

            onCanvasMouseUp:function (e) {
                if (this._mouseDown !== undefined) {
                    delete this._mouseDown;
                }
            },

            onCanvasMouseOut:function (e) {
                if (this._mouseDown) {
                    delete this._mouseDown;
                }
            },

            doPathfinding:function () {

                var node = mapState.get('markerNode');
                var target = mapState.get('targetNode');
                if (!(node && target)) {
                    return;
                }

                var grid = new PF.Grid(this.model.get('x'), this.model.get('y'));
                // block cells
                var blockedNodes = this.model.get('blockedNodes');
                for (var i in blockedNodes) {
                    grid.setWalkableAt(blockedNodes[i].x, blockedNodes[i].y, false);
                }
                var finder = new PF.AStarFinder();
                this.path = finder.findPath(node.x, node.y, target.x, target.y, grid);
                if (this.path) {
                    this.path.splice(0, 1);
                    this.path.splice(-1, 1);
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return MapView;
    });