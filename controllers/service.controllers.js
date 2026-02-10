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

