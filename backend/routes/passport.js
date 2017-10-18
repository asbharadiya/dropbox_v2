var LocalStrategy = require("passport-local").Strategy;
var ObjectId = require('mongodb').ObjectId;

var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongo = require("./mongo");

module.exports = function(passport) {
    //normal signin
    passport.use('local-signin', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
    }, function(username,password,done) {
        process.nextTick(function() {
            try {
                mongo.getCollection('user', function(err,coll){
                    coll.findOne({email:username}, function(err,user){
                        if (user) {
                            bcrypt.compare(password, user.password, function(err, result) {
                                if(result) {
                                    done(null,{_id:user._id});
                                } else {
                                    done(null,false);
                                }
                            });
                        } else {
                            done(null,false);
                        }
                    });
                })
            } catch (e) {
                done(e,{});
            }
        });
    }));

    //normal signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback: true
    }, function(req,username,password,done) {
        process.nextTick(function() {
            try {
                mongo.getCollection('user', function(err,coll){
                    coll.findOne({email:req.body.email}, function(err,user){
                        if(err) {
                            done(err);
                        }
                        if (user) {
                            done(null,false);
                        } else {
                            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                                coll.insert({first_name:req.body.first_name,
                                    last_name:req.body.last_name,
                                    email: req.body.email,
                                    password:hash,
                                    date_of_birth:new Date(req.body.date_of_birth)
                                },function(err, user){
                                    if (err) {
                                        done(err);
                                    } else {
                                        done(null,{_id:user.insertedIds[0]});
                                    }
                                });
                            });
                        }
                    });
                })
            } catch (e) {
                done(e,{});
            }
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user._id);
    })

    passport.deserializeUser(function(user, done){
        mongo.getCollection('user', function(err,coll){
            coll.findOne({"_id":ObjectId(user._id)}, function(err,user){
                done(err, user);
            });
        })
    })
};


