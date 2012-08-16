define([
    'jquery',
    'Underscore',
    'backbone',
    'biz/imageManager'
],
    function ($, _, Backbone, imageManager) {

        var View = Backbone.View.extend({
            events:{
            },
            tagName:'canvas',

            initialize:function (model, maps) {

                this.model = model;
                this.maps = maps;
                this.bindTo(this.model, 'change:currentMapId', this.onCurrentMapChanged);

            },

            render:function () {
                // get canvas context
                var ctx = this.el.getContext('2d');

                if (!this.map){
                    return;
                }

                var margins = this.map.getMargins();
                var columnQty = this.map.get('columns');
                var rowQty = this.map.get('rows');
                var rowHeight = (this.$el.height() - (margins.top + margins.bottom)) / rowQty;
                var columnWidth = (this.$el.width() - (margins.left + margins.right)) / columnQty;

                // highlight kiosk if this is our map
                var kioskInfo = this.model.get('kioskInfo');
                if (kioskInfo && kioskInfo.mapId === this.map.get('_id'))
                {
                    var node = kioskInfo.node;
                    console.log('is my map!');
                    console.log(kioskInfo);

                    if (node){
                        ctx.fillStyle = "rgb(19,159,119)";
                        ctx.fillRect(node.row * columnWidth + margins.left, node.column * rowHeight + margins.top, columnWidth, rowHeight);
                    }
                }
            },

            onCurrentMapChanged:function(){
                var id = this.model.get('currentMapId');
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