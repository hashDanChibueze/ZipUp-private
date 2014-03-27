var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    created_at: {
        // auto added timestamp for creation of bathroom entry
        type: Date,
        default: Date.now
    },
    cleanliness: {  // rating 1-5
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {   // body of review
        type: String,
        required: true
    },
    left_by: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]
});

module.exports = mongoose.model('Review', reviewSchema);
