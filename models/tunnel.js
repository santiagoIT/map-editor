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
    'node1' : {
        'column':{type:Number, default:0},
        'row':{type:Number, default:0}
    },

    // map 2
    'mapId2' : ObjectId,
    'node2' : {
        'column':{type:Number, default:0},
        'row':{type:Number, default:0}
    }
});

module.exports = mongoose.model('Tunnel', TunnelSchema);
