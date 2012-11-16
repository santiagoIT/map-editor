var mongoose = require('mongoose');
var
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define schema
var DoctorSchema = new Schema({
    'id':ObjectId,
    'firstName' : {type: String},
    'lastName' : {type: String},
    'speciality' : {type: String},
    'details' : {type: String},
    'imageUrl' : {type: String}
});

module.exports = mongoose.model('Doctor', DoctorSchema);
