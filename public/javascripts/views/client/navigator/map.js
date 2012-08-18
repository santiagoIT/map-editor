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

            initialize:function (model, maps) {

                this.model = model;
                this.maps = maps;
                var mapId = this.model.get('currentMapId');
                if (mapId){
                    this.onCurrentMapChanged();
                }
                this.bindTo(this.model, 'change:currentMapId', this.onCurrentMapChanged);
                this.bindTo(this.model, 'change:transitionTo', this.onTransitionTo);
                this.bindTo(this.model, 'change:pathFind', this.onPathFind);
            },

            render:function () {
                // get canvas context
                var ctx = this.el.getContext('2d');

                if (!this.map){
                    return;
                }

                var margins = this.map.getMargins();
                var columnQty = this.map.get('x');
                var rowQty = this.map.get('y');
                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                // highlight kiosk if this is our map
                var kioskInfo = this.model.get('kioskInfo');
                if (kioskInfo && kioskInfo.mapId === this.map.get('_id'))
                {
                    var node = kioskInfo.node;
                    if (node){
                        ctx.fillStyle = "rgb(19,159,119)";
                        ctx.fillRect(node.y * columnWidth + margins.left, node.x * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }
            },

            onTransitionTo : function(){
                var info = this.model.get('transitionTo');
                if (!info){
                    return;
                }
                var self = this;
                this.$el.fadeOut('slow').promise().then(function(){
                    self.model.showMap(info.mapId);
                    self.$el.fadeIn('slow', function(){info.callback();});
                });
            },

            onPathFind : function(){

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
                var path = finder.findPath(node.x, node.y, target.x, target.y, grid);
                if (path) {
                    path.splice(0, 1);
                    path.splice(-1, 1);
                }
            },

            onCurrentMapChanged:function(){
                var id = this.model.get('currentMapId');
                console.log('mapid: ' + id);
                this.map = this.maps.get(id);
                if (!this.map){
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