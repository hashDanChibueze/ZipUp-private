var mongoose = require('mongoose');
var async = require('async');

var Bathroom = require('../models/bathroom');
var User = require('../models/user');

// exports.getAll = function(req, res) {
//     Bathroom.find({}, function(err, all) {
//         if (err) {
//             res.json({'Error': 'Something went wrong'})
//         } else {
//             res.json({'bathrooms': all});
//         }
//     })
// }

// add a new bathroom to the database
exports.addBathroom = function(req, res, next) {

    req.assert('lat', 'Location has to be complete.').notEmpty();
    req.assert('lng', 'Location has to be complete.').notEmpty();
    req.assert('access', 'Access should be 1 or 2.').isInt();
    req.assert('gender', 'Gender should be 1 or 2 or 3.').isInt();
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
                "gender": +req.body.gender,
                "smell": +req.body.smell || 0,
                "cleanliness": +req.body.cleanliness || 0
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
                    done('Invalid bathroom accessed.');
                }
                done(null, newBathroom);
            });
        },
        // find user, and update vote count
        function(newBathroom, done) {
            var user = req.user;
            User.update({_id: user._id}, {$push: {'voted_bathrooms': user}}, function(err, result) {
                console.log(err);
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
        return res.json({'response': 'ok'});
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
