const Service = require ("../models/Service");



exports.addService = async (req, res) =>
{
    try{

    const { name, price_u, brand, type, shop, min_quantity, base_unity } = req.body;

    const service = await Service.create({
        name,
        price_u,
        brand,
        type,
        shop,
        min_quantity,
        base_unity
    });

    res.status(201).json({message: "Service created successfully", service});
    }catch (err)
    {
        res.status(500).json({ error: "Server error"});
    }
}

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
    res.status(201).json({ token, message: "User registered successfully" });
    } catch (err)
    {
        res.status(500).json({ error: "Server error"})
    }

};


