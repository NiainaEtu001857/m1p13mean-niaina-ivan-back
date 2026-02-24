const Shop = require ("../models/Shop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getShops = async (req, res) =>
{
    try{
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
        const skip = (page - 1) * limit;

        const [shops, totalItems] = await Promise.all([
            Shop.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id type name description email'),
            Shop.countDocuments()
        ]);

        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (hasPaginationQuery) {
            return res.status(200).json({
                data: shops,
                page,
                limit,
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1)
            });
        }

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
