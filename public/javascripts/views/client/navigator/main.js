define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'collections/maps',
    'collections/tunnels',
    'models/navigator',
    'text!views/client/navigator/main.html',
    'views/client/navigator/links',
    'views/client/navigator/search',
    'views/client/navigator/map',
    'views/client/navigator/tunnelTransition'
],
    function ($, _, Backbone, locations, maps, tunnels, NavigatorModel, html,
        LinkView,
        SearchView,
        MapView,
        tunnelTransition) {
        var View = Backbone.View.extend({

            initialize:function () {
                this.model = new NavigatorModel();
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
                })
            },

            setupChildViews: function(){
                // map links
                var linkView = new LinkView(this.model, maps);
                linkView.setElement(this.$el.find('#mapLinks')[0]);
                this.addChildView(linkView);

                // search view
                var searchView = new SearchView(this.model, locations);
                searchView.setElement(this.$el.find('#search')[0]);
                this.addChildView(searchView);

                // map view
                var mapView = new MapView(this.model, maps);
                this.addChildView(mapView);
                this.$el.find('#mapHolder').append(mapView.el);
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
                    entry;
                // we must have a journey
                if (!journey){
                    throw new Error('No journey!!!');
                }

                // destination reached?
                console.log('pathFindingComplete - 19 - 19');
                console.log('journeyNode: ' + journeyNode + ' length: ' + journey.length);
                if (journeyNode >= journey.length-1){
                    alert('you did it!!!!');
                    return;
                }

                entry = journey[journeyNode];
                // using a tunnel?
                if (!entry.tunnelId) {
                    return;
                }

                // get tunnel
                var tunnel = tunnels.get(entry.tunnelId);
                var instructions = 'Now you need to: ' + tunnel.get('description');
                tunnelTransition(instructions, this.model, function(model){
                    model.journeyStepComplete();
                });
            }
        });

        return View;
    });