define(function () {
    var
        imgKioskSrc = '/images/common/kiosk.png',
        imgTargetSrc = '/images/common/target.png',
        imgKioskWidth, imgKioskHeight,
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
        }
    };
});