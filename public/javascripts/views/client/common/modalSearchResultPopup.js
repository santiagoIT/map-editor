define([
    'jquery',
    'Underscore',
    'backbone'
],
    function ($, _, Backbone) {

        var View = Backbone.View.extend({
            initialize:function (html) {
                this.template = _.template(html);
            },

            showModal:function(model) {

                this.model = model;
                this.render();

                console.log('modal model 11', model);

                var self = this;
                // show modal
                var $modal = this.$el.find('.modal');
                $modal.modal('show');
                $modal.on('hidden', function () {
                });
            },

            render:function () {
                var options = {
                    model : null
                };

                if (this.model) {
                    options.model = this.model.toJSON();
                }

                this.$el.html(this.template(options));

                return this;
            }

        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });