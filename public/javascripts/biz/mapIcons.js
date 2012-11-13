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

    return {
        drawKiosk : function(ctx, x, y) {
            ctx.drawImage(imgKiosk, x-imgKioskWidth*0.5, y-imgKioskHeight*0.5);
        },

        drawTarget : function(ctx, x, y) {
            ctx.drawImage(imgTarget, x-imgTargetWidth*0.5, y-imgTargetHeight*0.5);
        }
    };
});