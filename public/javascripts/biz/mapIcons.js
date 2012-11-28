define(function () {
    var
        imgKioskSrc = '/images/common/kiosk.png',
        imgTargetSrc = '/images/common/target.png',
        imgHotspotSrc = '/images/common/hotspot.png',
        imgKioskWidth, imgKioskHeight,
        imgHotspotWidth, imgHotspotHeight,
        imgTargetWidth, imgTargetHeight;

    var imgKiosk = new Image();
    imgKiosk.onload = function () {
        imgKioskWidth = this.width;
        imgKioskHeight = this.height;
    }
    imgKiosk.src = imgKioskSrc;

    var imgTarget = new Image();
    imgTarget.onload = function () {
        imgTargetWidth = this.width;
        imgTargetHeight = this.height;
    }
    imgTarget.src = imgTargetSrc;

    var imgHotspot = new Image();
    imgHotspot.onload = function () {
        imgHotspotWidth = this.width;
        imgHotspotHeight = this.height;
    }
    imgHotspot.src = imgHotspotSrc;

    var fnNodeToCoordinates = function(node, rowHeight, columnWidth, margins) {
        if (!node) {
            return {x:0, y:0};
        }
        return {
            x : node[0] * columnWidth + margins.left+columnWidth*0.5,
            y : node[1] * rowHeight + margins.top+rowHeight*0.5
        }
    }

    return {
        drawKiosk : function(ctx, x, y) {
            ctx.drawImage(imgKiosk, x-imgKioskWidth*0.5, y-imgKioskHeight*0.5);
        },

        drawTarget : function(ctx, x, y) {
            ctx.drawImage(imgTarget, x-imgTargetWidth*0.5, y-imgTargetHeight*0.5);
        },

        drawHotspot : function(ctx, x, y) {
            ctx.drawImage(imgHotspot, x-imgHotspotWidth*0.5, y-imgHotspotHeight*0.5);
        },

        drawPath : function(ctx, startIndex, path, rowHeight, columnWidth, margins) {

            var lastNode = fnNodeToCoordinates(path[startIndex], rowHeight, columnWidth, margins);
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.moveTo(lastNode.x,lastNode.y);
            ctx.lineWidth = 5;

            for (var i = startIndex-1; i >= 0; i--) {
                var pt = fnNodeToCoordinates(path[i], rowHeight, columnWidth, margins);
                ctx.lineTo(pt.x,pt.y);
            }
            ctx.stroke();
        },

        getNodeFromMouseCoordinates : function (map, $el, clickX, clickY) {
            var columnQty = map.get('x');
            var rowQty = map.get('y');
            var margins = map.getMargins();
            var rowHeight = ($el.height() - (margins.top + margins.bottom)) / rowQty;
            var columnWidth = ($el.width() - (margins.left + margins.right)) / columnQty;

            var x1 = clickX - ($el.offset().left + margins.left);
            var y1 = clickY - ($el.offset().top + margins.top);

            var x = Math.floor(x1 / columnWidth);
            var y = Math.floor(y1 / rowHeight);

            // in bounds?
            if (y >= rowQty || x >= columnQty || x1 < 0 || y1 < 0) {
                return null;
            }

            return {
                x:x,
                y:y
            };
        }
    };
});