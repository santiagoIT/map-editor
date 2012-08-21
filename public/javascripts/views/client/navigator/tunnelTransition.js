define([
    'jquery',
    'text!views/client/navigator/tunnelTransition.html'
],
    function ($, html) {
        return function (instructions, model, callback) {
            var $modal = $(html).appendTo('body');
            $modal
                .modal('show')
                .on('hidden', function () {
                    $modal.remove();
                    callback(model);
                });

            $modal.find('.modal-body > p').html(instructions);
        }
    }
);
