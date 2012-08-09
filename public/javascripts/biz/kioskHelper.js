define(function(){

    return {
        setKioskLocation : function(mapId, node){
            if (typeof(localStorage) !== undefined){
                localStorage.setItem('kiosk_mapId', mapId);
                var nodeStr = JSON.stringify(node);
                localStorage.setItem('kiosk_node', nodeStr);
                return true;
            }

            return false;
        },

        getKioskLocation : function(){
            if (typeof(localStorage) !== undefined){
                var mapId = localStorage.getItem('kiosk_mapId');
                var node = JSON.parse(localStorage.getItem('kiosk_node'));
                return {
                    mapId: mapId,
                    node : node
                };
            }
        }
    }
});