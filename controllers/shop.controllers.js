const Shop = require ("../models/Shop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getShops = async (req, res) =>
{
    try{
        const shops = await Shop.find().sort({_id: -1}).limit(5).select('type, name, description, email');
        res.status(200).json(shops)

    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}




exports.register = async (req, res) => {

    try{

    const { name, type, description, email, password } = req.body;


    const exists = await Shop.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});

      if (!process.env.JWT_SECRET)
     {
         throw new Error("JWT_SERCRE is not defined");
     }

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


