var crypto = require('crypto');
var conn = require('./connection');

var config = require('config');
var kafkaResponseTopic = config.kafkaResponseTopic;

var KeyedMessage = require('kafka-node').KeyedMessage;

var TIMEOUT=8000; //time to wait for response in ms
var self;

exports = module.exports =  KafkaRPC;

function KafkaRPC(){
    self = this;
    this.connection = conn;
    this.requests = {}; //hash to store request in wait for response
    this.response_queue = false; //placeholder for the future queue
    this.producer = this.connection.getProducer();
    //
    this.chunk_responses = {};
}

KafkaRPC.prototype.makeRequest = function(topic_name, key, content, callback){

    self = this;
    //generate a unique correlation id for this call
    var correlationId = crypto.randomBytes(16).toString('hex');
    
    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function(corr_id){
        //if this ever gets called we didn't get a response in a
        //timely fashion
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    //create a request entry to store in a hash
    var entry = {
        callback:callback,
        timeout: tId //the id for the timeout so we can clear it
    };
    //put the entry in the hash so we can match the response later
    self.requests[correlationId]=entry;

    //make sure we have a response topic
    self.setupResponseQueue(self.producer,topic_name,function(){
        //put the request on a topic
        var km = new KeyedMessage('key', key)
        var payloads = [
            { 
                topic: topic_name, 
                messages: JSON.stringify({
                    correlationId:correlationId,
                    replyTo:kafkaResponseTopic,
                    data:content,
                    km
                }),
                partition:0
            }
        ];
        self.producer.send(payloads, function(err, data){
            if(err) {
                var entry = self.requests[correlationId];
                //make sure we don't timeout by clearing it
                clearTimeout(entry.timeout);
                //delete the entry from hash
                delete self.requests[correlationId];
                //callback, no err
                entry.callback(err);
            }
        });
    });
};

KafkaRPC.prototype.makeChunkedRequest = function(topic_name, key, content, chunks, callback){

    self = this;
    //generate a unique correlation id for this call
    var correlationId = crypto.randomBytes(16).toString('hex');

    //create a timeout for what should happen if we don't get a response
    var tId = setTimeout(function(corr_id){
        //if this ever gets called we didn't get a response in a
        //timely fashion
        callback(new Error("timeout " + corr_id));
        //delete the entry from hash
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    //create a request entry to store in a hash
    var entry = {
        callback:callback,
        timeout: tId //the id for the timeout so we can clear it
    };
    //put the entry in the hash so we can match the response later
    self.requests[correlationId]=entry;

    //make sure we have a response topic
    self.setupResponseQueue(self.producer,topic_name,function(){
        //put the request on a topic
        var km = new KeyedMessage('key', key)

        for(var i=0;i<chunks.length;i++){
            var payloads = [
                { 
                    topic: topic_name, 
                    messages: JSON.stringify({
                        correlationId:correlationId,
                        replyTo:kafkaResponseTopic,
                        data:content,
                        //chunk info
                        chunk:chunks[i],
                        chunk_no:i,
                        total_chunks:chunks.length,
                        is_chunk_data:true,
                        //
                        km
                    }),
                    partition:0
                }
            ];
            self.producer.send(payloads, function(err, data){
                if(err) {
                    var entry = self.requests[correlationId];
                    //make sure we don't timeout by clearing it
                    clearTimeout(entry.timeout);
                    //delete the entry from hash
                    delete self.requests[correlationId];
                    //callback, no err
                    entry.callback(err);
                }
            });
        }

    });
};


KafkaRPC.prototype.setupResponseQueue = function(producer,topic_name, next){
    //don't mess around if we have a queue
    if(this.response_queue) return next();

    self = this;

    //subscribe to messages
    var consumer = self.connection.getConsumer(kafkaResponseTopic);
    consumer.on('message', function (message) {
        var data = JSON.parse(message.value);
        if(data.is_chunk_data){
            var chunk_response = self.chunk_responses[data.correlationId]
            if(chunk_response){
                chunk_response.chunks.push({
                    data:data.chunk,
                    order:data.chunk_no  
                })
            } else {
                chunk_response = {
                    chunks:[
                        {
                            data:data.chunk,
                            order:data.chunk_no
                        }
                    ],
                    total_chunks:data.total_chunks
                }
                self.chunk_responses[data.correlationId] = chunk_response;
            }
            if(chunk_response.chunks.length === chunk_response.total_chunks){
                chunk_response.chunks.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);});
                var combined_chunks_data = "";
                for (var i=0;i<chunk_response.chunks.length;i++) {
                    combined_chunks_data += chunk_response.chunks[i].data;
                }
                var response = {
                    correlationId:data.correlationId,
                    data: {
                        code:data.data.code,
                        message:data.data.message,
                        data:{
                            filename:data.data.data.filename,
                            content_type:data.data.data.content_type,
                            combined_chunks_data:combined_chunks_data
                        }
                    }
                }
                self.returnRpcResponse(response);
            }
        } else {
            self.returnRpcResponse(data);
        }
    });
    self.response_queue = true;
    return next();
};

KafkaRPC.prototype.returnRpcResponse = function(data){
    self = this;
    //get the correlationId
    var correlationId = data.correlationId;
    //is it a response to a pending request
    if(correlationId in self.requests){
        //retrieve the request entry
        var entry = self.requests[correlationId];
        //make sure we don't timeout by clearing it
        clearTimeout(entry.timeout);
        //delete the entry from hash
        delete self.requests[correlationId];
        //callback, no err
        entry.callback(null, data.data);
    }
}
