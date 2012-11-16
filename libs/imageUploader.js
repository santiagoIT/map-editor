var
    knox = require('knox'),
    fs = require('fs'),
    async = require('async')
    ;

var awsClient = null;

module.exports =  {

    processImages : function(req, callbackResponse) {

        if (awsClient == null) {
            awsClient = knox.createClient({
                key:process.env.AWS_ACCESS_KEY,
                secret:process.env.AWS_SECRET_ACCESS_KEY,
                bucket:'itworks.ec'
            });
        }

        console.log('processImages -- req.body: ', req.body);

        var
            arFiles = new Array(),
            response = {};

        // extract files + meta data
        for(var fieldName in req.files) {
            var entry = req.files[fieldName];
            if (!entry.name) {
                continue;
            }
            // search for folder name
            var folderName = req.body['path_'+fieldName];
            if (!folderName) {
                folderName = 'default';
            }

            var sanitizedName = entry.name.replace(' ', '_');
            arFiles.push({fieldName:fieldName, name:sanitizedName, type: entry.type, path:entry.path, folderName: folderName});
        }

        console.log('uploadedFileData');
        console.log(arFiles);

        // upload to s3
        async.forEach(arFiles, function(item, callback){

            fs.readFile(item.path, function (err, buf) {

                if (err) {
                    callback(err);
                    return;
                }

                var reqAWS = awsClient.put('/mapeditor/images/' + item.folderName + '/' + item.name, {
                    'Content-Length':buf.length,
                    'Content-Type':item.type
                });
                reqAWS.on('response', function (resAWS) {

                    if (200 == resAWS.statusCode) {
                        response[item.fieldName] = item.folderName + '/' +item.name;
                    }
                    else {
                        callback({error:'AWS upload error: ' + resAWS.statusCode});
                        return;
                    }
                    callback();
                });
                reqAWS.end(buf);
            });

        }, function(err){
            if (err) {
                callbackResponse({error: err});
            }
            else {
                callbackResponse(null, response);
            }
        });
    }
}