var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectId;

function createGroup(msg, callback){
    var res = {};
    if(msg.name && msg.name !== '') {
        mongo.getCollection('group', function(err,coll){
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
        mongo.getCollection('group', function(err,coll){
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
                                    //TODO add user activity
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

//TODO
function addRemoveMemberGroup(msg, callback){
    var res = {};
    mongo.getCollection('user_activity', function(err,coll){
        coll.find({user_id:msg.user_id}).toArray(function(err,results){
            if(err) {
                res.code = 500;
                res.message = "Internal server error";
                callback(null, res);
            } else {
                res.code = 200;
                res.message = "Success";
                res.data = results;
                callback(null, res);
            }
        });
    })
}

function deleteGroup(msg, callback){
    var res = {};
    mongo.getCollection('group', function(err,coll){
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
                    //TODO add user activity
                }
            }     
        });
    })
}

function getGroupById(msg, callback){
    var res = {};
    mongo.getCollection('group', function(err,coll){
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
                    res.code = 200;
                    res.message = "Success";
                    //TODO send members also
                    result.members = [];
                    res.data = result;
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
    mongo.getCollection('group', function(err,coll){
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

exports.createGroup = createGroup;
exports.updateGroup = updateGroup;
exports.addRemoveMemberGroup = addRemoveMemberGroup;
exports.deleteGroup = deleteGroup;
exports.getGroupById = getGroupById;
exports.getGroups = getGroups;