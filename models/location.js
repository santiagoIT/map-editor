var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define schema
var LocationSchema = new Schema({
    'id':ObjectId,
    'name' : {type: String},
    'description' :  {type: String},
    'imageUrl' : {type: String},
    'includeInSearch' : {type: Boolean, default: true},

    // map node
    'mapId' : ObjectId,
    'node' : {
        'x':{type:Number, default:0},
        'y':{type:Number, default:0}
    }
});

module.exports = mongoose.model('Location', LocationSchema);
