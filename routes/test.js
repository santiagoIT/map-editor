/**
 * Created with JetBrains WebStorm.
 * User: santiago
 * Date: 7/31/12
 * Time: 5:58 PM
 * To change this template use File | Settings | File Templates.
 */
module.exports = function () {
    var exports = {
        test1 : function(req, res){
            console.log('api/test called!!!');
            var user;
            user = new User();
            user.save();
            res.send('Hello');
        }
    };
    return exports;
}
