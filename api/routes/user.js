var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');

var User = require('../models/user');
var secrets = require('./../config/secrets');

// validate an access token
exports.validateToken = function(req, res) {
    req.assert('token', 'Token is not valid.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
    }

    User.findOne({'token': req.params.token}, function(err, user) {
        if (err || !user) {
            return res.send(404, {
                'response': 'fail',
                'errors': 'Invalid token.'
            });
        }
        res.send(200);
    });
}

// register a new user.
exports.signup = function(req, res, next) {
    req.assert('email', 'Email is not valid.').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        console.log(err);
        if (err) {
            if (err.code === 11000 || err.code === 11001) {
                return res.send(400, {
                    'response': 'fail',
                    'errors': 'User with that email already exists.'
                });
            }
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong. Please try again later.'
                });
            }
            console.log(req.user);
            return res.json({'response': 'ok', 'user': req.user});
        });
    });
}

// login an existing user
exports.signin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.send(500, {
                'response': 'fail',
                'errors': 'Something went wrong. Please try again later.'
            });
        }
        if (!user) {
            return res.send(400, {
                'response': 'fail',
                'errors': info.message
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong. Please try again later.'
                });
            }
            return res.json({'response': 'ok', 'user': req.user});
        });
    })(req, res, next);
};

// sign out a logged in user
exports.signout = function(req, res) {
    req.logout();
    User.findOne({'token': req.headers.access}, function(err, user) {
        user.token = '';
        user.save(function(err) {
            if (err) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong. Please try again later.'
                });
            }
            return res.json({'response': 'ok'});
        });
    });
};

// get details about the logged in user
exports.userDetails = function(req, res) {
    if (req.user) {
        return res.json({'response': 'ok', 'user': req.user});
    } else {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Please sign in first.'
        });
    }
}

// update general profile info
exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) {
            return res.send(500, {
                'response': 'fail',
                'errors': 'Something went wrong. Please try again later.'
            });
        }
        user.email = req.body.email || user.email;
        user.profile.name = req.body.name || user.profile.name;
        user.profile.location = req.body.location || user.profile.name;

        user.save(function(err) {
            if (err) {
                if (11000 === err.code || 11001 === err.code) {
                    return res.send(400, {
                        'response': 'fail',
                        'errors': 'Email is associated with another user.'
                    });
                }
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong. Please try again later.'
                });
            }
            return res.json({'response': 'ok', 'user': user});
        });
    });
};

// change password for logged in user
exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);

    var errors = req.validationErrors();

    if (errors) {
        return res.send(500, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return res.send(500, {
                'response': 'fail',
                'errors': 'Something went wrong. Please try again later.'
            });
        }

        user.password = req.body.password;

        user.save(function(err) {
            if (err) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong. Please try again later.'
                });
            }
            return res.json({'response': 'ok'});
        });
    });
};

// reset the password
exports.resetPassword = function(req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
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
                    return res.send(400, {
                        'response': 'fail',
                        'errors': 'No account with that email address exists.'
                    });
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
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid values passed, please fix these.'
            });
        }
        return res.json({'response': 'ok'});
    });
}

// password reset page checks for validity of token
exports.getReset = function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({'response': 'ok'});
    }

    User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                return res.send(400, {
                    'response': 'fail',
                    'errors': 'Password reset token is invalid or has expired.'
                });
            }
            return res.json({'response': 'ok'});
        });
};

// process password reset request, and save user if all valid
exports.postReset = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
        });
    }

    async.waterfall([
        function(done) {
            User
                .findOne({ resetPasswordToken: req.params.token })
                .where('resetPasswordExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        return res.send(400, {
                            'response': 'fail',
                            'errors': 'Password reset token is invalid or has expired.'
                        });
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        if (err) {
                            return res.send(500, {
                                'response': 'fail',
                                'errors': 'Something went wrong. Please try again later.'
                            });                          
                        }
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        }
    ], function(err) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid values passed, please fix these.'
            });
        }
        return res.json({'response': 'ok'});
    });
}
