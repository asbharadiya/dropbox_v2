var kafka = require('kafka-node');

function ConnectionProvider() {

    this.getConsumer = function(topic_name,callback) {
        if (!this.kafkaConsumerConnection) {
            var _this = this;
            var client = new kafka.Client("localhost:2181");
            client.on('ready', function () { 
                var tId = setInterval(function(){
                    client.loadMetadataForTopics([topic_name], function (error, results) {
                        if(Object.keys(results[1].metadata).length > 0){
                            console.log('consumer ready') 
                            _this.kafkaConsumerConnection = new kafka.Consumer(client,[{ topic: topic_name, partition: 0 }]);
                            clearInterval(tId);
                            callback(_this.kafkaConsumerConnection);
                        }
                    });
                },100);
                
            })
        } else {
            callback(this.kafkaConsumerConnection);
        }
    };

    this.getProducer = function() {
        if (!this.kafkaProducerConnection) {
            var client = new kafka.Client("localhost:2181");
            this.kafkaProducerConnection = new kafka.HighLevelProducer(client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;