'use strict';
var async = require('async');
var request = require('supertest');
var assert = require('assert');
var server = require('../app');
var mongoose = require('mongoose');
var personModel = require('../models/person');
var sinon = require('sinon');

describe('Server', function(){

  var mongoSaveSpy;
  var mongoFindSpy;

  before(function(done){
    mongoose.connect('mongodb://localhost:27017/testdb');
    mongoSaveSpy = sinon.spy(personModel.prototype, 'save');
    mongoFindSpy = sinon.spy(personModel, 'find');
    done();
  });

  after(function(done){
    console.log('running after');
    mongoose.connection.db.executeDbCommand({dropDatabase:1}, function(){
      mongoose.connection.close(function(){
        done();
      });
    });
  });

  describe('GET /health', function(){
    it('should return a valid status code', function(done){
      request(server)
        .get('/health')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type',/json/)
        .end(function(err, res){
          assert.equal(err, null);
          assert.equal(res.body.status, 'hello world');
          done();
        });
    });
  });

  describe('POST /people + GET /people', function(){
    it('should insert a new person into the database', function(done){
      async.series([
        function(callback){
          request(server)
            .post('/people')
            .send({firstName:'Bobby', lastName:'Sanborn'})
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type',/json/)
            .end(function(err){
              assert.equal(err, null);
              assert.equal(mongoSaveSpy.callCount, 1);
              assert.equal(mongoSaveSpy.lastCall.thisValue.firstName, 'Bobby');
              callback(err);
            });
        },
        function(callback){
          request(server)
            .get('/people')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type',/json/)
            .end(function(err){
              assert.equal(err, null);
              assert.equal(mongoFindSpy.callCount, 1);
              callback(err);
            });
        }
      ], function (){
        done();
      });
    });
  });

});