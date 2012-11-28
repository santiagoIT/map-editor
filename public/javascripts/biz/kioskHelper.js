define(function () {

    var cached = undefined;

    return {
        setKioskLocation:function (mapId, node) {

            if (typeof(localStorage) !== undefined) {
                localStorage.setItem('kiosk_mapId', mapId);
                if (node) {
                    var nodeStr = JSON.stringify(node);
                    localStorage.setItem('kiosk_node', nodeStr);
                }

                cached = {
                    mapId:mapId,
                    node:node
                };

                return true;
            }

            return false;
        },

        getKioskLocation:function () {
            if (cached) {
                return cached;
            }
            if (typeof(localStorage) !== undefined) {
                var mapId = localStorage.getItem('kiosk_mapId');
                var node = JSON.parse(localStorage.getItem('kiosk_node'));
                if (mapId && node) {
                    cached = {
                        mapId:mapId,
                        node:node
                    };
                }
                else {
                    // fallback
                    require(['collections/locations'], function (locations) {

                        if (locations.length < 1) {
                            locations.fetch({async:false, success:function () {
                                console.log('succeeded...');
                                var location = locations.at(0);
                                cached = {
                                    mapId:location.get('mapId'),
                                    node:location.get('node')
                                };
                            }});
                        }
                        else {
                            var location = locations.at(0);
                            cached = {
                                mapId:location.get('mapId'),
                                node:location.get('node')
                            };
                        }
                    })
                }
            }
            console.log('fetching...');
            return cached;
        },

        getValueFromLocalStorage : function(key, defaultValue) {
            if (typeof(localStorage) !== undefined) {
                var value = localStorage.getItem(key);
                if (value === null) {
                    return defaultValue;
                }
                return value;
            }
        },

        saveValueToLocalStorage : function(key, value) {
            if (typeof(localStorage) !== undefined) {
                localStorage.setItem(key, value);
        }
        }
    }
});