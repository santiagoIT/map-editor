module.exports = {
    setupEnvironment:function (envFile) {

        var fs = require('fs');
        if (!fs.existsSync(envFile)){
            return;
        }
        var entries = fs.readFileSync(envFile, 'ascii').split('\n');
        for (var e in entries) {
            var line = entries[e];
            if (!line) {
                continue;
            }
            var tokens = line.split('=');
            if (!tokens || tokens.length < 2) {
                continue;
            }
            var key = tokens[0];
            if (!process.env[key]){
                process.env[key] = tokens[1];
                console.log('ENVIRONMENT ENTRY CREATED: ' + tokens[0] + ' VALUE: ' + tokens[1]);
            }
        }
    }
}
