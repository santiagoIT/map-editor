define(function () {
    var
        s3Root = 'https://s3.amazonaws.com/itworks.ec/mapeditor/images/',
        runLocally = true;

    return {
        getUrl:function (imageName) {

            return this.getRoot() + imageName;
        },

        getRoot:function(){
            if (runLocally){
                return '/data/images/'
            }
            return s3Root;
        },

        setRunLocally : function(value){
            runLocally = value;
        },

        getS3Root : function(){
            return s3Root;
        },

        getS3Url : function(imageName) {
            return s3Root + imageName;
        }
    };
});