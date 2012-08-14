define(function(){

    var cached = undefined;

    return {
        setKioskLocation : function(mapId, node){

            if (typeof(localStorage) !== undefined){
                localStorage.setItem('kiosk_mapId', mapId);
                if (node){
                    var nodeStr = JSON.stringify(node);
                    localStorage.setItem('kiosk_node', nodeStr);
                }


                cached = {
                    mapId: mapId,
                    node : node
                };

                return true;
            }

            return false;
        },

        getKioskLocation : function(){
            if (cached)
            {
                return cached;
            }
            if (typeof(localStorage) !== undefined){
                var mapId = localStorage.getItem('kiosk_mapId');
                var node = JSON.parse(localStorage.getItem('kiosk_node'));
                cached = {
                    mapId: mapId,
                    node : node
                };
            }
            return cached;
        }
    }
});