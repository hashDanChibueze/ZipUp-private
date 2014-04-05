var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var Bathroom = require('./bathroom.js');

var userSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String, 
        unique: true, 
        lowercase: true 
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        name: { type: String, default: '' },
        location: { type: String, default: '' }
    },

    // list of bathroom user has voted on
    voted_bathrooms: [{
        type: mongoose.Schema.Types.ObjectId , 
        ref: Bathroom
    }],

    token: {
        type: String,
        unique: true
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(5, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateRandomToken = function () {
    var user = this,
    chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    token = new Date().getTime() + '_';
    for ( var x = 0; x < 16; x++ ) {
        var i = Math.floor( Math.random() * 62 );
        token += chars.charAt( i );
    }
return token;
};

module.exports = mongoose.model('User', userSchema);
