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
        console.log(err);
    }
}


exports.getServices = async (req, res) =>
{
    try{
        const services = await Service.find().select(' _id name').sort({name: 1});

        res.status(200).json(services);

    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}
