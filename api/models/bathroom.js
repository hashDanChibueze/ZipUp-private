var mongoose = require('mongoose');

var bathroomSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    location: {
        "lat": Number,
        "lng": Number
    },
    name: {    // name of the place
        type: String,
        required: true
    },
    upvotes: Number,
    downvotes: Number,
    access: {   // 0 public, 1 private
        type: Number,
        required: true
    },
    gender: {   // 0 male, 1 female, 2 unisex
        type: Number,
        required: true
    },
    placesID: { // google places id for associated POI
        type: String
    },
    placesRef: { // google places reference to get POI details
        type: String
    },
    floor: {
        type: String
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review'
    }]
});

bathroomSchema.virtual('netvotes').get(function () {
    var net = this.upvotes - this.downvotes;
    return (net >= 0 ? net : 0);
});

module.exports = mongoose.model('Bathroom', bathroomSchema);
