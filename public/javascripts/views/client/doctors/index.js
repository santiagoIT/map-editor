define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'models/searchModel',
    'collections/doctors',
    'text!views/client/doctors/index.html',
    'views/client/menu/main',
    'views/client/common/indexBar',
    'views/client/common/search',
    'views/client/keyboard/main',
    'views/client/doctors/searchResults'
],
    function ($, _, Backbone,  toIntroNavigator, SearchModel, doctors, html,
              MainMenuView, IndexBarView, SearchView, KeyboardView, SearchResultsView) {
        var View = Backbone.View.extend({
            collection : doctors,
            initialize:function () {

                this.$el.html(html);

                this.searchModel = new SearchModel();
                this.toIntroNavigator = toIntroNavigator;

                // fetch data, proceed only when promises complete
                var self = this;
                var def1 = this.collection.fetch();
                $.when(def1).done(function(){
                    self.setupChildViews();
                    self.showAll();
                }).fail(function(err){
                        console.log('failled!');
                        console.log(err);
                    });
            },

            setupChildViews: function(){

                // header menu
                var mainMenuView = new MainMenuView();
                mainMenuView.setElement(this.$el.find('#menuHeader')[0]);
                this.addChildView(mainMenuView);

                this.indexBarView = new IndexBarView();
                this.indexBarView.setElement(this.$el.find('.indexBar')[0]);
                this.addChildView(this.indexBarView);
                this.bindTo(this.indexBarView, 'searchIndexChanged', this.searchIndexChanged, this);

                // keyboard view
                this.keyboardView = new KeyboardView();
                var $keyboard = this.$el.find('.keyboard');
                $keyboard.append(this.keyboardView.el);
                this.addChildView(this.keyboardView);

                // search view
                this.searchView = new SearchView(this.keyboardView, this.searchModel);
                this.searchView.setElement(this.$el.find('.searchContainer')[0]);
                this.addChildView(this.searchView);
                this.bindTo(this.searchView, 'searchTermEntered', this.searchTermEntered, this);

                // search results
                this.searchResultsView = new SearchResultsView(this.searchModel);
                this.searchResultsView.setElement(this.$el.find('.searchResults')[0]);
                this.addChildView(this.searchResultsView);
            },

            searchIndexChanged : function(char) {
                var charLower = char.toLowerCase();
                var results = this.collection.filter(function (service) {
                    var name = service.get("title");
                    if (name && (name[0] == char || name[0] == charLower)) {
                        return true;
                    }
                    return false;
                });

                this.searchModel.set('results', results);
            },

            searchTermEntered : function (searchTerm) {
                var results = this.collection.filter(function (loc) {

                    var pattern = new RegExp(searchTerm, "gi");
                    return pattern.test(loc.get("lastName"));
                });
                this.searchModel.set('results', results);
            },

            showAll : function() {
                this.searchModel.set('results', this.collection);
            },

            render:function () {
                return this;
            }
        });

        return View;
    });