const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    active: {
        type: Boolean,
        default: false
    },
    name: String,
    description: String,
    price: String,
    stock: Number,
    photos: [String],
    rents: Number,
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {
    timeStamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("Product", productSchema);