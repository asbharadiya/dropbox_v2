var kafka = require('./kafka/client');

function createGroup(req,res){
	kafka.make_request('dropbox','createGroup',{
		user_id:req.user._id,
        name:req.body.name
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function updateGroup(req,res){
	kafka.make_request('dropbox','updateGroup',{
		user_id:req.user._id,
		name:req.body.name,
		group_id:req.body.groupId
	},function(err,result){
        if(err) {
           	return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function addRemoveMemberGroup(req,res){
	kafka.make_request('dropbox','addRemoveMemberGroup',{
		user_id:req.user._id,
        group_id:req.body.groupId,
        member_id:req.body.memberId,
        action:req.body.action
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function deleteGroup(req,res){
    kafka.make_request('dropbox','deleteGroup',{
        user_id:req.user._id,
        group_id:req.body.groupId
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function getGroupById(req,res){
    kafka.make_request('dropbox','getGroupById',{
        user_id:req.user._id,
        group_id:req.query.id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function getGroups(req,res){
    kafka.make_request('dropbox','getGroups',{
        user_id:req.user._id
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function searchGroups(req,res){
    kafka.make_request('dropbox','searchGroups',{
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

exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.addRemoveMemberGroup = addRemoveMemberGroup;
exports.deleteGroup = deleteGroup;
exports.getGroupById = getGroupById;
exports.getGroups = getGroups;
exports.searchGroups = searchGroups;