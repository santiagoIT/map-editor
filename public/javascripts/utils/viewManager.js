define(function(){

    return {
        showView : function(view) {
            if (this.currentView){
                this.currentView.close();
            }

            this.currentView = view;
            this.currentView.render();

            $("#mainContent").html(this.currentView.el);
        }
    }
});
