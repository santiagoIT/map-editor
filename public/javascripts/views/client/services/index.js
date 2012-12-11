define([
    'jquery',
    'Underscore',
    'backbone',
    'bizClient/toIntroNavigator',
    'models/searchModel',
    'collections/locations',
    'collections/maps',
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
    function ($, _, Backbone,  toIntroNavigator, SearchModel, locations, maps, html, htmlResults, htmlModalPopUp,
              MainMenuView, IndexBarView, SearchView, KeyboardView, SearchResultsView, ModalPopUpView) {
        var View = Backbone.View.extend({

            collection : locations,

            initialize:function () {

                // load maps synchronously
                maps.fetch({async:false});

                this.searchModel = new SearchModel();
                this.searchModel.fnSort = function(arEntries) {
                    arEntries.sort(function(a,b){
                        var n1 = a.name;
                        var n2 = b.name;
                        if (n1 < n2) {
                            return -1;
                        }
                        return 1;
                    });
                    return arEntries;
                };
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
                var renderOptions = {
                    getMapShortNameFor : function(location){
                        var map = maps.get(location.mapId);
                        if (!map){
                            return '--';
                        }
                        return map.get('shortName');
                    }
                }
                this.searchModel.set('itemsPerPage', 35);
                this.searchResultsView = new SearchResultsView(this.searchModel, htmlResults, renderOptions);
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
                    if (!service.get('includeInSearch')){
                        return false;
                    }

                    var name = service.get("name");
                    if (name && (name[0] == char || name[0] == charLower)) {
                        return true;
                    }
                    return false;
                });

                var arJson = _.map(results, function(entry) {
                   return entry.toJSON();
                });

                this.searchModel.setJsonResults(arJson);
            },

            searchResultClicked : function (id) {

                // find model
                var options = {
                    model : this.collection.get(id).toJSON(),
                    imageUrl : '/images/services/default.png',
                    navigateTo: function($el, options) {
                        var $modal = $el.closest('.modal');
                        $modal.modal('hide');
                        $modal.on('hidden', function () {
                            require(['itworks.app'], function (app) {
                                app.getRouter().navigate('kiosk/'+id, {trigger:true, id:'santi'});
                            });
                        });
                    }
                };
                if (options.model.imageUrl){
                    options.imageUrl = '/data/images/'+ options.model.imageUrl;
                }
                this.modalPopUpView.showModal(options);
            },

            searchTermEntered : function (searchTerm) {
                var results = this.collection.filter(function (loc) {
                    if (!loc.get('includeInSearch')){
                        return false;
                    }

                    // check name
                    var pattern = new RegExp(searchTerm, "gi");
                    if (pattern.test(loc.get("name"))) {
                        return true;
                    }

                    // check map
                    var map = maps.get(loc.get('mapId'));
                    if (map){
                        if (pattern.test(map.get('shortName'))) {
                            return true;
                        }
                        if (pattern.test(map.get('name'))) {
                            return true;
                        }
                    }

                    return false;
                });
                var arJson = _.map(results, function(entry) {
                    return entry.toJSON();
                });
                this.searchModel.setJsonResults(arJson);
            },

            render:function () {
                return this;
            },

            showAllLocations : function() {

                var results = this.collection.filter(function (loc) {
                    if (!loc.get('includeInSearch')){
                        return false;
                    }
                    return true;
                    }
                );

                var arJson = _.map(results, function(entry) {
                    return entry.toJSON();
                });
                this.searchModel.setJsonResults(arJson);
            }
        });

        return View;
    });