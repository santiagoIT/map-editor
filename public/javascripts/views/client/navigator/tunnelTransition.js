define([
    'jquery',
    'text!views/client/navigator/tunnelTransition.html'
],
    function ($, html) {
        return function (instructions, model, callback) {
            var timeLeft = 5,
                $modal = $(html).appendTo('body'),
                timerId = window.setInterval(function(){
                    timeLeft--;
                    if (timeLeft < 0){
                        window.clearInterval(timerId);
                        delete timerId;
                        $modal.modal('hide');
                    }
                    $modal.find('#timeCountDown').html(timeLeft);
                },1000);
            $modal
                .modal('show')
                .on('hidden', function () {
                    $modal.remove();
                    callback(model);
                    if (timerId){
                        window.clearInterval(timerId);
                        delete timerId;
                    }
                });

            $modal.find('.modal-body > p').html(instructions);
            $modal.find('#timeCountDown').html(timeLeft);
        }
    }
);
