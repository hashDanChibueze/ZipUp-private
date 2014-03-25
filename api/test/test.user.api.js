var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var User = require('../models/user');
var secrets = require('./../config/secrets');

var api = 'http://localhost:3000';

describe('User', function() {

    describe('API signup response', function(done) {

        var user = {
            email: 'test1@test.com',
            password: 'password'
        };

        var user2 = {
            email: 'test1@test.com',
            password: 'password'
        };

        before(function(done) {
            mongoose.connect(secrets.db);
            User.remove(done);
        });

        afterEach(function(done) {
            User.remove(done);
        });

        after(function(done) {
            mongoose.connection.close();
            done();
        });

        it('should signup just fine and return status 200.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    done();
                });
        });

        it('should not signup because of duplicate emails.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(e, r) {
                    request(api)
                        .post('/signup')
                        .send(user2)
                        .end(function(err, res) {
                            res.should.have.status(400);
                            res.body.should.have.property('errors', 'User with that email already exists.');
                            done();
                        });
                });
        });

    });

});
