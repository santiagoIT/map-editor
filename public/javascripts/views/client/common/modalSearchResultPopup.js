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

            showModal:function(options) {

                this.viewOptions = options;
                this.render();

                var self = this;
                // show modal
                var $modal = this.$el.find('.modal');
                $modal.modal('show');
                $modal.on('hidden', function () {
                });
            },

            render:function () {

                if (!this.viewOptions){
                    this.viewOptions = {
                        model : null
                    };
                }

                this.$el.html(this.template(this.viewOptions));

                return this;
            }

        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });