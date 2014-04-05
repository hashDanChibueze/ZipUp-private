var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var User = require('../models/user');
var secrets = require('./../config/secrets');

var api = 'http://localhost:3000';

describe('User', function() {

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

    describe('API signup', function(done) {

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

    describe('API signin', function(done) {

        it('should sign in fine, and response should have user.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    request(api)
                        .post('/signin')
                        .send(user)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('user');
                            done();
                        });
                });
        });

        it('should not work since user does not exist.', function(done) {
            request(api)
                .post('/signin')
                .send(user)
                .end(function(e, r) {
                    r.should.have.status(400);
                    r.body.should.have.property('response', 'fail');
                    done();
                });
        });

    });

    describe('Account details', function(done) {

        it('should return the user.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var access = res.body.user.token;
                    request(api)
                        .get('/account')
                        .set('access', access)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('user');
                            done();
                        });
                });
        });

        it('should not work as user signed out.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    request(api)
                        .get('/signout')
                        .end(function(e, r) {
                            request(api)
                                .get('/account')
                                .end(function(e, r) {
                                    r.should.have.status(401);
                                    done();
                                });
                        });
                });
        });

    });

    describe('Update profile', function(done) {

        it('should update user location, name and email.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var access = res.body.user.token;
                    request(api)
                        .post('/account/profile')
                        .set('access', access)
                        .send({'email': 'new@test.com',
                                'name': 'Hello',
                                'location': 'WA'})
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('user');
                            r.body.user.should.have.property('email', 'new@test.com');
                            r.body.user.profile.should.have.property('name', 'Hello');
                            r.body.user.profile.should.have.property('location', 'WA');
                            done();
                        });
                });
        });

        it('should fail to update email as used by another account.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(e, r) {
                    r.should.have.status(200);
                    request(api)
                        .post('/signup')
                        .send({'email': 'test2@test.com', 'password': 'password'})
                        .end(function(err, res) {
                            res.should.have.status(200);
                            var access = res.body.user.token;
                            request(api)
                                .post('/account/profile')
                                .set('access', access)
                                .send({'email': user.email})
                                .end(function(e2, r2) {
                                    r2.should.have.status(400);
                                    r2.body.should.have.property('errors', 'Email is associated with another user.');
                                    done();
                                });
                        });
                });
        });

    });

    describe('Update password', function(done) {

        it('should update password.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var access = res.body.user.token;
                    request(api)
                        .post('/account/password')
                        .set('access', access)
                        .send({'password': 'newPassword'})
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('response', 'ok');
                            done();
                        });
                });
        });

    });

});
