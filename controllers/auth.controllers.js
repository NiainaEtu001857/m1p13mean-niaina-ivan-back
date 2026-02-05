const User = require ("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});


    const allowedRoles = ["CLIENT", "SHOP"];
    let userRole = role;

    if (!role || !allowedRoles.includes(role))
        userRole = "CLIENT";



    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPass,
        role
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.status(201).json({ token });
};


exports.login = async (req, res) =>
{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Invalid password"});

    const token = jwt.sign(
        { id: user._id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: "1d"}
    );
    res.json({ token });
}