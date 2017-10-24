var LocalStrategy = require("passport-local").Strategy;
//var ObjectId = require('mongodb').ObjectId;
var kafka = require('./kafka/client');

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
                kafka.make_request('dropbox','signin',{
                    email:username,
                    password:password
                },function(err,res){
                    if(err){
                        done(err);
                    } else {
                        if(res.code === 200){
                            done(null,res.data);
                        } else if(res.code === 401){
                            done(null,false);
                        } else {
                            done("Error");
                        }
                    }
                });
            } catch (e) {
                done(e);
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
                kafka.make_request('dropbox','signup',{
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    email: req.body.email,
                    password:req.body.password,
                    date_of_birth:req.body.date_of_birth
                },function(err,res){
                    if(err){
                        done(err);
                    } else {
                        if(res.code === 200){
                            done(null,res.data);
                        } else if(res.code === 400){
                            done(null,false);
                        } else {
                            done("Error");
                        }
                    }
                });
            } catch (e) {
                done(e);
            }
        });
    }));

    passport.serializeUser(function(user, done){
        // done(null, user._id);
        done(null, user);
    })

    passport.deserializeUser(function(user, done){
        // mongo.getCollection('user', function(err,coll){
        //     coll.findOne({"_id":ObjectId(user._id)}, function(err,user){
        //         done(err, user);
        //     });
        // })
        done(null,user);
    })
};


