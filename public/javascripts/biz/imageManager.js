define(function () {
    var s3Root = 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/';

    return {
        getUrl:function (imageName) {
            return s3Root + imageName;
        },

        getS3Root:function(){
            return s3Root;
        }
    };
});