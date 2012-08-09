define([
    'Underscore',
    'biz/kioskHelper',
    'collections/locations'
], function(_, kioskHelper, locations){
    describe("Kiosk Helper Spec", function() {

        it("should be serialized/deserialized consistently", function(){

            runs(function(){
                locations.fetch();
            });

            waitsFor(function(){
                return locations.length > 0;
            });

            runs(function(){
                var location = locations.at(0).toJSON();
                expect(location.mapId).not.toBe(null);
                expect(location.node).not.toBe(null);
                var result = kioskHelper.setKioskLocation(location.mapId, location.node);
                expect(result).toBe(true);

                // now deserialize
                var back = kioskHelper.getKioskLocation();
                expect(back).not.toBe(null);

                // equal?
                expect(back.mapId).toEqual(location.mapId);
                expect(back.node).toEqual(location.node);
            });
        });
    });

});
