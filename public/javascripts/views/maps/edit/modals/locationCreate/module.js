define([
    'jquery',
    'text!views/maps/edit/modals/locationCreate/html.html'
],
    function ($, html) {
        return function (map, node, callback) {
            var $modal = $(html).appendTo('body');
            var $btn = $modal.find('.btn-primary');
            $modal
                .modal('show')
                .on('hidden', function () {
                    $btn.off('click', onClick);
                    $modal.remove();
                });

            if (node) {
                $modal.find('input[name="x"]').val(node.x);
                $modal.find('input[name="y"]').val(node.y);
            }

            var onClick = function(){
                var $form = $modal.find('form');
                callback($form);
            };
            $btn.on('click', onClick);
        }
    }
);
