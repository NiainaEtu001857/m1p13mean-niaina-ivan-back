const User = require ("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPass,
        role
    });
    res.status(201).json({ id: user._id});
};