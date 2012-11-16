define([
    'libs/jquery.iframe-transport/jquery.iframe-transport'
    ],
    function () {

    return {
        uploadImages : function($form, callback) {
            $.ajax('api/uploadmapimage', {
                type:"POST",
                data:$("input", $form).serializeArray(),
                files:$("input:file", $form),
                dataType: 'json',
                iframe:true,
                processData:false
            })
                .done(function (data) {
                    // handle failure
                    if (data.error) {
                        callback(data);
                        return;
                    }

                    // all went well
                    callback(null, data, $form);
                });
        }
    };
});