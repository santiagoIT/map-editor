define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/search.html',
    'bizClient/journeyManager'
],
    function ($, _, Backbone, html, journeyManager) {

        var View = Backbone.View.extend({
            events:{
                'submit form':'search',
                'click .searchGlass':'search',
                'focus input' : 'showKeyboard'
            },
            template:_.template(html),

            initialize:function (model, searchModel, locations, keyboardView) {

                this.model = model;
                this.locations = locations;
                this.searchModel = searchModel;
                this.keyboardView = keyboardView;

                // activate journeyManager when journey is set
                this.bindTo(this.model, 'change:journey', this.launchJorneyManager);
            },

            showKeyboard:function(el) {
                this.keyboardView.$el.parent().show();

                var $element = $(el.target);
                this.keyboardView.setFocusedElement($element);
            },

            render:function () {
                var
                    journey = this.model.get('journey');
                var model = {
                    journeyActive:journey ? true : false
                };
                this.$el.html(this.template(model));

                console.log('journeyActive');
                console.log(model);
            },

            launchJorneyManager : function(a1, a2, a3) {
                var
                    journey = this.model.get('journey');
                console.log(journey);
                if (journey) {
                    journeyManager.continueJourney(this.model);
                }
                this.render();
            },

            search:function (el) {

                var
                    journey = this.model.get('journey');
                if (journey) {
                    return false;
                }

                this.searchModel.set('haveSearched', true);

                var searchFor = this.$('.search-query').val();

                var results = this.locations.filter(function (loc) {

                    var pattern = new RegExp(searchFor, "gi");
                    return pattern.test(loc.get("name"));
                });
                this.searchModel.set('links', results);

                this.searchModel.set('showResults', true);

                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });