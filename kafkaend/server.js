var connection =  new require('./kafka/connection');

var auth = require('./services/auth');
var user = require('./services/user');
var group = require('./services/group');
var asset = require('./services/asset');

var mongo = require('./services/mongo');

var CHUNK_SIZE = 100 * 1024;

var topic_name = 'dropbox';

console.log('server is running');

var producer = connection.getProducer();   
var consumer = connection.getConsumer(topic_name); 

var chunk_requests = {};

consumer.on('message', function (message) {
    var data = JSON.parse(message.value)
    if(data.is_chunk_data){
        var chunk_request = chunk_requests[data.correlationId]
        if(chunk_request){
            chunk_request.chunks.push({
                data:data.chunk,
                order:data.chunk_no  
            })
        } else {
            chunk_request = {
                chunks:[
                    {
                        data:data.chunk,
                        order:data.chunk_no
                    }
                ],
                total_chunks:data.total_chunks
            }
            chunk_requests[data.correlationId] = chunk_request;
        }
        if(chunk_request.chunks.length === chunk_request.total_chunks){
            chunk_request.chunks.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);});
            var combined_chunks_data = "";
            for (var i=0;i<chunk_request.chunks.length;i++) {
                combined_chunks_data += chunk_request.chunks[i].data;
            }
            data.data.buffer = Buffer.from(combined_chunks_data,'base64');
            makeServiceCall(data);
        }
    } else {
        makeServiceCall(data);
    }
})

function makeServiceCall(data){
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
        case 'searchGroups':
            group.searchGroups(data.data, function(err,res){
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
                var chunks = sliceMyString(res.buffer.toString('base64'));
                for(var i=0;i<chunks.length;i++){
                    var payloads = [
                        { 
                            topic: data.replyTo,
                            messages: JSON.stringify({
                                correlationId:data.correlationId,
                                data:{
                                    code:res.code,
                                    message:res.message,
                                    data:res.data
                                },
                                //chunk info
                                chunk:chunks[i],
                                chunk_no:i,
                                total_chunks:chunks.length,
                                is_chunk_data:true
                            }),
                            partition:0
                        }
                    ];
                    producer.send(payloads, function(err, data){
                        //console.log(data);
                    });
                }
                return;
            });
            break;
        default:
            return;
    }
}

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
