define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'biz/imageManager',
    'biz/kioskHelper',
    'pathfinder',
    'biz/mapIcons',
    'models/mapModel'
],
    function ($, _, Backbone, toIntroNavigator, imageManager, kioskHelper, PF, mapIcons, MapModel) {

        var View = Backbone.View.extend({
            events:{
                'click' : "onCanvasClick"
            },
            tagName:'canvas',
            id:'mapCanvas',
            destinations: [],
            finalDestinationReached:false,

            initialize:function (model, maps, locations) {

                // options
                this.settings = {
                    mapsShowHotspots : kioskHelper.getValueFromLocalStorage('mapsShowHotspots', "false"),
                    mapsShowClosestClickTarget : kioskHelper.getValueFromLocalStorage('mapsShowClosestClickTarget', "false")
                }

                imageManager.setRunLocally(true);

                this.model = model;
                this.maps = maps;
                var mapId = this.model.get('currentMapId');
                if (mapId) {
                    this.onCurrentMapChanged();
                }
                this.mapModel = new MapModel({_id:mapId});
                this.mapModel.fetch({async:false});

                this.bindTo(this.model, 'change:currentMapId', this.onCurrentMapChanged);
                this.bindTo(this.model, 'change:transitionTo', this.onTransitionTo);
                this.bindTo(this.model, 'change:pathFind', this.onPathFind);
                this.bindTo(this.model, 'destinationNodeReached', this.onDestinationReached);

                this.hotspots = locations.where({mapId:mapId});

                // get canvas context
                this.ctx = this.el.getContext('2d');

                this.toIntroNavigator = toIntroNavigator;

                this.$el.addClass('clickable');
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

                // highlight PF
                // path
                if (this.path) {
                    if (!this.finalDestinationReached && this.nodeCounter >= this.path.length-1) {

                        window.clearInterval(this.timerID);

                        // finished a PF leg, did we complete journey?
                        var
                            journey = this.model.get('journey'),
                            journeyNode = this.model.get('currentJourneyNode');

                        // destination reached?
                        if (journeyNode >= journey.length-1) {
                            this.finalDestinationReached = true;
                        }
                        this.nodeCounter = this.path.length -1;

                        this.showPath(columnQty, rowQty, margins);
                        this.model.trigger('PF_completed');
                    }
                    else {
                        this.showPath(columnQty, rowQty, margins);
                    }
                }

                // show hotspots
                if (this.settings.mapsShowHotspots === 'true' && this.hotspots.length>0) {
                    _.each(this.hotspots, function(hotspot) {
                        var node = hotspot.get('node');
                        mapIcons.drawHotspot(self.ctx, node.x * columnWidth + margins.left+columnWidth*0.5, node.y * rowHeight + margins.top+rowHeight*0.5);
                    });
                }

                if (this.settings.mapsShowClosestClickTarget === 'true' && this.closestHotSpot) {
                    var node = this.closestHotSpot.get('node');
                    if (node) {
                        mapIcons.drawTarget(this.ctx, node.x * columnWidth + margins.left+columnWidth*0.5, node.y * rowHeight + margins.top+rowHeight*0.5);
                    }
                }

                // highlight kiosk if this is our map
                var kioskInfo = this.model.get('kioskInfo');
                if (kioskInfo && kioskInfo.mapId === this.map.get('_id')) {
                    var node = kioskInfo.node;
                    if (node) {
                        mapIcons.drawKiosk(this.ctx, node.x * columnWidth + margins.left+columnWidth*0.5, node.y * rowHeight + margins.top+rowHeight*0.5);
                    }
                }

                // highlight reached destinations
                if (this.destinations.length > 0){
                    _.each(this.destinations, function(entry){
                        mapIcons.drawTarget(self.ctx, entry.info.node.x * columnWidth + margins.left+columnWidth*0.5, entry.info.node.y * rowHeight + margins.top+rowHeight*0.5);
                    });
                }

                return this;
            },

            showPath:function(columnQty, rowQty, margins){
                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                mapIcons.drawPath(this.ctx, this.nodeCounter, this.path, rowHeight, columnWidth, margins);
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
                this.toIntroNavigator.startCounting();
                this.destinations.push(entry);
                var timerId = window.setInterval(function(){
                    window.clearInterval(timerId);
                    // remove from list
                    index = _.indexOf(self.destinations, entry);
                    self.destinations.splice(index,1);
                    delete self.path;
                    self.path = null;
                    self.render();
                    self.toIntroNavigator.startCounting();
                },10000);
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
                        if (self.nodeCounter < self.path.length-1) {
                            self.nodeCounter++;
                        }
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
                image.onerror = function() {
                    var fallbackUrl = 'images/common/missingMap.png';
                    // fallback to local image
                    image.src = fallbackUrl;
                    // set background
                    self.$el.css('background-image', 'url("' + fallbackUrl + '")'); // Set source path
                };
                image.src = url;
            },

            onCanvasClick : function(event) {
                var node = mapIcons.getNodeFromMouseCoordinates(this.mapModel, this.$el, event.pageX, event.pageY);
                if (!node || !this.hotspots) {
                    return;
                }

                // abort if PF underway...
                var journey = this.model.get('journey');
                if (journey) {
                    return;
                }

                // check all nodes and find the closest one
                var closestHotSpot = null;
                _.each(this.hotspots, function(hotspot) {
                    // deltas
                    var
                        dX = Math.abs(hotspot.get('node').x - node.x),
                        dY = Math.abs(hotspot.get('node').y - node.y);

                    if (!closestHotSpot) {
                        closestHotSpot = {
                            hotspot:hotspot,
                            dX : dX,
                            dY : dY
                        };
                        return;
                    }

                    // build sum
                    if ((dX + dY) < (closestHotSpot.dX+closestHotSpot.dY)) {
                        closestHotSpot = {
                            hotspot:hotspot,
                            dX : dX,
                            dY : dY
                        };
                    }
                });

                if (closestHotSpot) {
                    if (this.settings.mapsShowClosestClickTarget === 'true') {
                        console.log('pathfinding skipped. Set "mapsShowClosestClickTarget" to off.');
                        this.closestHotSpot = closestHotSpot.hotspot;
                        this.render();
                    }else {
                        this.trigger('displayLocationInfo', closestHotSpot.hotspot);
                    }
                }
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });