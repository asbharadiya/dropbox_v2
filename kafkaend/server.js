var connection =  new require('./kafka/connection');

var auth = require('./services/auth');
var user = require('./services/user');
var group = require('./services/group');
var asset = require('./services/asset');

var mongo = require('./services/mongo');

var topic_name = 'dropbox';


console.log('server is running');

var producer = connection.getProducer();    

connection.getConsumer(topic_name, function(consumer){
    consumer.on('message', function (message) {
        var data = JSON.parse(message.value);
        switch (data.km.value) {
            case 'signin':
                auth.signin(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'signup':
                auth.signup(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'getUserProfile':
                user.getUserProfile(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'updateUserProfile':
                user.updateUserProfile(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'getUserActivity':
                user.getUserActivity(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'searchUsers':
                user.searchUsers(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'createGroup':
                group.createGroup(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'updateGroup':
                group.updateGroup(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'addRemoveMemberGroup':
                group.addRemoveMemberGroup(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'deleteGroup':
                group.deleteGroup(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'getGroupById':
                group.getGroupById(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'getGroups':
                group.getGroups(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'serachGroups':
                group.serachGroups(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'addAsset':
                asset.addAsset(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'getAssets':
                asset.getAssets(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'deleteAsset':
                asset.deleteAsset(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'addOrRemoveStarredAsset':
                asset.addOrRemoveStarredAsset(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'shareAsset':
                asset.shareAsset(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            case 'downloadAsset':
                asset.downloadAsset(data.data, function(err,res){
                    var payloads = [
                        {   
                            topic: data.replyTo,
                            messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : res
                            }),
                            partition : 0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                    return;
                });
                break;
            default:
                return;
        }
    });
});
