var mongo = require("./mongo");

var bcrypt = require('bcrypt');
const saltRounds = 10;

function signin(msg, callback){
    var res = {};
    mongo.getCollection('user', function(err,coll){
        coll.findOne({email:msg.email}, function(err,user){
            if(err) {
                res.code = 500;
                callback(null, res);
            } else {
                if (user) {
                    bcrypt.compare(msg.password, user.password, function(err,result) {
                        if(result) {
                            res.code = 200;
                            res.data = {_id:user._id,uname:user.first_name+" "+user.last_name};
                        } else {
                            res.code = 401;
                        }
                        callback(null, res);
                    });
                } else {
                    res.code = 401;
                    callback(null, res);
                }  
            }     
        });
    })
}

function signup(msg, callback){
    var res = {};
    mongo.getCollection('user', function(err,coll){
        coll.findOne({email:msg.email}, function(err,user){
            if(err) {
                res.code = 500;
                callback(null, res);
            } else {
                if (user) {
                    res.code = 400;
                    callback(null, res);
                } else {
                    bcrypt.hash(msg.password, saltRounds, function(err, hash) {
                        coll.insert({
                            first_name:msg.first_name,
                            last_name:msg.last_name,
                            email: msg.email,
                            password:hash,
                            date_of_birth:new Date(msg.date_of_birth)
                        },function(err, user){
                            if (err) {
                                res.code = 500;
                            } else {
                                res.code = 200;
                                res.data = {_id:user.insertedIds[0],uname:msg.first_name+" "+msg.last_name};
                            }
                            callback(null, res);
                        });
                    });
                }
            }
        });
    })
}

exports.signin = signin;
exports.signup = signup;