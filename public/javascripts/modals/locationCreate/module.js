define([
    'jquery',
    'text!modals/locationCreate/html.html'
],
    function ($, html) {
        return function (map, node, callback) {
            var $modal = $(html).appendTo('body');
            $modal
                .modal('show')
                .on('hidden', function () {
                    $modal.remove();
                });

            if (node) {
                $modal.find('input[name="row"').val(node.row);
                $modal.find('input[name="column"').val(node.column);
            }
            $modal.find('.btn-primary').on('click', function () {
                var $form = $modal.find('form');
                callback($form);
            });

        }
    }
);
