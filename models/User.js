const mogoose = require("mongoose");

const userSchema = new mogoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Format invalid of the email address'
        ]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "SHOP", "CLIENT"],
        default: "CLIENT"
    }
}, { Timestamps: true });

module.exports = mogoose.model("User", userSchema);