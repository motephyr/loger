#!/usr/bin/env node

var util = require('util');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
var colors = require('colors');
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

var self;
var db;
var Loger = function Loger(option) {
  if(!self){

    var methods = Object.keys(key);
    option = (typeof option === 'object') ? option : {};
    option.safe = option.safe !== false; //default true, undefined: true, false: false, true:true, others: true
    option.poolSize = (typeof option.poolSize === 'number') ? option.poolSize : 1;
    option.color_mode = option.color_mode !== false;

    var generateLoger = function(callerName){
      return function(message){
        // if (process.env.NODE_ENV !== 'production'){
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
        // }
      };
    };


    this.stat = function Loger(collection_name, data, time) {

      if(db){
        data.time = time || new Date();
        // Get the documents collection
        var collection = db.collection(collection_name);
        // Insert some documents
        collection.insertOne(data);
      }
    }

    this.statWithlog = function Loger(collection_name, data, time) {
      self.log(collection_name, data)
      self.stat(collection_name, data, time);
    }

    self = this;

    methods.forEach(function(item){
      self[item] = generateLoger(item);
    });


    if(option.db){
      MongoClient.connect(option.db, option, function(err, database) {
        if(err){
          this.log("Mongodb is not start");

          return;
        }

        assert.equal(null, err);
        db = database;
        this.log("Connected correctly to mongodb server");

      });
    }else{
      this.log("No mongodb setting");

    }


    var cleanup = function(){
      if(!db){
        self.log("Disconnected correctly to mongodb server");
      }else{
        db.close();
      }
    }
    // process.on('exit', cleanup);
    // process.on('SIGINT', cleanup);

    this.log(option)
  }

  return self;
};


var loger = module.exports = exports = Loger;

