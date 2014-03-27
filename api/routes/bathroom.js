var mongoose = require('mongoose');
var async = require('async');

var Bathroom = require('../models/bathroom');
var User = require('../models/user');

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
        //return res.json({'response': 'ok'});
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
