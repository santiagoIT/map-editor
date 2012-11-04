define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'collections/maps',
    'collections/tunnels',
    'models/navigator',
    'models/navigator.search',
    'text!views/client/navigator/main.html',
    'views/client/navigator/links',
    'views/client/navigator/search',
    'views/client/navigator/map',
    'views/client/navigator/tunnelTransition',
    'views/client/navigator/searchResults',
    'views/client/menu/main',
    'bootstrap'
],
    function ($, _, Backbone, locations, maps, tunnels, NavigatorModel, NavigatorSearchModel, html,
        LinkView,
        SearchView,
        MapView,
        tunnelTransition,
        SearchResultsView,
        MainMenuView) {
        var View = Backbone.View.extend({

            initialize:function () {
                this.model = new NavigatorModel();
                this.searchModel = new NavigatorSearchModel();
                this.bindTo(this.model, 'change:navigating', this.navigationChanged);
                this.bindTo(this.model, 'PF_completed', this.pathFindingComplete);

                this.$el.html(html);

                // fetch data, proceed only when promises complete
                var self = this;
                var def1 = locations.fetch();
                var def2 = maps.fetch();
                var def3 = tunnels.fetch();
                $.when(def1,def2, def3).done(function(){
                    self.setupChildViews();
                }).fail(function(err){
                        console.log('failled!');
                        console.log(err);
                    });
                console.log('launch child views');
            },

            setupChildViews: function(){
                console.log('setup child views');

                // map links
                var linkView = new LinkView(this.model, maps);
                linkView.setElement(this.$el.find('#mapLinks')[0]);
                this.addChildView(linkView);

                // search view
                var searchView = new SearchView(this.model, this.searchModel, locations);
                searchView.setElement(this.$el.find('#search')[0]);
                this.addChildView(searchView);

                // search results view
                var searchResultsView = new SearchResultsView(this.model, this.searchModel, locations);
                searchResultsView.setElement(this.$el.find('#searchResults')[0]);
                this.addChildView(searchResultsView);

                // map view
                var mapView = new MapView(this.model, maps);
                this.addChildView(mapView);
                this.$el.find('#mapHolder').append(mapView.el);

                // header menu
                var mainMenuView = new MainMenuView();
                mainMenuView.setElement(this.$el.find('#menuHeader')[0]);
                this.addChildView(mainMenuView);
            },

            render:function () {

            },

            navigationChanged : function(model){
                var inProgress = model.get('navigating');
                // disable/enable buttons
                var $btn = this.$('.doNavigate');
                if (!inProgress){
                    $btn.removeAttr('disabled');
                }
                else{
                    if (!$btn.attr('disabled')){
                        $btn.attr('disabled', true);
                    }
                }
            },

            pathFindingComplete : function(){
                // either we reached our target or
                // we need to display tunnel info
                var
                    journey = this.model.get('journey'),
                    journeyNode = this.model.get('currentJourneyNode'),
                    entry, description, instructions, tunnel;
                // we must have a journey
                if (!journey){
                    throw new Error('No journey!!!');
                }
                entry = journey[journeyNode];

                // destination reached?
                if (journeyNode >= journey.length-1){
                    console.log('dest node set!!!');
                    this.model.destinationNodeReached({mapId: entry.mapId, node:entry.to});
                    return;
                }

                // using a tunnel?
                if (!entry.tunnelId) {
                    return;
                }

                // get tunnel
                tunnel = tunnels.get(entry.tunnelId);
                if (tunnel.get('mapId1') == entry.mapId) {
                    instructions = tunnel.get('descTo2');
                }
                else {
                    instructions = tunnel.get('descTo1');
                }
                description = tunnel.get('description');
                tunnelTransition(description, instructions, this.model, function(model){
                    model.journeyStepComplete();
                });
            }
        });

        return View;
    });