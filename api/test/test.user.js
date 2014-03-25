var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var User = require('../models/user');
var secrets = require('./../config/secrets');

var api = 'http://localhost:3000';

describe('User', function() {

    describe('local signup to test db', function() {

        before(function(done) {
            mongoose.connect(secrets.testdb);
            done();
        });

        after(function(done){
            mongoose.connection.close();
            done();
        });

        beforeEach(function(done) {
            User.remove(done);
        });

        it('should signup just fine.', function(done) {
            var user = new User({
                email: 'test1@test.com',
                password: 'password'
            });

            user.save(function(err, resuser) {
                should.not.exist(err);
                resuser.should.have.property('email', 'test1@test.com');
                done();
            });
        });

        it('should not signup because of duplicate emails.', function(done) {
            var user = new User({
                email: 'test1@test.com',
                password: 'password'
            });

            var user2 = new User({
                email: 'test1@test.com',
                password: 'password'
            });

            user.save(function(err, resuser) {
                user2.save(function(err2, newuser) {
                    should.exist(err2);
                    done();
                });
            });
        });

    });

});
