const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: String,
    body,
    String,
    user: {
        type: Schema.Types.ObjectID,
        ref: "User"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model("Review", reviewSchema);