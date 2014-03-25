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
        required: false
    },
    upvotes: Number,
    downvotes: Number,
    access: Number, // 0 public, 1 private
    gender: Number, // 0 male, 1 female, 2 unisex
    smell: {    // how much smell
        type: Number, 
        min: 0, max: 5, 
        required: false
    },
    cleanliness: {  // how clean
        type: Number, 
        min: 0, max: 5, 
        required: false
    }
});

bathroomSchema.virtual('netvotes').get(function () {
    var net = this.upvotes - this.downvotes;
    return (net >= 0 ? net : 0);
});

module.exports = mongoose.model('Bathroom', bathroomSchema);
