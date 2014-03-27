var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    created_at: {
        // auto added timestamp for creation of bathroom entry
        type: Date,
        default: Date.now
    },
    cleanliness: {
        type: Number,
        required: false
    },
    smell: {
        type: Number,
        required: false
    },
    amenities: {
        type: Number,
        required: false
    },
    review: String // body of review
});

module.exports = mongoose.model('Review', reviewSchema);
