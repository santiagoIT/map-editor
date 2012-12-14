var
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    DoctorModel = require('../models/doctor')
    ;

/*
     nombre_mdc,apellido_mdc,Titulo_Mdc,Especialidad_Mdc,Direccion_Mdc,telefono_mdc,foto_mdc
 */

var fnProcessLine = function(item, callback) {
    if (!item) {
        callback();
        return;
    }
    var tokens = item.split(',');
    if (tokens.length < 6) {
        callback();
        return;
    }

    var
        phone = tokens[5].trim(),
        image = tokens[6].trim();

    var data = {
        firstName : tokens[0].trim(),
        lastName : tokens[1].trim(),
        speciality : tokens[3].trim(),
        details : tokens[4].trim() // address
    };
    if (phone) {
        data.details += '<br/>' + phone;
    }

    DoctorModel.find({firstName: data.firstName, lastName: data.lastName}, function (err, entries) {
        if (err) {
            console.log('err', err);
            callback(err);
            return;
        }

        if (!entries ||  entries.length == 0){
            console.log('creating', data);
            // create new model
            var dr = new DoctorModel(data);
            dr.save();
            callback();
            return;
        }
        else if (entries.length > 0){
            var model = entries[0];
            console.log('found one', model);
            model.set(data);
            model.save();
        }

        callback();
    }
        );
};

var fnMainCallback = function(err){
    console.log('*** ALL DONE ***');
};

var processCsvFile = function(req, res, callback) {
    // step 1 read in file
    var csvFile = path.join(process.env.mapEditorRoot, '/public/data/csv/doctors.csv');
    if (!fs.existsSync(csvFile)){
        callback(null);
        return;
    }

    var data = fs.readFileSync(csvFile, 'utf8');//.toString();//.split("\n");
    var lines = data.split("\r");

    // copy locally
    async.forEach(lines, fnProcessLine, fnMainCallback);

    for(i in lines) {
        var line = lines[i];

    }
    callback(null);
}

module.exports =  {
    processCsvFile : processCsvFile
};