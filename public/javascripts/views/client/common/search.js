define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/common/search.html'
],
    function ($, _, Backbone, html) {

        var View = Backbone.View.extend({
            events:{
                'submit form':'search',
                'click .searchGlass':'search',
                'focus input' : 'showKeyboard'
            },

            initialize:function (keyboardView, searchModel) {
                this.searchModel = searchModel;
                this.keyboardView = keyboardView;
            },

            showKeyboard:function(event) {
                this.keyboardView.$el.parent().show();

                var $element = $(event.target);
                this.keyboardView.setFocusedElement($element);
            },

            render:function () {
                this.$el.html(html);
            },

            search:function (event) {
                event.preventDefault();

                var searchTerm = this.$('.search-query').val();
                this.trigger('searchTermEntered', searchTerm);
                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });