define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'collections/maps',
    'models/navigator',
    'text!views/client/navigator/main.html',
    'views/client/navigator/links',
    'views/client/navigator/search',
    'views/client/navigator/map'
],
    function ($, _, Backbone, locations, maps, NavigatorModel, html,
        LinkView,
        SearchView,
        MapView) {
        var View = Backbone.View.extend({

            initialize:function () {
                this.model = new NavigatorModel();
                this.bindTo(this.model, 'change:navigating', this.navigationChanged);

                this.$el.html(html);

                // child views
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

                // fetch data
                locations.fetch();
                maps.fetch();
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
            }
        });

        return View;
    });