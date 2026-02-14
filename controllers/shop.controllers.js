const Shop = require ("../models/Shop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try{

    const { name, type, description, email, password } = req.body;


    const exists = await Shop.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});


    const hashedPass = await bcrypt.hash(password, 10);

    const user = await Shop.create({
        name,
        type,
        description,
        email,
        password: hashedPass,
        role: "SHOP"
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.status(201).json({message: "Shop created successfully", user, token});
    }catch (err)
    {
        return res.status(500).json({ message: "Server error"});
    }
};


