define(['pathfinder'], function(pathfinder) {
    return {
        ctx : null,
        model : null,
        $canvas : null,

        initialize : function(model, $canvas) {
            this.model = model;
            this.$canvas = $canvas;

            // bind events
            this.model.on('GridSizeChanged', this.refresh, this);
            this.model.on('DataChanged', this.refresh, this);
            this.model.on('gridLayoutChanged', this.refresh, this);
            this.model.on('change:targetNode', this.refresh, this);
            this.model.on('change:blockedNodes', this.refresh,  this);

            // get canvas context
            var canvas = this.$canvas.get(0);
            this.ctx = canvas.getContext('2d');

            this.refresh();
        },

        getMatrixPosition : function(clickX, clickY){
            var columnQty = this.model.get('columnCount');
            var rowQty = this.model.get('rowCount');
            var margins = this.model.getMargins();
            var rowHeight = (this.$canvas.height()-(margins.top+margins.bottom))/rowQty;
            var columnWidth = (this.$canvas.width()-(margins.left + margins.right))/columnQty;

            var x = clickX-(this.$canvas.offset().left+margins.left);
            var y = clickY-(this.$canvas.offset().top+margins.top);

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

        refresh : function(){

            // clear canvas
            this.ctx.clearRect(0,0, this.$canvas.width(), this.$canvas.height());

            var margins = this.model.getMargins();

            var columnQty = this.model.get('columnCount');
            var rowQty = this.model.get('rowCount');

            var rowHeight = (this.$canvas.height()-(margins.top+margins.bottom))/rowQty;
            var columnWidth = (this.$canvas.width()-(margins.left + margins.right))/columnQty;

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
        },

        highlight : function(node) {

            var columnQty = this.model.get('columnCount');
            var rowQty = this.model.get('rowCount');

            var margins = this.model.getMargins();
            var rowHeight = (this.$canvas.height()-(margins.top+margins.bottom))/rowQty;
            var columnWidth = (this.$canvas.width()-(margins.left + margins.right))/columnQty;

            this.ctx.fillStyle = "rgba(20,60,80, 0.9)";
            this.ctx.fillRect(node.row*columnWidth+margins.left, node.column*rowHeight+margins.top, columnWidth, rowHeight);
        }
    };
});