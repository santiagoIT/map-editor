// BASIC CRUD...

var
    extend = require('xtend')
    ;

module.exports = function (app, wraper, route, Model){

    // get collection
    app.get('/api/'+route, wraper, function(req, res){
        Model.find(function (err, entries) {
            if (!err) {
                return res.send(entries);
            } else {
                throw err;
            }
        });
    });

    // find by id
    app.get('/api/' + route + '/:id', wraper, function(req,res){
        return Model.findById(req.params.id, function (err, obj) {
            if (!err) {
                return res.send(obj);
            } else {
                console.log(err);
                throw err;
            }
        });
    });

    // insert
    app.post('/api/'+route, wraper, function(req,res){
        var model = new Model();
        extend(model, req.body);
        model.save(function (err) {
            if (!err) {
                return res.send(model);
            } else {
                throw err;
            }
        });
    });

    // delete
    app.delete('/api/' + route + '/:id', wraper, function(req,res){
        return Model.findById(req.params.id, function (err, entry) {
            return entry.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.send('');
                } else {
                    throw err;
                }
            });
        });
    });

    // update
    app.put('/api/' + route + '/:id', wraper, function(req,res){
        return Model.findById(req.params.id, function (err, model) {
            extend(model, req.body);
            return model.save(function (err) {
                if (!err) {
                    console.log("updated");
                } else {
                    throw err;
                }
                return res.send(model);
            });
        });
    });
}