var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('./../config/secrets');

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

    passport.authenticate('local', { session: false }, function(err, user, info) {
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
    console.log("in here");
    if (req.user) {
        console.log("in if");
        return res.json({'status': 'ok', 'user': req.user});
    } else {
        console.log("in false");
        return res.json({'status': 'fail'});
    }
}

// update general profile info
exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.location = req.body.location || '';

        user.save(function(err) {
            if (err) return next(err);
            return res.json({'status': 'ok', 'user': user});
        });
    });
};

// change password for logged in user
exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.json({'status': 'fail', 'errors': errors});
    }

    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user.password = req.body.password;

        user.save(function(err) {
            if (err) return next(err);
            return res.json({'status': 'ok'});
        });
    });
};

// reset the password
exports.resetPassword = function(req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({'status': 'fail', 'errors': errors});
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
                if (!user) {
                    return res.json({'status': 'fail', 'errors': ['No account with that email address exists.']});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                host: secrets.resetPassword.hostName, // hostname
                secureConnection: secrets.resetPassword.secureConnection, // use SSL
                port: secrets.resetPassword.portN, // port for secure SMTP
                auth: {
                    user: secrets.resetPassword.user.username,
                    pass: secrets.resetPassword.user.password
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'no-reply@zipup.com',
                subject: 'Reset your password on ZipUp',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        return res.json({'status': 'ok'});
    });
}

// password reset page checks for validity of token
exports.getReset = function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({'status': 'ok'});
    }

    User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                return res.json({'status': 'fail', 'errors': ['Password reset token is invalid or has expired.']});
            }
            return res.json({'status': 'ok'});
        });
};

// process password reset request, and save user if all valid
exports.postReset = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirmPassword', 'Passwords must match.').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.json({'status': 'fail', 'errors': errors});
    }

    async.waterfall([
        function(done) {
            User
                .findOne({ resetPasswordToken: req.params.token })
                .where('resetPasswordExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        return res.json({'status': 'fail', 'errors': ['Password reset token is invalid or has expired.']});
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        if (err) return next(err);
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        }
    ], function(err) {
        if (err) return next(err);
        return res.json({'status': 'ok'});
    });
}
