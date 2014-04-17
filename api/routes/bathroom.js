var mongoose = require('mongoose');
var async = require('async');

var secrets = require('./../config/secrets');
var Bathroom = require('../models/bathroom');
var User = require('../models/user');
var Review = require('../models/review');

// get details about a single bathroom
exports.getBathroom = function(req, res) {
    Bathroom.findOne({'_id': req.params.bid}, function(err, bathroom) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid bathroom requested.'
            });
        } else {
            return res.json({'response': 'ok', 'bathroom': bathroom});
        }
    });
}

// add a new bathroom to the database
exports.addBathroom = function(req, res, next) {

    req.assert('lat', 'Location has to be complete.').notEmpty();
    req.assert('lng', 'Location has to be complete.').notEmpty();
    req.assert('bathroom_name', 'Name has to be complete.').notEmpty();
    req.assert('bathroom_access', 'Access should be 1 or 2.').isInt();
    req.assert('gender', 'Gender must be provided.').isInt();
    req.assert('voteDir', 'Vote can be +1 or -1 only.').isInt();
    req.assert('floor', 'floor has to be provided.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
            });
    }

    async.waterfall([
        // build object
        function(done) {
            var newBathroom = new Bathroom({
                "location": {
                    "lat": req.body.lat,
                    "lng": req.body.lng,
                },
                "name": req.body.bathroom_name || '',
                "access": +req.body.bathroom_access,
                "gender": +req.body.gender,
                "placesID": req.body.placesID || '',
                "placesRef": req.body.placesRef || '',
                "floor": req.body.floor
            });

            voteDir = +req.body.voteDir;
            if (voteDir === 1) {
                newBathroom.upvotes = 1;
                newBathroom.downvotes = 0;
            } else if (voteDir == -1) {
                newBathroom.upvotes = 0;
                newBathroom.downvotes = 1;
            } else {
                done('Invalid vote sent.');
            }
            done(null, newBathroom)
        },
        // store object
        function(newBathroom, done) {
            newBathroom.save(function(err) {
                if (err) {
                    done('Invalid bathroom.');
                }
                done(null, newBathroom);
            });
        },
        // find user, and update vote count
        function(newBathroom, done) {
            var user = req.user;
            User.update({_id: user._id}, {$push: {'voted_bathrooms': user}}, function(err, result) {
                done(err);
            });
        }
    ], function(err) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid values passed, please fix these.'
            });
        }
        Bathroom.findOne({'name': req.body.bathroom_name,
                        'location.lat': req.body.lat,
                        'location.lng': req.body.lng}, function(err, b) {
            return res.json({'response': 'ok', 'bathroom': b});
        });
    });
}

// add vote to an existing bathroom
exports.addVote = function(req, res, next) {
    var bathroomID = req.body.bid;
    var voteDir = +req.body.voteDir;

    console.log(typeof(voteDir));
    console.log(voteDir);

    if ((voteDir !== -1) && (voteDir !== 1)) {
        return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid vote sent.'
            });
    }

    // find the bathroom
    Bathroom.findOne({'_id': bathroomID}, function(err, bathroom) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid bathroom.'
            });
        }

        // check if user has not voted for this bathroom before
        User.findOne({'_id': req.user._id, 'voted_bathrooms': bathroom._id}, function(err, user) {
            if (user) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'You have voted here already.'
                });
            }

            // update the values depending on vote direction
            if (voteDir === 1) bathroom.upvotes += 1
            else bathroom.downvotes += 1

            // update the document in db
            bathroom.save(function(err) {
                if (err) {
                    return res.send(500, {
                        'response': 'fail',
                        'errors': 'Something went wrong.'
                    });
                }

                // now update the user
                User.update({'_id': req.user._id}, { $push: { voted_bathrooms: bathroom } }, 
                    function(err) {
                    if (err) {
                        return res.send(500, {
                            'response': 'fail',
                            'errors': 'Something went wrong.'
                        });
                    }

                    User.findOne({'_id': req.user._id}, function(err, user) {
                        return res.send(200, {
                            'response': 'ok',
                            'user': user
                        });
                    });
                });

            });

        });

    });
}

// add a review for the given bathroom
exports.addReview = function(req, res, next) {

    req.assert('cleanliness', 'Rating can only be from 1 to 5.').isInt();
    req.assert('review', 'Review must be 10-2000 characters.').len(10, 2000);

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Invalid values passed, please fix these.'
            });
    }

    var bathroomID = req.body.bid;
    var cleanliness = req.body.cleanliness;
    var review = req.body.review;

    var review = new Review({
        'cleanliness': cleanliness,
        'review': review,
        'left_by': req.user
    });

    // find the bathroom
    Bathroom.findOne({'_id': bathroomID}).populate('reviews').exec(function(err, bathroom) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid bathroom.'
            });
        }

        // save the review
        review.save(function(err) {
            if (err) {
                return res.send(500, {
                    'response': 'fail',
                    'errors': 'Something went wrong.'
                });
            }

            // now add the relationship from bathroom -> review
            Bathroom.update({'_id': bathroomID}, { $push: { reviews: review } }, 
                function(err) {
                if (err) {
                    return res.send(500, {
                        'response': 'fail',
                        'errors': 'Something went wrong.'
                    });
                }

                Bathroom.findOne({'_id': bathroomID}, function(err, b) {
                    return res.send(200, {
                        'response': 'ok',
                        'bathroom': b
                    });
                });
            });

        });
    });

}

exports.getReviews = function(req, res) {

    var bathroomID = req.params.bid;

    Bathroom.findOne({'_id': bathroomID}).populate('reviews').exec(function(err, bathroom) {
        if (err) {
            return res.send(400, {
                'response': 'fail',
                'errors': 'Invalid bathroom.'
            });
        }

        res.send(200, {
            'response': 'ok',
            'bathroom': bathroom
        });
    });

}

// get all bathrooms near the passed coordinate
exports.getAllNear = function(req, res) {

    req.assert('lat', 'Rating can only be from 1 to 5.').isFloat();
    req.assert('lng', 'Review must be 10-2000 characters.').isFloat();

    var errors = req.validationErrors();

    if (errors) {
        return res.send(400, {
            'response': 'fail',
            'errors': 'Latitude and longitude must be numbers.'
            });
    }

    var lat = +req.params.lat;
    var lng = +req.params.lng;

    Bathroom.find(function(err, bathrooms) {
        if (err) {
            return res.send(500, {
                'response': 'fail',
                'errors': 'Something went wrong. Please try again later.'
            });
        }

        var result = [];

        for (var i = 0; i < bathrooms.length; i++) {
            var curBathroom = bathrooms[i].toObject();
            var distance = getDistanceFromLatLonInM(lat, lng, 
                curBathroom.location.lat, curBathroom.location.lng);

            if (distance <= secrets.maxDistance) {
                console.log(distance);
                curBathroom["distance"] = distance;
                result.push(curBathroom);
            }
        }

        res.send(200, {
            'response': 'ok',
            'bathrooms': result
        });

    });

}

// return the distance between two coordinates in metres
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
