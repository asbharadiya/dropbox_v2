var kafka = require('./kafka/client');

var CHUNK_SIZE = 100 * 1024;

function sliceMyString(str){
    var slices = [];
    while(str !== ''){
        if(str.length > CHUNK_SIZE){
            slices.push(str.slice(0, CHUNK_SIZE));
            str = str.slice(CHUNK_SIZE);
        } else {
            slices.push(str);
            break;
        }
    }
    return slices;
}

function addAsset(req,res){
    if(req.body.isDirectory && req.body.isDirectory === 'true'){
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
    } else if(req.body.isDirectory && req.body.isDirectory === 'false'){
        var chunks = sliceMyString(req.file.buffer.toString('base64'));
        kafka.make_chunked_request('dropbox','addAsset',{
            user_id:req.user._id,
            is_directory:req.body.isDirectory,
            parent:req.body.parent,
            super_parent:req.body.superParent,
            name:req.body.name,
            file:{
                originalname:req.file.originalname,
                mimetype:req.file.mimetype,
                size:req.file.size
            }
        }, chunks, function(err,result){
            if(err) {
                return res.status(500).json({status:500,statusText:"Internal server error"});
            } else {
                return res.status(result.code).json({status:result.code,statusText:result.message});
            }
        })
    } else {
        return res.status(400).json({status:400,statusText:"Bad request"});
    }
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
            return res.end(Buffer.from(result.data.combined_chunks_data,'base64'));
        }
    });
}

exports.addAsset = addAsset;
exports.getAssets = getAssets;
exports.deleteAsset = deleteAsset;
exports.addOrRemoveStarredAsset = addOrRemoveStarredAsset;
exports.shareAsset = shareAsset;
exports.downloadAsset = downloadAsset;