var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectId;

function createGroup(msg, callback){
    var res = {};
    if(msg.name && msg.name !== '') {
        mongo.getCollection('groups', function(err,coll){
            coll.findOne({
                owner_id:new ObjectId(msg.user_id),
                name:msg.name
            }, function(err,result){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if(result){
                        res.code = 409;
                        res.message = "Group with given name already exists";
                        callback(null, res);
                    } else {
                        var curr_date = new Date();
                        coll.insert({
                            owner_id:new ObjectId(msg.user_id),
                            name:msg.name,
                            created_date:curr_date
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
                }
            })
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

function updateGroup(msg, callback){
    var res = {};
    if(msg.name && msg.name !== '') {
        mongo.getCollection('groups', function(err,coll){
            coll.findOne({
                owner_id:new ObjectId(msg.user_id),
                name:msg.name,
                _id:{$ne:new ObjectId(msg.group_id)}
            }, function(err,result){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if(result){
                        res.code = 409;
                        res.message = "Group with given name already exists";
                        callback(null, res);
                    } else {
                        coll.updateOne(
                        {
                            _id:new ObjectId(msg.group_id),
                            owner_id:new ObjectId(msg.user_id)
                        },
                        {
                            $set: {
                                name:msg.name
                            }
                        }, function(err,result){
                            if(err) {
                                res.code = 500;
                                res.message = "Internal server error";
                                callback(null, res);
                            } else {
                                if(result.result.nModified === 0){
                                    res.code = 404;
                                    res.message = "Group not found";
                                    callback(null, res);
                                } else {
                                    res.code = 200;
                                    res.message = "Success";
                                    callback(null, res);
                                }
                            }     
                        });
                    }
                }
            })
        })
    } else {
        res.code = 400;
        res.message = "Fields missing";
        callback(null, res);
    }
}

function addRemoveMemberGroup(msg, callback){
    var res = {};
    if(msg.group_id && msg.group_id !== ''
        || msg.member_id && msg.member_id !== ''
        || msg.action && msg.action !== '') {
        mongo.getCollection('groups', function(err,coll){
            coll.findOne({
                owner_id:new ObjectId(msg.user_id),
                _id:new ObjectId(msg.group_id)
            }, function(err,result){
                if(err) {
                    res.code = 500;
                    res.message = "Internal server error";
                    callback(null, res);
                } else {
                    if(result){
                        if(msg.action === 'ADD'){
                            coll.updateOne(
                            {
                                _id:new ObjectId(msg.group_id)
                            },
                            {
                                $addToSet: {
                                    members:new ObjectId(msg.member_id)
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
                        } else if(msg.action === 'REMOVE') {
                            coll.updateOne(
                            {
                                _id:new ObjectId(msg.group_id)
                            },
                            {
                                $pull: {
                                    members:new ObjectId(msg.member_id)
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
                    } else {
                        res.code = 404;
                        res.message = "Group not found";
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

function deleteGroup(msg, callback){
    var res = {};
    mongo.getCollection('groups', function(err,coll){
        coll.deleteOne(
        {
            _id:new ObjectId(msg.group_id),
            owner_id:new ObjectId(msg.user_id)
        }, function(err,result){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                if(result.result.n === 0){
                    res.code = 404;
                    res.message = "Group not found";
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

function getGroupById(msg, callback){
    var res = {};
    mongo.getCollection('groups', function(err,coll){
        coll.aggregate([{
            $match: {
                owner_id:new ObjectId(msg.user_id),
                _id:new ObjectId(msg.group_id)
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "members",
                foreignField: "_id",
                as: "members"
            }
        },
        {
            $project:{
                "members.password":false,
                "members.is_verified":false,
                "members.about":false,
                "members.contact_no":false,
                "members.education":false,
                "members.occupation":false,
            }
        }], function(err,result){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                if(result){
                    res.code = 200;
                    res.message = "Success";
                    res.data = result[0];
                    callback(null, res);
                } else {
                    res.code = 404;
                    res.message = "Group not found";
                    callback(null, res);
                }
            }
        });
    })
}

function getGroups(msg, callback){
    var res = {};
    mongo.getCollection('groups', function(err,coll){
        coll.find({
            owner_id:new ObjectId(msg.user_id)
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

function searchGroups(msg, callback){
    var res = {};
    mongo.getCollection('groups', function(err,coll){
        coll.find({
            name:new RegExp('.*'+msg.query+'.*','gi'),
            owner_id:new ObjectId(msg.user_id)
        },
        {
            owner_id:false,
            created_date:false
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

exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.addRemoveMemberGroup = addRemoveMemberGroup;
exports.deleteGroup = deleteGroup;
exports.getGroupById = getGroupById;
exports.getGroups = getGroups;
exports.searchGroups = searchGroups;