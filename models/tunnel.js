var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define schema
var TunnelSchema = new Schema({
    'id':ObjectId,
    'name' :  {type: String},
    'description' :  {type: String},

    // map 1
    'mapId1' : ObjectId,

    // map 2
    'mapId2' : ObjectId
});

module.exports = mongoose.model('Tunnel', TunnelSchema);
