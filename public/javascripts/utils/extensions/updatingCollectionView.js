
define(['Underscore', 'backbone'], function (_, Backbone) {

    var View = Backbone.View.extend({
        initialize : function(options) {
            _(this).bindAll('add', 'remove');
    
            if (!options.childViewConstructor) throw "no child view constructor provided";
            if (!options.childViewTagName) throw "no child view tag name provided";
    
            this._childViewConstructor = options.childViewConstructor;
            this._childViewTagName = options.childViewTagName;
    
            this._myModelViews = [];
    
            this.collection.each(this.add);
    
            this.collection.bind('add', this.add, this);
            this.collection.bind('remove', this.remove, this);
            this.collection.bind('reset', this.onCollectionReset, this);
        },

        onCollectionReset : function() {
            console.log(this.collection.toJSON());
            this.collection.forEach(function(mapModel){
                console.log('one');
                this.add(mapModel);
            }, this);
        },
    
        add : function(model) {
            var childView = new this._childViewConstructor({
                tagName : this._childViewTagName,
                model : model
            });
    
            this._myModelViews.push(childView);
    
            if (this._rendered) {
                $(this.el).append(childView.render().el);
            }
        },
    
        remove : function(model) {
            var viewToRemove = _(this._myModelViews).select(function(cv) { return cv.model === model; })[0];
            this._myModelViews = _(this._myModelViews).without(viewToRemove);
    
            if (this._rendered) $(viewToRemove.el).remove();
        },
    
        render : function() {
            var that = this;
            this._rendered = true;
    
            this.$el.empty();
    
            _(this._myModelViews).each(function(childView) {
                that.$el.append(childView.render().el);
            });
    
            return this;
        }
    });

    // Our module now returns an instantiated view
    // Sometimes you might return an un-instantiated view e.g. return projectListView
    return View;
});