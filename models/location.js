var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define schema
var LocationSchema = new Schema({
    'id':ObjectId,
    'name' : {type: String},
    'description' :  {type: String},

    // map node
    'mapId' : ObjectId,
    'node' : {
        'column':{type:Number, default:0},
        'row':{type:Number, default:0}
    }
});

module.exports = mongoose.model('Location', LocationSchema);
