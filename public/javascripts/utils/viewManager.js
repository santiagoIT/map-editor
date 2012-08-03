define(function(){

    return {
        showView : function(view) {
            if (this.currentView){
                this.currentView.dispose();
            }

            this.currentView = view;
            this.currentView.render();

            $("#itworks-app").append(this.currentView.el);
        }
    }
});
