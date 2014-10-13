var async = require('async');
var request = require('supertest');
var assert = require('assert');
var server = require('../server');

describe('Server', function(){

  before(function(){
    console.log('running before');
  });

  after(function(){
    console.log('running after');
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
        })
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
            .end(function(err, res){
              assert.equal(err, null);
              callback(err);
            })
        },
        function(callback){
          request(server)
            .get('/people')
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type',/json/)
            .end(function(err, res){
              assert.equal(err, null);
              assert.equal(res.body.people, 1);
              callback(err);
            })
        }
      ], function (){
        done();
      });
    });
  });

});