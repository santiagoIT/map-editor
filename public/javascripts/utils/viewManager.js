define(function(){

    return {
        showView : function(view) {
            if (this.currentView){
                this.currentView.itworksDispose();
            }

            this.currentView = view;
            this.currentView.render();

            $("#itworks-app").append(this.currentView.el);
        }
    }
});
