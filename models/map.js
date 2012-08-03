var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId
;

// Define schema
var NodeSchema = new Schema({
    'column':{type:Number, default:0},
    'row':{type:Number, default:0}
});

var MapSchema = new Schema({
    'id':ObjectId,
    'name':{ type:String, index:true, default:'' },
    'imageName':String,
    'columns':{type:Number, default:1},
    'rows':{type:Number, default:1},
    'top':{type:Number, default:0},
    'left':{type:Number, default:0},
    'bottom':{type:Number, default:0},
    'right':{type:Number, default:0},
    'blockedNodes' : [NodeSchema]
});

module.exports = mongoose.model('Map', MapSchema);
