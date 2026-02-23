const Shop = require ("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try{

    const { first_name, last_name,  email, password } = req.body;

    const exists = await Shop.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});

      if (!process.env.JWT_SECRET)
     {
         throw new Error("JWT_SERCRE is not defined");
     }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await Shop.create({
        first_name,
        last_name,
        email,
        password: hashedPass,
        role: "Client"
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


