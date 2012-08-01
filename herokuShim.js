module.exports = {
    setupEnvironment : function(paramName){
        if (!process.env[paramName]){
            var fs = require('fs');
            var entries = fs.readFileSync(__dirname + '/.env', 'ascii').split('\n');
            for(var e in entries){
                var line = entries[e];
                if (!line){
                    continue;
                }
                var tokens = line.split('=');
                if (!tokens || tokens.length < 2){
                    continue;
                }
                process.env[tokens[0]] = tokens[1] ;
                console.log('ENVIRONMENT ENTRY CREATED: ' + tokens[0] + ' VALUE: ' + tokens[1]);
            }
        }
    }
}