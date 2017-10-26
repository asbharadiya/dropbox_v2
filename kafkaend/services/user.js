var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectId;

function getUserProfile(msg, callback){
    var res = {};
    mongo.getCollection('user', function(err,coll){
        coll.findOne({_id:new ObjectId(msg._id)}, function(err,user){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                if (user) {
                    res.code = 200;
                    res.message = "Success";
                    res.data = {
                        first_name:user.first_name,
                        last_name:user.last_name,
                        about:user.about,
                        email:user.email,
                        contact_no:user.contact_no,
                        education:user.education,
                        occupation:user.occupation
                    };
                    callback(null, res);
                } else {
                    res.code = 404;
                    res.message = "User not found";
                    callback(null, res);
                }  
            }     
        });
    })
}

function updateUserProfile(msg, callback){
    var res = {};
    if(msg.first_name && msg.first_name !== ''
        && msg.last_name && msg.last_name !== '') {
        mongo.getCollection('user', function(err,coll){
            coll.updateOne(
            {
                _id:new ObjectId(msg._id)
            },
            {
                $set: {
                    first_name:msg.first_name,
                    last_name:msg.last_name,
                    about:msg.about,
                    contact_no:msg.contact_no,
                    education:msg.education,
                    occupation:msg.occupation 
                }
            }, function(err,result){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    res.code = 200;
                    res.message = "Success";
                    callback(null, res); 
                    //TODO add user activity
                }
            });
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

//TODO
function getUserActivity(msg, callback){
    var res = {};
    mongo.getCollection('user_activity', function(err,coll){
        coll.find({user_id:new ObjectId(msg.user_id)}).toArray(function(err,result){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                res.code = 200;
                res.message = "Success";
                res.data = result;
                callback(null, res);
            }
        });
    })
}

function searchUsers(msg, callback){
    var res = {};
    mongo.getCollection('user', function(err,coll){
        coll.find({
            first_name:new RegExp('.*'+msg.query+'.*','gi'),
            last_name:new RegExp('.*'+msg.query+'.*','gi'),
            email:new RegExp('.*'+msg.query+'.*','gi'),
            _id:{$ne:new ObjectId(msg.user_id)}
        },
        {
            password:false,
            about:false,
            education:false,
            occupation:false,
            contact_no:false
        }).toArray(function(err,result){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                res.code = 200;
                res.message = "Success";
                res.data = result;
                callback(null, res);
            }
        });
    })
}

exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.getUserActivity = getUserActivity;
exports.searchUsers = searchUsers;