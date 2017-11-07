var kafka = require('./kafka/client');
var mongo = require("./mongoWithDbPool");
var ObjectId = require('mongodb').ObjectId;

mongo.connect();

function getUserProfile(req,res){
	kafka.make_request('dropbox','getUserProfile',{
		_id:req.user._id
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getUserProfileWithoutPooling(req,res){
    kafka.make_request('dropbox','getUserProfileWithoutPooling',{
        _id:req.user._id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getUserProfileWithDbPooling(req,res){
    kafka.make_request('dropbox','getUserProfileWithDbPooling',{
        _id:req.user._id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getUserProfileWithoutKafka(req,res){
    mongo.getCollection('user', function(err,coll){
        coll.findOne({_id:new ObjectId(req.user._id)}, function(err,user){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                if (user) {
                    var _data = {
                        first_name:user.first_name,
                        last_name:user.last_name,
                        about:user.about,
                        email:user.email,
                        contact_no:user.contact_no,
                        education:user.education,
                        occupation:user.occupation
                    };
                    return res.status(200).json({status:200,statusText:"Success",data:_data});
                } else {
                    return res.status(404).json({status:404,statusText:"User not found"});
                }  
            }     
        });
    })
}

function updateUserProfile(req,res){
	kafka.make_request('dropbox','updateUserProfile',{
		_id:req.user._id,
		first_name:req.body.first_name,
		last_name:req.body.last_name,
		about:req.body.about,
		education:req.body.education,
		occupation:req.body.occupation
	},function(err,result){
        if(err) {
           	return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function getUserActivity(req,res){
	kafka.make_request('dropbox','getUserActivity',{
		user_id:req.user._id
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function searchUsers(req,res){
    kafka.make_request('dropbox','searchUsers',{
        user_id:req.user._id,
        query:req.query.q
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

exports.getUserProfile = getUserProfile;
exports.getUserProfileWithoutPooling = getUserProfileWithoutPooling;
exports.getUserProfileWithDbPooling = getUserProfileWithDbPooling;
exports.getUserProfileWithoutKafka = getUserProfileWithoutKafka;
exports.updateUserProfile = updateUserProfile;
exports.getUserActivity = getUserActivity;
exports.searchUsers = searchUsers;