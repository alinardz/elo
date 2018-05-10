const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PassportLocalMongooseEmail = require('passport-local-mongoose-email');

const userSchema = new Schema({
    username: String,
    profilePic: String,
    facebookID: String,
    googleID: String,
    phone: Number,
    email: {
        type: String,
        required: false
    },
    location: {
        type: { type: String },
        coordinates: [Number]
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    confirmationCode: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        _id: Schema.Types.ObjectId
    }]
}, {
    timeStamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

userSchema.plugin(PassportLocalMongooseEmail, { usernameField: "email" });
module.exports = mongoose.model("User", userSchema);