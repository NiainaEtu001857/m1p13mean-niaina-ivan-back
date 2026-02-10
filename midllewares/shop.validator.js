module.exports.register = ( req, res, next) => {
    const { name, type, description, email, password } = req.body;

    if (!name|| !type || !description ||!email || !password)
        return res.status(400).json({ message: "Missing fields"});

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ message: "Invalid email format"});

    next();
};


module.exports.vService = (req, res, next) =>
{
    const { name, price_u, brand, type, shop, min_quantity, base_unity } = req.body;

     if (!name || !brand || !type || !shop ||!base_unity || !price_u || !min_quantity) {
        return res.status(400).json({ error: "Required fields cannot be empty" });
    }

    if (typeof price_u !== "number" || price_u < 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
    }

    if (typeof min_quantity !== "number" || min_quantity < 0) {
        return res.status(400).json({ error: "Min quantity must be a positive number" });
    }
    next();
};