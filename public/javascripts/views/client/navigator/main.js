define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'collections/maps',
    'collections/tunnels',
    'collections/locations',
    'models/navigator',
    'models/searchModel',
    'text!views/client/navigator/main.html',
    'text!views/client/services/modalSearchResultPopup.html',
    'views/client/navigator/links',
    'views/client/navigator/search',
    'views/client/navigator/map',
    'views/client/navigator/tunnelTransition',
    'views/client/navigator/searchModalFrame',
    'views/client/menu/main',
    'views/client/keyboard/main',
    'views/client/common/modalSearchResultPopup',
    'bootstrap'
],
    function ($, _, Backbone, locations, maps, tunnels, locations, NavigatorModel, SearchModel, html, htmlLocationPopup,
        LinkView,
        SearchView,
        MapView,
        tunnelTransition,
        SearchModalFrameView,
        MainMenuView,
        KeyboardView,
        ModalPopUpView) {
        var View = Backbone.View.extend({

            // id represents location to which to navigate to
            initialize:function (locationId) {

                this.model = new NavigatorModel();
                this.searchModel = new SearchModel();
                this.bindTo(this.model, 'change:navigating', this.navigationChanged);
                this.bindTo(this.model, 'PF_completed', this.pathFindingComplete);

                this.$el.html(html);

                // fetch data, proceed only when promises complete
                var self = this;
                var def1 = locations.fetch();
                var def2 = maps.fetch();
                var def3 = tunnels.fetch();
                var def4 = locations.fetch();
                $.when(def1,def2, def3, def4).done(function(){
                    self.setupChildViews();
                    if (locationId) {
                        var location = locations.get(locationId);
                        if (location) {
                            self.model.navigateTo(location);
                        }
                    }
                }).fail(function(err){
                        console.log('failled!');
                        console.log(err);
                    });
            },

            setupChildViews: function(){
                // keyboard view
                this.keyboardView = new KeyboardView();
                var $keyboard = this.$el.find('.keyboard');
                $keyboard.append(this.keyboardView.el);
                this.addChildView(this.keyboardView);

                // map links
                var linkView = new LinkView(this.model, maps);
                linkView.setElement(this.$el.find('#mapLinks')[0]);
                this.addChildView(linkView);

                // search view
                var searchView = new SearchView(this.model, this.searchModel, locations, this.keyboardView);
                searchView.setElement(this.$el.find('#search')[0]);
                this.addChildView(searchView);

                // search results view
                var searchResultsView = new SearchModalFrameView(this.model, this.searchModel, locations);
                searchResultsView.setElement(this.$el.find('#searchResults')[0]);
                this.addChildView(searchResultsView);
                // search results must be added after view has been added to DOM
                searchResultsView.prepareSearchResults();

                // map view
                var mapView = new MapView(this.model, maps, locations);
                this.addChildView(mapView);
                this.$el.find('#mapHolder').append(mapView.el);
                this.bindTo(mapView, 'displayLocationInfo', this.onDisplayLocationInfo, this);

                // header menu
                var mainMenuView = new MainMenuView();
                mainMenuView.setElement(this.$el.find('#menuHeader')[0]);
                this.addChildView(mainMenuView);

                // location popup
                // modal pop-up
                this.locationPopUpView = new ModalPopUpView(htmlLocationPopup);
                this.locationPopUpView.setElement(this.$el.find('.locationPopUpContainer')[0]);
                this.addChildView(this.locationPopUpView);
            },

            onDisplayLocationInfo : function(location) {

                var self = this;
                var options = {
                    model : location.toJSON(),
                    imageUrl : '/images/services/default.png',
                    navigateTo: function($el, options) {
                        var $modal = $el.closest('.modal');
                        $modal.modal('hide');
                        $modal.on('hidden', function () {
                            self.model.navigateTo(location);
                        });
                    }
                };
                if (options.model.imageUrl){
                    options.imageUrl = '/data/images/'+ options.model.imageUrl;
                }
                this.locationPopUpView.showModal(options);
            },

            render:function () {
                return this;
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