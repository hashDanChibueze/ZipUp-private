var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');

var User = require('../models/user');
var Bathroom = require('../models/bathroom');
var secrets = require('./../config/secrets');

var api = 'http://localhost:3000';

describe('Bathroom', function() {

    var user = {
        email: 'test1@test.com',
        password: 'password'
    };

    var user2 = {
        email: 'test2@test.com',
        password: 'password'
    };

    var bathroom = {
        "lat": 123.45,
        "lng": -12.43,
        "bathroom_name": "Test 1",
        "bathroom_access": 0,
        "gender": 0,
        "voteDir": 1
    }

    var invalid_bathroom = {
        "lat": 123.45,
        "name": "Test 1",
        "bathroom_access": 0,
        "gender": 0,
        "voteDir": 1
    }

    before(function(done) {
        mongoose.connect(secrets.db);
        Bathroom.remove({}, function(err) {
            User.remove(done);
        });
    });

    afterEach(function(done) {
        Bathroom.remove({}, function(err) {
            User.remove(done);
        });
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    describe('Add bathroom', function(done) {

        it('should succeed with 200 status.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(bathroom)
                        .set('cookie', cookie)
                        .end(function(err, res) {
                            res.should.have.status(200);
                            res.body.should.have.property('response', 'ok');
                            done();
                        });
                });
        });

        it('should fail because of missing fields and invalid values.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(invalid_bathroom)
                        .set('cookie', cookie)
                        .end(function(err, res) {
                            res.should.have.status(400);
                            res.body.should.have.property('response', 'fail');
                            done();
                        });
                });
        });

        it('should fail because user signs out.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .get('/signout')
                        .set('cookie', cookie)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            request(api)
                                .post('/addbathroom')
                                .send(bathroom)
                                .end(function(er, re) {
                                    re.should.have.status(401);
                                    re.body.should.have.property('response', 'fail');
                                    done();
                                });
                        });
                });
        });

    });

    describe('Get bathroom', function(done) {

        it('should succeed with 200 status.', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(bathroom)
                        .set('cookie', cookie)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('response', 'ok');
                            request(api)
                                .get('/getbathroom/'+r.body.bathroom._id)
                                .set('cookie', cookie)
                                .end(function(e2, r2) {
                                    r2.should.have.status(200);
                                    r2.body.bathroom.should.have.property('_id', r.body.bathroom._id);
                                    done();
                                });
                        });
                });
        });

    });

    describe('Add vote', function(done) {

        it('should add a vote by user2', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(bathroom)
                        .set('cookie', cookie)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('response', 'ok');
                            request(api)
                                .post('/signup/')
                                .send(user2)
                                .end(function(e2, r2) {
                                    r2.should.have.status(200);
                                    var cookie = res.headers['set-cookie'];
                                    request(api)
                                        .post('/addvote')
                                        .send({'bid': r.body.bathroom._id, 'voteDir': 1})
                                        .set('cookie', cookie)
                                        .end(function(e3, r3) {
                                            r3.should.have.status(200);
                                            r3.body.user.voted_bathrooms.should.include(r.body.bathroom._id);
                                            done();
                                        });
                                });
                        });
                });
        });

        it('should throw a 400 error because of invalis vote', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(bathroom)
                        .set('cookie', cookie)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('response', 'ok');
                            request(api)
                                .post('/signup/')
                                .send(user2)
                                .end(function(e2, r2) {
                                    r2.should.have.status(200);
                                    var cookie = res.headers['set-cookie'];
                                    request(api)
                                        .post('/addvote')
                                        .send({'bid': r.body.bathroom._id, 'voteDir': 2})
                                        .set('cookie', cookie)
                                        .end(function(e3, r3) {
                                            r3.should.have.status(400);
                                            r3.body.should.have.property('response', 'fail');
                                            done();
                                        });
                                });
                        });
                });
        });

    });

    describe('Add review', function(done) {

        it('should add a review for the current user', function(done) {
            request(api)
                .post('/signup')
                .send(user)
                .end(function(err, res) {
                    res.should.have.status(200);
                    var cookie = res.headers['set-cookie'];
                    request(api)
                        .post('/addbathroom')
                        .send(bathroom)
                        .set('cookie', cookie)
                        .end(function(e, r) {
                            r.should.have.status(200);
                            r.body.should.have.property('response', 'ok');
                            request(api)
                                .post('/addreview')
                                .send({'bid': r.body.bathroom._id, 'cleanliness': 4, 'review': 'this was awesome'})
                                .set('cookie', cookie)
                                .end(function(e2, r2) {
                                    r2.should.have.status(200);
                                    r2.body.bathroom.reviews.should.have.length(1);
                                    done();
                                });
                        });
                });
        });
    });

});
