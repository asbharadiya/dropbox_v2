var mongo = require("./mongo");

var bcrypt = require('bcrypt');
const saltRounds = 10;

function signin(msg, callback){
    var res = {};
    if(msg.email && msg.email !== '' 
        && msg.password && msg.password !== '') {
        mongo.getCollection('user', function(err,coll){
            coll.findOne({email:msg.email}, function(err,user){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if (user) {
                        bcrypt.compare(msg.password, user.password, function(err,result) {
                            if(result) {
                                res.code = 200;
                                res.message = "Success";
                                res.data = {_id:user._id,uname:user.first_name+" "+user.last_name};
                            } else {
                                res.code = 401;
                                res.message = "Invalid password";
                            }
                            callback(null, res);
                        });
                    } else {
                        res.code = 401;
                        res.message = "Invalid email";
                        callback(null, res);
                    }  
                }     
            });
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

function signup(msg, callback){
    var res = {};
    if(msg.email && msg.email !== '' 
        && msg.password && msg.password !== ''
        && msg.first_name && msg.first_name !== ''
        && msg.last_name && msg.last_name !== '') {
        mongo.getCollection('user', function(err,coll){
            coll.findOne({email:msg.email}, function(err,user){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if (user) {
                        res.code = 400;
                        res.message = "User already exists";
                        callback(null, res);
                    } else {
                        bcrypt.hash(msg.password, saltRounds, function(err, hash) {
                            coll.insert({
                                first_name:msg.first_name,
                                last_name:msg.last_name,
                                email: msg.email,
                                password:hash,
                                is_verified:true
                            },function(err, user){
                                if (err) {
                                    res.code = 500;
                                    res.message = "Internal server error";
                                } else {
                                    res.code = 200;
                                    res.message = "Success";
                                    res.data = {_id:user.insertedIds[0],uname:msg.first_name+" "+msg.last_name};
                                }
                                callback(null, res);
                            });
                        });
                    }
                }
            });
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

exports.signin = signin;
exports.signup = signup;