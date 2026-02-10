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
    const { name, brand, type, shop, min_quantity, base_unity } = req.body;

     if (!name || !brand || !type || !shop ||!base_unity || !min_quantity) {
        return res.status(400).json({ error: "Required fields cannot be empty" });
    }
    if (typeof min_quantity !== "number" || min_quantity < 0) {
        return res.status(400).json({ error: "Min quantity must be a positive number" });
    }
    next();
};

module.exports.vStock = (req, res, next) => {
    const { service, quantity, sale_price, purchase_price } = req.body;

    if (!service || quantity === undefined || sale_price === undefined || purchase_price === undefined) {
        return res.status(400).json({ error: "Required fields cannot be empty" });
    }

    if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    if (typeof sale_price !== "number" || sale_price < 0) {
        return res.status(400).json({ error: "Sale price must be a positive number" });
    }

    if (typeof purchase_price !== "number" || purchase_price < 0) {
        return res.status(400).json({ error: "Purchase price must be a positive number" });
    }

    const { Types } = require('mongoose');
    if (!Types.ObjectId.isValid(service)) {
        return res.status(400).json({ error: "Invalid service id" });
    }

    next(); 
};
