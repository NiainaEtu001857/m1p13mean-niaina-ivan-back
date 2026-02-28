const mogoose = require("mongoose");

const adminSchema = new mogoose.Schema({
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
        default: "ADMIN"
    }
}, { Timestamps: true });

module.exports = mogoose.model("Admin", adminSchema);