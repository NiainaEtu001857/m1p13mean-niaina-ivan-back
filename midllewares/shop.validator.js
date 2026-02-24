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
    const { name, detail, type, min_quantity, base_unity, sale_price } = req.body;

     if (!name || !detail || !type || !base_unity || min_quantity === undefined || sale_price === undefined) {
        return res.status(400).json({ error: "Required fields cannot be empty" });
    }


    const min_quantity_number = Number(min_quantity);
    const salePriceNumber = Number(sale_price);

    if (!Number.isFinite(min_quantity_number) || min_quantity_number <= 0) {
        
        return res.status(400).json({ error: "Min quantity must be a positive number" });
    }

    if (!Number.isFinite(salePriceNumber) || salePriceNumber < 0) {
        return res.status(400).json({ error: "Sale price must be a positive number" });
    }
    next();
};

module.exports.vStock = (req, res, next) => {
    const { service, quantity } = req.body;

    if (!service || quantity === undefined) {
        return res.status(400).json({ error: "Required fields cannot be empty" });
    }

    if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    const { Types } = require('mongoose');
    if (!Types.ObjectId.isValid(service)) {
        return res.status(400).json({ error: "Invalid service id" });
    }

    next(); 
};
