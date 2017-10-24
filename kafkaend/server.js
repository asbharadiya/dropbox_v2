var connection =  new require('./kafka/connection');
var auth = require('./services/auth');

var mongo = require('./services/mongo');

var topic_name = 'dropbox';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

console.log('server is running');

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    switch (message.key) {
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
        default:
            return;
    }
});