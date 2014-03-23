var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

// register a new user.
exports.signup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.json({'status': 'fail', 'errors': errors});
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                return res.json({'status': 'fail', 'errors': ['User with that email already exists']});
            }
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            console.log(req.user);
            return res.json({'status': 'ok', 'user': req.user});
        });
    });
}

// login an existing user
exports.signin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({'status': 'fail', 'errors': errors});
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.json({'status': 'fail', 'errors': [info.message]});
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json({'status': 'ok', 'user': req.user});
        });
    })(req, res, next);
};

// sign out a logged in user
exports.signout = function(req, res) {
    req.logout();
    return res.json({'status': 'ok'});
};

// get details about the logged in user
exports.userDetails = function(req, res) {
    if (req.user) {
        return res.json({'status': 'ok', 'user': req.user});
    } else {
        return res.json({'status': 'fail'});
    }
}
