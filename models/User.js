const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PassportLocalMongooseEmail = require('passport-local-mongoose-email');
const PassportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: String,
    profilePic: String,
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    status: {
        type: String,
        enum: ["Pending Confirmation", "Active"],
        default: "Pending Confirmation"
    },
    confirmationCode: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timeStamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

userSchema.plugin(PassportLocalMongoose, { usernameField: "email" });
userSchema.plugin(PassportLocalMongooseEmail, { usernameField: "email" });
module.exports = mongoose.model("User", userSchema);