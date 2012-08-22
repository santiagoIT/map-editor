define([
    'jquery',
    'Underscore',
    'backbone',
    'text!views/client/navigator/search.html',
    'models/navigator.search',
    'bizClient/journeyManager'
],
    function ($, _, Backbone, html, NavigatorSearchModel, journeyManager) {

        var View = Backbone.View.extend({
            events:{
                'submit form':'search',
                'click .btnSearch':'search',
                'click .btnGoToLocation': 'goToLocation'
            },
            template:_.template(html),

            initialize:function (model, locations) {

                this.model = model;
                this.locations = locations;
                this.searchModel = new NavigatorSearchModel();

                // subscribe
                this.bindTo(this.locations, 'all', this.render());

                this.bindTo(this.searchModel, 'change:links', this.render);

                // activate journeyManager when journey is set
                this.bindTo(this.model, 'change:journey', this.launchJorneyManager);
            },

            render:function () {
                var
                    journey = this.model.get('journey');
                var model = {
                    links:this.searchModel.getLinksAsJson(),
                    haveSearched:this.searchModel.get('haveSearched'),
                    journeyActive:journey ? true : false
                };
                this.$el.html(this.template(model));
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

                return false;
            },

            goToLocation : function(el){
                var $btn = $(el.target);
                if ($btn.hasClass('disabled')){
                    return;
                }

                var locationId = $btn.attr('data-loc-id');
                var loc = this.locations.get(locationId);
                this.model.navigateTo(loc);
                return false;
            }
        });
        // Our module now returns an instantiated view
        // Sometimes you might return an un-instantiated view e.g. return projectListView
        return View;
    });