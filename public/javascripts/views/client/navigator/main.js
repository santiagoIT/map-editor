define([
    'jquery',
    'Underscore',
    'backbone',
    'collections/locations',
    'models/navigatorModel',
    'text!views/client/navigator/main.html',
    'views/client/navigator/links'
],
    function ($, _, Backbone, locations, NavigatorModel, html,
        LinkView) {
        var View = Backbone.View.extend({

            initialize:function () {
                this.model = new NavigatorModel();
                this.bindTo(this.model, 'change:navigating', this.navigationChanged);

                this.$el.html(html);

                // child views
                var linkView = new LinkView(this.model);
                linkView.setElement(this.$el.find('#mapLinks')[0]);
                this.addChildView(linkView);
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