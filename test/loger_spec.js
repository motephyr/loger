"use strict";

var Loger = require("../index.js"),
  should = require('chai').should();
//  sinon = require('sinon');

describe("Test Loger", function() {
  describe('mongodb', function() {
    var loger = Loger({db: 'mongodb://localhost:27017/logertest'})

    it('should initial once',function(){
        var another_loger = Loger({a: 1})

        loger.should.be.equal(another_loger)
    });

    it('not pass argument should be use default value',function(){
        loger.should.be.ok;
    });

    it('test log',function(){
        loger.should.respondTo('log')
    });

    it('test info',function(){
        loger.should.respondTo('info')
    });

    it('test warn',function(){
        loger.should.respondTo('warn')
    });

    it('test debug',function(){
        loger.should.respondTo('debug')
    });

    it('test error',function(){
        loger.should.respondTo('error')
    });

    it('test statWithlog',function(){
        loger.statWithlog("test",{a: 1});
        loger.should.respondTo('statWithlog')
    });

  // pending test below
  });
  // before(function() {
  //   console.log("top before");
  // });
  // after(function() {
  //   console.log("top after");
  // });
  // beforeEach(function() {
  //   console.log("top beforeEach");
  // });
  // afterEach(function() {
  //   console.log("top afterEach");
  // });
})
