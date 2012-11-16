var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define schema
var ServiceSchema = new Schema({
    'id':ObjectId,
    'title' : {type: String},
    'description' :  {type: String},
    'imageUrl' : {type: String}
});

module.exports = mongoose.model('Service', ServiceSchema);
