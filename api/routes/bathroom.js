var mongoose = require('mongoose');
var async = require('async');

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
                "gender": +req.body.gender
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

// exports.getBathroom = function(req, res) {
//     Bathroom.findById(req.params.id, function(err, bathroom) {
//         if (!err) {
//             return res.json(bathroom);
//         } else {
//             console.log(err);
//         }
//     })
// }

// exports.getReviews = function(req, res) {
//     Review.find({"bathroom": req.params.bid}, function(err, result) {
//         if (!err) {
//             return res.json(result);
//         } else {
//             console.log(err)
//         }
//     });
// }

// exports.addReview = function(req, res) {
//     var newReview = new Review({
//         "rating": req.body.rating,
//         "cleanliness": req.body.clean,
//         "aroma": req.body.aroma,
//         "amenities": req.body.amenities,
//         "review": req.body.review,
//         "bathroom": req.params.bid
//     });

//     newReview.save(function(err, review) {
//         if (!err) {
//             return console.log('created');
//         } else {
//             return console.log(err);
//         }
//     });
//     return res.send(newReview);
// }
