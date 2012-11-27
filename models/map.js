var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId
;

// Define schema
var NodeSchema = new Schema({
    'x':{type:Number, default:0},
    'y':{type:Number, default:0}
});

var MapSchema = new Schema({
    'id':ObjectId,
    'name':{ type:String, index:true, default:'' },
    'shortName':{ type:String, index:true, default:'??' },
    'linkImageName':{ type:String, default:'' }, // image to appear in the map links sections
    'floor':{type:Number, default:1}, // floor number so links can be sorted by floor
    'imageName':String,
    'x':{type:Number, default:1},
    'y':{type:Number, default:1},
    'top':{type:Number, default:0},
    'left':{type:Number, default:0},
    'bottom':{type:Number, default:0},
    'right':{type:Number, default:0},
    'blockedNodes' : [NodeSchema]
});

module.exports = mongoose.model('Map', MapSchema);
