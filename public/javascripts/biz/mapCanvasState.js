define(['Underscore', 'backbone'], function(_, Backbone){

    // private stuff
    var editorMode = 'toggleNode';
    var self = this;
    var exports = {
        getEditorMode : function(){
            return self.editorMode;
        },
        setEditorMode : function(mode) {
            self.editorMode = mode;
            self.trigger('change:editorMode');
        }
    };

    _.extend(this, Backbone.Events);



    return exports;
});