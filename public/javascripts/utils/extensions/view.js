define(['Underscore', 'backbone'], function (_, Backbone) {

    // extend backbone views
    Backbone.View.prototype.onNavigateTo = function (el) {
        var route = $(el.target).attr('data-navitem');
        require(['itworks.app'], function (app) {
            app.Router.navigate(route, {trigger:true});
        });
        return false;
    };

    // event binding helper
    var helper = {

        bindTo:function (model, ev, callback) {
            model.bind(ev, callback, this);
            if (!this._bindings) {
                this._bindings = [];
            }
            this._bindings.push({ model:model, ev:ev, callback:callback });
        },

        unbindFromAll:function () {
            _.each(this._bindings, function (binding) {
                binding.model.unbind(binding.ev, binding.callback);
            });
            this._bindings = [];
        },

        dispose:function () {
            this.unbindFromAll(); // this will unbind all events that this view has bound to
            this.unbind(); // this will unbind all listeners to events from this view. This is probably not necessary because this view will be garbage collected.
            this.remove(); // uses the default Backbone.View.remove() method which removes this.el from the DOM and removes DOM events.
        }
    }

    _.extend(Backbone.View.prototype, helper);
});