var MongoClient = require('mongodb').MongoClient;
var GridStore = require('mongodb').GridStore;

var config = require('config');
var mongoURL = config.dbUrl;

var connected = false;

var numberOfConnection = 151;
var cntnStack = [];
var cntnQueue = [];

var createConnectionPool = function(){
  for(var count=0; count < numberOfConnection; count++){
    MongoClient.connect(mongoURL, function(err, _db){
      if (err) { 
        throw new Error('Could not connect: '+err)
      }
      cntnStack.push(_db);
    });
  }
  connected = true;
}

setInterval(function(){
  if(cntnStack.length > 0){
    if(cntnQueue.length > 0){
      callback = cntnQueue.shift();
      db = cntnStack.pop();
      callback(null, db);
    }
  }
}, 1000)

var getConnection = function(callback){
  if(cntnStack.length > 0){
    db = cntnStack.pop();
    callback(null, db);
  } else {
    cntnQueue.push(callback);
  }
}

var getCollection = function(name,callback){
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  getConnection(function(err,db){
    if (err) {
      throw new Error('Could not connect to database');
    }
    callback(null,db.collection(name));
    cntnStack.push(db);
  });
};

var getDb = function(){
  return db;
}

var createGridStore = function(fileId,filename,mode,options,callback){
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  getConnection(function(err,db){
    if (err) {
      throw new Error('Could not connect to database');
    }
    var gridStore = new GridStore(db,fileId,filename,mode,options); 
    callback(null,gridStore);
    cntnStack.push(db);
  });                                                  
}

var readGridFS = function(fileId,mode,options,callback){
  if (!connected) {
    throw new Error('Must connect to Mongo before calling "collection"');
  }
  getConnection(function(err,db){
    if (err) {
      throw new Error('Could not connect to database');
    }
    var gridStore = new GridStore(db,fileId,mode,options); 
    gridStore.open(function(err, gridStore) {
      gridStore.read(function(err, gridResult) {
        if (err) {
          gridStore.close(function(error, result) {
            callback(err);
            cntnStack.push(db);
          });
        } else {
          gridStore.close(function(error, result) {
            var data = {
              filename:gridStore.filename,
              contentType:gridStore.contentType,
              buffer:gridResult
            }
            callback(null,data);
            cntnStack.push(db);
          });
        }
      })
    })
  });                                                  
}

exports.createConnectionPool = createConnectionPool;
exports.getCollection = getCollection;
exports.createGridStore = createGridStore;
exports.readGridFS = readGridFS;
