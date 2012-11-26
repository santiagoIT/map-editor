define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'models/searchModel',
    'collections/services',
    'text!views/client/services/index.html',
    'text!views/client/services/searchResults.html',
    'text!views/client/services/modalSearchResultPopup.html',
    'views/client/menu/main',
    'views/client/common/indexBar',
    'views/client/common/search',
    'views/client/keyboard/main',
    'views/client/common/searchResults',
    'views/client/common/modalSearchResultPopup'
],
    function ($, _, Backbone,  toIntroNavigator, SearchModel, services, html, htmlResults, htmlModalPopUp,
              MainMenuView, IndexBarView, SearchView, KeyboardView, SearchResultsView, ModalPopUpView) {
        var View = Backbone.View.extend({

            collection : services,

            initialize:function () {

                this.searchModel = new SearchModel();
                this.toIntroNavigator = toIntroNavigator;

                this.$el.html(html);

                // fetch data, proceed only when promises complete
                var self = this;
                var def1 = this.collection.fetch();
                $.when(def1).done(function(){
                    self.setupChildViews();
                    self.showAllLocations();
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
                this.searchResultsView = new SearchResultsView(this.searchModel, htmlResults);
                this.searchResultsView.setElement(this.$el.find('.searchResults')[0]);
                this.addChildView(this.searchResultsView);
                this.bindTo(this.searchResultsView, 'searchResultClicked', this.searchResultClicked, this);

                // modal pop-up
                this.modalPopUpView = new ModalPopUpView(htmlModalPopUp);
                this.modalPopUpView.setElement(this.$el.find('.modalPopUpContainer')[0]);
                this.addChildView(this.modalPopUpView);
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

            searchResultClicked : function (id) {

                // find model
                var options = {
                    model : this.collection.get(id).toJSON(),
                    imageUrl : '/images/services/default.png'
                };
                if (options.model.imageUrl){
                    options.imageUrl = '/data/images/'+ options.model.imageUrl;
                }
                this.modalPopUpView.showModal(options);
            },

            searchTermEntered : function (searchTerm) {
                var results = this.collection.filter(function (loc) {

                    var pattern = new RegExp(searchTerm, "gi");
                    return pattern.test(loc.get("title"));
                });
                this.searchModel.set('results', results);
            },

            render:function () {
                return this;
            },

            showAllLocations : function() {
                this.searchModel.set('results', this.collection);
            }
        });

        return View;
    });