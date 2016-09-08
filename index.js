#!/usr/bin/env node

var util = require('util');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var colors = require('colors');
var poolModule = require('generic-pool');
var key = {
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  log: 'green'
}
colors.setTheme(key);

var created;
var Loger = function Loger(option) {
  if(!created){

    var methods = Object.keys(key);
    option.safe = option.safe !== false; //default true, undefined: true, false: false, true:true, others: true
    option.poolSize = (typeof option.poolSize === 'integer') ? option.poolSize : 1;
    option.max = (typeof option.max === 'integer') ? option.max : 100;
    option.min = (typeof option.min === 'integer') ? option.min : 3;
    option.idleTimeoutMillis = (typeof option.idleTimeoutMillis === 'integer') ? option.idleTimeoutMillis : 30000;
    option.log = option.log === true;   //default false, undefined: false, false: false, true:true, others: false
    option.color_mode = option.color_mode !== false;

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

    var generateLoger = function(callerName){
      return function(message){
        if (process.env.NODE_ENV !== 'production'){
          var new_message = []
          new_message.push(util.inspect(message))
          if(arguments.length > 1){
            for (var i=1;i < arguments.length;i++){
              new_message.push(util.inspect(arguments[i]));
            }
          }

          var str = new_message.join(',');
          if (option.color_mode){
            if (methods.indexOf(callerName) != -1) {
              str = colors[callerName](str)
            }else{
              str = colors.info(str)
            }
          }
          console.log('🚦 '+ str);
        }
      };
    };


    this.stat = function Loger(collection_name, data, time) {

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

    this.statWithlog = function Loger(collection_name, data, time) {
      self.log(collection_name, data)
      self.stat(collection_name, data, time);
    }

    created = this;

    methods.forEach(function(item){
      created[item] = generateLoger(item);
    });

    this.log(option)
  }

  return created;
};


var loger = module.exports = exports = Loger;

