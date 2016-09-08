#!/usr/bin/env node

var util = require('util');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var colors = require('colors/safe');
var poolModule = require('generic-pool');

var created;
var Logger = function Logger(option) {
  if(!created){
    option.safe = option.safe || true;
    option.poolSize = option.poolSize || 1;
    option.max = option.max || 100;
    option.min = option.min || 3;
    option.idleTimeoutMillis = option.idleTimeoutMillis || 30000;
    option.log = option.log || false;

    var self = this;
    var isOpen = false;
    this.pool = poolModule.Pool({
      name     : 'mongoPool',
      create   : function(callback) {
        if(option.db){
          MongoClient.connect(option.db, option, function(err, database) {
            if(!err){
              assert.equal(null, err);
              if(!isOpen){
                isOpen = true;
                self.log("Connected correctly to mongodb server");
              }

              callback(err, database);
            }else{
              // self.log("Not connected mongodb server");
              callback(err, null);
            }
          });
        }else{
          callback('No mongodb setting', null);

          // db.close();
        }
      },
      destroy  : function(mongodb) {
        if(mongodb){
          mongodb.close();
        }
      },
      max      : option.max,
      min      : option.min,
      idleTimeoutMillis : option.idleTimeoutMillis,
      log      : option.log
    });

    var cleanup = function(){
      if(isOpen){
        self.log("Disconnected correctly to mongodb server");
      }
      self.pool.acquire(function (err, mongodb) {
        if(!err && mongodb){
          self.pool.drain(function() {
            self.pool.destroyAllNow();
          });
        };
      })
    }

    process.on('SIGINT', cleanup);

    this.log = function Logger(message){

      if (process.env.NODE_ENV !== 'production'){
        var new_message = []
        new_message.push(colors.yellow(util.inspect(message)))
        if(arguments.length > 1){
          for (var i=1;i < arguments.length;i++){
            new_message.push(colors.green(util.inspect(arguments[i])));
          }
        }

        if (arguments.callee.caller.name != '') {
          console.log('🚦 ' + colors.bgBlue(arguments.callee.caller.name+':') + new_message.join(','))
        }else{
          console.log('🚦 ' + new_message.join(','))
        }
      }
    }
    this.stat = function Logger(collection_name, data, time) {

      data.time = time || new Date();
      // Get the documents collection
      self.pool.acquire(function (err, mongodb) {
        if(!err && mongodb){
          var collection = mongodb.collection(collection_name);
        // Insert some documents
        collection.insertOne(data,function(){
          self.pool.release(mongodb);
        });
      }
    });
    }

    this.statWithlog = function Logger(collection_name, data, time) {
      self.log(collection_name, data)
      self.stat(collection_name, data, time);
    }

    this.log(option)

    created = this;
  }

  return created;
};


var logger = module.exports = exports = Logger;

