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
    var tokens = item.split(',');
    if (tokens.length < 2) {
        callback();
        return;
    }
    var data = {
        firstName : tokens[0],
        lastName : tokens[1],
        speciality : tokens[3]
    };

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

        // update doctor


        callback();

        console.log('Name', data.firstName, data.lastName);
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