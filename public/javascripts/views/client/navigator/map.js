define([
    'jquery',
    'Underscore',
    'backbone',
    'biz/imageManager',
    'pathfinder'
],
    function ($, _, Backbone, imageManager, PF) {

        var View = Backbone.View.extend({
            events:{
            },
            tagName:'canvas',
            id:'mapCanvas',
            destinations: [],
            finalDestinationReached:false,

            initialize:function (model, maps) {

                imageManager.setRunLocally(true);

                this.model = model;
                this.maps = maps;
                var mapId = this.model.get('currentMapId');
                if (mapId) {
                    this.onCurrentMapChanged();
                }
                this.bindTo(this.model, 'change:currentMapId', this.onCurrentMapChanged);
                this.bindTo(this.model, 'change:transitionTo', this.onTransitionTo);
                this.bindTo(this.model, 'change:pathFind', this.onPathFind);
                this.bindTo(this.model, 'destinationNodeReached', this.onDestinationReached);

                // get canvas context
                this.ctx = this.el.getContext('2d');
            },

            render:function () {

                if (!this.map) {
                    return;
                }

                var
                    self = this,
                    margins = this.map.getMargins(),
                    columnQty = this.map.get('x'),
                    rowQty = this.map.get('y'),
                    rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty,
                    columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                // clear canvas
                this.ctx.clearRect(0, 0, this.$el.width(), this.$el.height());

                // highlight kiosk if this is our map
                var kioskInfo = this.model.get('kioskInfo');
                if (kioskInfo && kioskInfo.mapId === this.map.get('_id')) {
                    var node = kioskInfo.node;
                    if (node) {
                        this.ctx.fillStyle = "rgb(19,159,119)";
                        this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }

                // highlight PF
                // path
                if (this.path) {
                    if (!this.finalDestinationReached && this.nodeCounter >= this.path.length) {

                        window.clearInterval(this.timerID);

                        // finished a PF leg, did we complete journey?
                        var
                            journey = this.model.get('journey'),
                            journeyNode = this.model.get('currentJourneyNode');

                        // destination reached?
                        if (journeyNode >= journey.length-1) {
                            this.finalDestinationReached = true;
                            this.nodeCounter = this.path.length -2;
                        }
                        else {
                            this.nodeCounter = this.path.length -1;
                        }

                        this.showPath(columnQty, rowQty, margins);
                        this.model.trigger('PF_completed');
                    }
                    else {
                        this.showPath(columnQty, rowQty, margins);
                    }
                }

                // highlight reached destinations
                if (this.destinations.length > 0){
                    _.each(this.destinations, function(entry){
                        self.ctx.fillStyle = "rgba(255,0,0," + entry.alpha + ")";
                        self.ctx.fillRect(entry.info.node.x * columnWidth + margins.left, entry.info.node.y * rowHeight + margins.top, columnWidth, rowHeight);
                    });
                }

                return this;
            },

            showPath:function(columnQty, rowQty, margins){
                var
                    alpha = 1;
                for (var i = this.nodeCounter; i >= 0; i--) {
                    this.highlight({x:this.path[i][0], y:this.path[i][1]}, alpha, columnQty, rowQty, margins);
                    alpha -= 0.02;
                }
            },

            highlight:function (node,alpha, columnQty, rowQty, margins) {
                if (!this.map) {
                    return;
                }

                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                this.ctx.fillStyle = "rgba(20,60,80," + alpha + ")";
                this.ctx.fillRect(node.x * columnWidth + margins.left, node.y * rowHeight + margins.top, columnWidth, rowHeight);
            },

            onDestinationReached : function() {
                var
                    info = this.model.get('destination-node'),
                    self = this,
                    index, entry;
                entry = {
                    info:info,
                    alpha:1
                };
                this.destinations.push(entry);
                var timerId = window.setInterval(function(){
                    entry.alpha -= 0.1;
                    if (entry.alpha <= 0.2){
                        window.clearInterval(timerId);
                        // remove from list
                        index = _.indexOf(self.destinations, entry);
                        self.destinations.splice(index,1);
                        delete self.path;
                        self.path = null;
                        self.render();
                        return;
                    }
                    self.render();
                },250);
            },

            onTransitionTo:function () {
                var info = this.model.get('transitionTo');
                if (!info) {
                    return;
                }

                delete this.path;
                this.path = null;

                var self = this;
                this.$el.fadeOut('slow').promise().then(function () {
                    self.model.showMap(info.mapId);
                    self.$el.fadeIn('slow', function () {
                        info.callback();
                    });
                });
            },

            onPathFind:function () {
                console.log('onPathFind');
                this.path = null;
                this.finalDestinationReached = false;
                var node = this.model.get('pathFrom');
                var target = this.model.get('pathTo');
                if (!(node && target)) {
                    return;
                }
                var mapId = this.model.get('currentMapId');
                var map = this.maps.get(mapId);

                var grid = new PF.Grid(map.get('x'), map.get('y'));
                // block cells
                var blockedNodes = map.get('blockedNodes');
                for (var i in blockedNodes) {
                    grid.setWalkableAt(blockedNodes[i].x, blockedNodes[i].y, false);
                }
                var finder = new PF.AStarFinder();
                this.path = finder.findPath(node.x, node.y, target.x, target.y, grid);
                if (this.path) {
                    // set timer
                    var self = this;
                    this.nodeCounter = 0;
                    this.timerID = window.setInterval(function () {
                        self.render();
                        self.nodeCounter++;
                    }, 200);

                }
            },

            onCurrentMapChanged:function () {
                var id = this.model.get('currentMapId');
                this.map = this.maps.get(id);
                if (!this.map) {
                    return;
                }
                var imageName = this.map.get('imageName');
                var url = imageManager.getUrl(imageName);
                // set background
                this.$el.css('background-image', 'url("' + url + '")'); // Set source path

                // get image
                var image = new Image();
                var self = this;
                image.onload = function () {
                    self.$el.attr('height', this.height).attr('width', this.width);
                    self.render();
                }
                image.src = url;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });