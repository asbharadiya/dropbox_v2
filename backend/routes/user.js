var kafka = require('./kafka/client');

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

exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.getUserActivity = getUserActivity;