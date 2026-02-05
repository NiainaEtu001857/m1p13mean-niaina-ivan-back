const mogoose = require("mongoose");

const userShema = new mogoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "SHOP", "CLIENT"],
        default: "CLIENT"
    }
}, { timestamps: true });

module.exports = mogoose.model("User", userSchema);