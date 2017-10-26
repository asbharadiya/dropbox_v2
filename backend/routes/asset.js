var kafka = require('./kafka/client');

function addAsset(req,res){
	kafka.make_request('dropbox','addAsset',{
		user_id:req.user._id,
        is_directory:req.body.isDirectory,
        parent:req.body.parent,
        super_parent:req.body.superParent,
        name:req.body.name,
        file:req.file
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function getAssets(req,res){
	kafka.make_request('dropbox','getAssets',{
		user_id:req.user._id,
        starred:req.body.starred,
        recent:req.body.recent,
        parent:req.body.parent,
        super_parent:req.body.superParent
	},function(err,result){
        if(err) {
           	return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message,data:result.data});
        }
    });
}

function deleteAsset(req,res){
	kafka.make_request('dropbox','deleteAsset',{
		user_id:req.user._id,
        asset_id:req.body.assetId
	},function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function addOrRemoveStarredAsset(req,res){
    kafka.make_request('dropbox','addOrRemoveStarredAsset',{
        user_id:req.user._id,
        asset_id:req.body.assetId,
        is_starred:req.body.isStarred
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function shareAsset(req,res){
    kafka.make_request('dropbox','shareAsset',{
        user_id:req.user._id,
        asset_id:req.body.assetId,
        share_with:req.body.shareWith,
        target_id:req.body.targetId
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            return res.status(result.code).json({status:result.code,statusText:result.message});
        }
    });
}

function downloadAsset(req,res){
    kafka.make_request('dropbox','downloadAsset',{
        user_id:req.user._id,
        asset_id:req.params.assetId,
        super_parent:req.params.superParent
    },function(err,result){
        if(err) {
            return res.status(500).json({status:500,statusText:"Internal server error"});
        } else {
            res.setHeader("Content-disposition", "attachment; filename="+result.data.filename);
            res.setHeader("Content-type", result.data.content_type);
            return res.end(new Buffer(result.data.buffer.data,'binary'));
        }
    });
}

exports.addAsset = addAsset;
exports.getAssets = getAssets;
exports.deleteAsset = deleteAsset;
exports.addOrRemoveStarredAsset = addOrRemoveStarredAsset;
exports.shareAsset = shareAsset;
exports.downloadAsset = downloadAsset;