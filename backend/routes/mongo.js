var MongoClient = require('mongodb').MongoClient;

var mongoURL = require('./config').dbUrl;


/**
 * Connects to the MongoDB Database with the provided URL
 */
var getConnection = function(callback){
  MongoClient.connect(mongoURL, function(err, _db){
    if (err) { 
      console.log('Could not connect: '+err);
      callback(err);
    } else {
      callback(err,_db);
    }
  });
};

/**
 * Returns the collection on the selected database
 */
var getCollection = function(name,callback){
  getConnection(function(err,db){
    if(err){
      console.log("ERROR: "+err);
      callback(err);
    } else {
      callback(err,db.collection(name)); 
    }
  })
};

exports.getCollection = getCollection;