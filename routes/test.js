var DB = require('../datastore');

module.exports = {
    test1:function (req, res) {

        DB.saveUser({
            fname:'rntiago',
            lname:'purbano',
            email:'rburbano@itworks.ec',
            password:'santi123'
        }, function () {
            console.log('User created!');
        })

    }
}
