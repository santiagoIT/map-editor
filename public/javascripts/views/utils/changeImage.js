define([
    'jquery',
    'text!views/utils/changeImage.html',
    'biz/imageUploader'
],
    function ($, html, imageUploader) {
        return function (folder, fieldname, callback) {
            var $modal = $(html).appendTo('body');
            $modal
                .modal('show')
                .on('hidden', function () {
                    $modal.remove();
                });

            // set form attributes
            $modal.find('input:file').attr('name', fieldname);
            $modal.find('input:hidden').attr('name', 'path_' + fieldname);
            $modal.find('input:hidden').val(folder);

            $modal.on('submit', function(){
                var $form = $modal.find('form');
                imageUploader.uploadImages($form,
                    function(err, data, $form){
                        callback(err, data, $form);
                        $modal.modal('hide');
                    }
                );

                return false;
            });
        }
    }
);
