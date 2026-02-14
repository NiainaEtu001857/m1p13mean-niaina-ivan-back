const mogoose = require("mongoose");

const userSchema = new mogoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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