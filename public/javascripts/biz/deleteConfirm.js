define([
    'jquery',
    'text!biz/deleteConfirm.html'
],
    function ($, html) {
        return function (whatToDelete, callback, model) {
            var $modal = $(html).appendTo('body');
            $modal
                .modal('show')
                .on('hidden', function () {
                    $modal.remove();
                });

            $modal.find('.modal-body > p > span').html(whatToDelete);
            $modal.find('.btn-primary').on('click', function () {
                callback(model);
            });

        }
    }
);
