var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectId;
var Db = require('mongodb').Db;
var GridStore = require('mongodb').GridStore;


function addAsset(msg, callback){
    var res = {};
    if((msg.is_directory === 'true' && msg.name && msg.name !== '')
            || (msg.is_directory === 'false' && msg.file && msg.file !== null)) {
        mongo.getCollection('assets', function(err,coll){
            if(msg.parent && msg.parent !== '' 
                && msg.super_parent && msg.super_parent !== ''){   
                coll.findOne({
                    name:msg.super_parent,
                    is_deleted:false,
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id)
                        }
                    ]
                }, function(err,result){
                    if(err) {
                        res.code = 500;
                        res.message = "Internal server error";
                        callback(null, res);
                    } else {
                        if(result){
                            //TODO: if parent and super_parent same
                            coll.findOne({
                                name:msg.parent,
                                is_deleted:false,
                                owner_id: new ObjectId(result.owner_id)
                            }, function(err,result){
                                if(err) {
                                    res.code = 500;
                                    res.message = "Internal server error";
                                    callback(null, res);
                                } else {
                                    if(result){
                                        if(msg.is_directory === 'true'){
                                            coll.count({
                                                original_name:msg.name,
                                                is_deleted:false,
                                                $or:[
                                                    {
                                                        owner_id: new ObjectId(msg.user_id)   
                                                    },
                                                    {
                                                        sharedUsers:new ObjectId(msg.user_id)
                                                    }
                                                ]
                                            }, function(err, count){
                                                if(err) {
                                                    res.code = 500;
                                                    res.message = "Internal server error";
                                                    callback(null, res);
                                                } else {
                                                    var new_filename = msg.name;
                                                    if(count > 0){
                                                        new_filename = [new_filename, "(", count, ")"].join('');
                                                    }
                                                    var curr_date = new Date();
                                                    coll.insert({
                                                        owner_id:new ObjectId(result.owner_id),
                                                        is_directory:true,
                                                        created_date:curr_date,
                                                        is_deleted:false,
                                                        name:new_filename,
                                                        original_name:msg.name,
                                                        parent_id:new ObjectId(result._id)
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
                                                }
                                            })
                                        } else {
                                            coll.count({
                                                original_name:msg.file.originalname,
                                                is_deleted:false,
                                                $or:[
                                                    {
                                                        owner_id: new ObjectId(msg.user_id)   
                                                    },
                                                    {
                                                        sharedUsers:new ObjectId(msg.user_id)
                                                    }
                                                ]
                                            }, function(err, count){
                                                if(err) {
                                                    res.code = 500;
                                                    res.message = "Internal server error";
                                                    callback(null, res);
                                                } else {
                                                    var new_filename = msg.file.originalname;
                                                    if(count > 0){
                                                        new_filename = [new_filename.substring(0, new_filename.lastIndexOf(".")), "(", count, ")",new_filename.substring(new_filename.lastIndexOf("."), new_filename.length)].join('');
                                                    }
                                                    var fileId = new ObjectId();
                                                    var gridStore = new GridStore(mongo.getDb(), fileId, new_filename, 'w', {root:'assets',content_type:msg.file.mimetype,chunk_size:msg.file.size});
                                                    gridStore.open(function(err, gridStore) {
                                                        gridStore.write(new Buffer(msg.file.buffer), function(err, gridResult) {
                                                            if (err) {
                                                                gridStore.close(function(err, gridResult) {
                                                                    res.code = 500;
                                                                    res.message = "Error saving file to database";
                                                                    callback(null, res);
                                                                });
                                                            } else {
                                                                gridStore.close(function(err, gridResult) {
                                                                    var curr_date = new Date();
                                                                    coll.insert({
                                                                        owner_id:new ObjectId(msg.user_id),
                                                                        is_directory:false,
                                                                        created_date:curr_date,
                                                                        is_deleted:false,
                                                                        name:new_filename,
                                                                        original_name:msg.file.originalname,
                                                                        file_id:fileId,
                                                                        parent_id:new ObjectId(result._id)
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
                                                                });
                                                            }
                                                        })
                                                    })    
                                                }
                                            })
                                        }
                                    } else {
                                        res.code = 400;
                                        res.message = "Bad request";
                                        callback(null, res);
                                    }
                                }
                            });
                        } else {
                            res.code = 400;
                            res.message = "Bad request";
                            callback(null, res);
                        }
                    }
                });
            } else {
                if(msg.is_directory === 'true'){
                    coll.count({
                        original_name:msg.name,
                        is_deleted:false,
                        $or:[
                            {
                                owner_id: new ObjectId(msg.user_id)   
                            },
                            {
                                sharedUsers:new ObjectId(msg.user_id)
                            }
                        ]
                    }, function(err, count){
                        if(err) {
                            res.code = 500;
                            res.message = "Internal server error";
                            callback(null, res);
                        } else {
                            var new_filename = msg.name;
                            if(count > 0){
                                new_filename = [new_filename, "(", count, ")"].join('');
                            }
                            var curr_date = new Date();
                            coll.insert({
                                owner_id:new ObjectId(msg.user_id),
                                is_directory:true,
                                created_date:curr_date,
                                is_deleted:false,
                                name:new_filename,
                                original_name:msg.name
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
                        }
                    })
                } else {
                    coll.count({
                        original_name:msg.file.originalname,
                        is_deleted:false,
                        $or:[
                            {
                                owner_id: new ObjectId(msg.user_id)   
                            },
                            {
                                sharedUsers:new ObjectId(msg.user_id)
                            }
                        ]
                    }, function(err, count){
                        if(err) {
                            res.code = 500;
                            res.message = "Internal server error";
                            callback(null, res);
                        } else {
                            var new_filename = msg.file.originalname;
                            if(count > 0){
                                new_filename = [new_filename.substring(0, new_filename.lastIndexOf(".")), "(", count, ")",new_filename.substring(new_filename.lastIndexOf("."), new_filename.length)].join('');
                            }
                            var fileId = new ObjectId();
                            var gridStore = new GridStore(mongo.getDb(), fileId, new_filename, 'w', {root:'assets',content_type:msg.file.mimetype,chunk_size:msg.file.size});
                            gridStore.open(function(err, gridStore) {
                                gridStore.write(new Buffer(msg.file.buffer), function(err, gridResult) {
                                    if (err) {
                                        gridStore.close(function(err, gridResult) {
                                            res.code = 500;
                                            res.message = "Error saving file to database";
                                            callback(null, res);
                                        });
                                    } else {
                                        gridStore.close(function(err, gridResult) {
                                            var curr_date = new Date();
                                            coll.insert({
                                                owner_id:new ObjectId(msg.user_id),
                                                is_directory:false,
                                                created_date:curr_date,
                                                is_deleted:false,
                                                name:new_filename,
                                                original_name:msg.file.originalname,
                                                file_id:fileId
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
                                        });
                                    }
                                });
                            });
                        }
                    })
                }
            }
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

function getAssets(msg, callback){
    var res = {};
    mongo.getCollection('assets', function(err,coll){
        if(msg.starred){
            coll.aggregate([{
                $match: {
                    starredUsers:new ObjectId(msg.user_id),
                    is_deleted:false
                }
            },
            {
                $project: {
                    created_date:true,
                    is_directory:true,
                    name:true,
                    owner_id:true,
                    is_starred:{$literal:true},
                    is_owner:{$eq:[(new ObjectId(msg.user_id)),"$owner_id"]}
                }
            }]).toArray(function(err,result){
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
        } else if(msg.recent){
            coll.aggregate([{
                $match: {
                    $or:[
                        {
                            owner_id:new ObjectId(msg.user_id),
                            parent_id:null,
                            is_deleted:false
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id),
                            is_deleted:false
                        }
                    ]
                }
            },
            {   
                $project: {
                    created_date:true,
                    is_directory:true,
                    name:true,
                    owner_id:true,
                    is_starred:{$in:[(new ObjectId(msg.user_id)),{$ifNull:["$starredUsers",[]]}]},
                    is_owner:{$eq:[(new ObjectId(msg.user_id)),"$owner_id"]}
                }
            }]).sort({
                created_date:-1
            }).limit(10).toArray(function(err,result){
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
        } else if(msg.parent && msg.parent !== '' && msg.super_parent && msg.super_parent !== ''){
            coll.findOne({
                name:msg.super_parent,
                is_deleted:false,
                $or:[
                    {
                        owner_id: new ObjectId(msg.user_id)   
                    },
                    {
                        sharedUsers:new ObjectId(msg.user_id)
                    }
                ]
            }, function(err,result){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if(result){
                        //TODO: if parent and super_parent same
                        coll.findOne({
                            name:msg.parent,
                            is_deleted:false,
                            owner_id: new ObjectId(result.owner_id)
                        }, function(err,result){
                            if(err) {
                                res.code = 500;
                                res.message = "Internal server error";
                                callback(null, res);
                            } else {
                                if(result){
                                    coll.aggregate([{
                                        $match: {
                                            parent_id:new ObjectId(result._id),
                                            is_deleted:false
                                        }
                                    },
                                    {
                                        $project: {
                                            created_date:true,
                                            is_directory:true,
                                            name:true,
                                            owner_id:true,
                                            is_starred:{$in:[(new ObjectId(msg.user_id)),{$ifNull:["$starredUsers",[]]}]},
                                            is_owner:{$eq:[(new ObjectId(msg.user_id)),"$owner_id"]}
                                        }
                                    }]).toArray(function(err,result){
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
                                } else {
                                    res.code = 400;
                                    res.message = "Bad request";
                                    callback(null, res);
                                }
                            }
                        })
                    } else {
                        res.code = 400;
                        res.message = "Bad request";
                        callback(null, res);
                    } 
                }
            })
        } else {
            coll.aggregate([{
                $match:{
                    $or:[
                        {
                            owner_id:new ObjectId(msg.user_id),
                            parent_id:null,
                            is_deleted:false
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id),
                            is_deleted:false
                        }
                    ]
                }
            },
            {
                $project: {
                    created_date:true,
                    is_directory:true,
                    name:true,
                    owner_id:true,
                    is_starred:{$in:[(new ObjectId(msg.user_id)),{$ifNull:["$starredUsers",[]]}]},
                    is_owner:{$eq:[(new ObjectId(msg.user_id)),"$owner_id"]}
                }
            }]).toArray(function(err,result){
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
        }
    })
}

function deleteAsset(msg, callback){
    var res = {};
    mongo.getCollection('assets', function(err,coll){
        coll.updateOne(
        {
            _id:new ObjectId(msg.asset_id),
            owner_id:new ObjectId(msg.user_id)
        },
        {
            $set:{
                is_deleted:true
            }
        }, function(err,result){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                if(result.result.nModified === 0){
                    res.code = 404;
                    res.message = "Asset not found";
                    callback(null, res);
                } else {
                    res.code = 200;
                    res.message = "Success";
                    callback(null, res);
                }
            }     
        });
    })  
}

function addOrRemoveStarredAsset(msg, callback){
    var res = {};
    if(msg.asset_id && msg.asset_id !== '' && msg.is_starred !== undefined && msg.is_starred !== '') {
        mongo.getCollection('assets', function(err,coll){
            if(msg.is_starred){
                coll.updateOne(
                {
                    is_deleted:false,
                    _id: new ObjectId(msg.asset_id),
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id)
                        }
                    ]
                },
                {
                    $addToSet: {
                        starredUsers:new ObjectId(msg.user_id)
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
            } else {
                coll.updateOne(
                {
                    is_deleted:false,
                    _id: new ObjectId(msg.asset_id),
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id)
                        }
                    ]
                },
                {
                    $pull: {
                        starredUsers:new ObjectId(msg.user_id)
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
                    }     
                });
            }
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

function shareAsset(msg, callback){
    var res = {};
    if(msg.asset_id && msg.asset_id !== ''
        && msg.share_with && msg.share_with !== '' 
        && msg.target_id && msg.target_id !== '') {
        mongo.getCollection('assets', function(err,coll){
            if(msg.share_with === 'users'){
                coll.updateOne(
                {
                    is_deleted:false,
                    _id: new ObjectId(msg.asset_id),
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        }
                    ]
                },
                {
                    $addToSet: {
                        sharedUsers:new ObjectId(msg.target_id)
                    }
                }, function(err,result){
                    if(err) {
                        res.code = 500;
                        res.message = "Internal server error";
                        callback(null, res);
                    } else {
                        if(result.result.nModified === 0){
                            res.code = 400;
                            res.message = "Asset already shared";
                            callback(null, res);
                        } else {
                            res.code = 200;
                            res.message = "Success";
                            callback(null, res);
                            //TODO add user activity
                        }
                    }     
                });
            } else {
                mongo.getDb().collection("groups").findOne({
                    _id: new ObjectId(msg.target_id) 
                },
                {
                    _id:false,
                    members:true
                }, function(err,group){
                    coll.updateOne(
                    {
                        is_deleted:false,
                        _id: new ObjectId(msg.asset_id),
                        owner_id: new ObjectId(msg.user_id)
                    },
                    {
                        $addToSet: {
                            sharedUsers:{ 
                                $each: group.members
                            }
                        }
                    }, function(err,result){
                        if(err) {
                            res.code = 500;
                            res.message = "Internal server error";
                            callback(null, res);
                        } else {
                            if(result.result.nModified === 0){
                                res.code = 400;
                                res.message = "Asset already shared";
                                callback(null, res);
                            } else {
                                res.code = 200;
                                res.message = "Success";
                                callback(null, res);
                                //TODO add user activity
                            }
                        }     
                    });
                })
            }
        });
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);   
    }
}

function downloadAsset(msg, callback){
    var res = {};
    if(msg.asset_id && msg.asset_id !== ''){
        mongo.getCollection('assets', function(err,coll){
            if(msg.super_parent && msg.super_parent !== ''){
                coll.findOne({
                    is_deleted:false,
                    name:msg.super_parent,
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id)
                        }
                    ]
                }, function(err,result){
                    if(err) {
                        res.code = 500;
                        res.message = "Internal server error";
                        callback(null, res);
                    } else {
                        if(result){
                            coll.findOne({
                                is_deleted:false,
                                _id: new ObjectId(msg.asset_id),
                                owner_id:new ObjectId(result.owner_id)
                            }, function(err,result){
                                if(err) {
                                    res.code = 500;
                                    res.message = "Internal server error";
                                    callback(null, res);
                                } else {
                                    if(result){
                                        //TODO download file
                                        var gridStore = new GridStore(mongo.getDb(), result.file_id, 'r',{root:'assets'});
                                        gridStore.open(function(err, gridStore) {
                                            gridStore.read(function(err, gridResult) {
                                                if (err) {
                                                    gridStore.close(function(err, result) {
                                                        res.code = 500;
                                                        res.message = "Error getting file from database";
                                                        callback(null, res);
                                                    });
                                                } else {
                                                    gridStore.close(function(err, result) {
                                                        res.code = 200;
                                                        res.message = "Success";
                                                        res.data = {
                                                            filename:gridStore.filename,
                                                            content_type:gridStore.contentType,
                                                            buffer:gridResult
                                                        }
                                                        callback(null, res);
                                                    });
                                                }
                                            })
                                        })
                                    } else {
                                        res.code = 400;
                                        res.message = "Bad request";
                                        callback(null, res);
                                    }
                                }
                            });
                        } else {
                            res.code = 400;
                            res.message = "Bad request";
                            callback(null, res);
                        }
                    }    
                })
            } else {
                coll.findOne({
                    is_deleted:false,
                    _id: new ObjectId(msg.asset_id),
                    $or:[
                        {
                            owner_id: new ObjectId(msg.user_id)   
                        },
                        {
                            sharedUsers:new ObjectId(msg.user_id)
                        }
                    ]
                }, function(err,result){
                    if(err) {
                        res.code = 500;
                        res.message = "Internal server error";
                        callback(null, res);
                    } else {
                        if(result){
                            //TODO download file
                            var gridStore = new GridStore(mongo.getDb(), result.file_id, 'r',{root:'assets'});
                            gridStore.open(function(err, gridStore) {
                                gridStore.read(function(err, gridResult) {
                                    if (err) {
                                        gridStore.close(function(err, result) {
                                            res.code = 500;
                                            res.message = "Error getting file from database";
                                            callback(null, res);
                                        });
                                    } else {
                                        gridStore.close(function(err, result) {
                                            res.code = 200;
                                            res.message = "Success";
                                            res.data = {
                                                filename:gridStore.filename,
                                                content_type:gridStore.contentType,
                                                buffer:gridResult
                                            }
                                            callback(null, res);
                                        });
                                    }
                                })
                            })
                        } else {
                            res.code = 400;
                            res.message = "Bad request";
                            callback(null, res);
                        }
                    }    
                })
            }
        });
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);  
    } 
}

exports.addAsset = addAsset;
exports.getAssets = getAssets;
exports.deleteAsset = deleteAsset;
exports.addOrRemoveStarredAsset = addOrRemoveStarredAsset;
exports.shareAsset = shareAsset;
exports.downloadAsset = downloadAsset;