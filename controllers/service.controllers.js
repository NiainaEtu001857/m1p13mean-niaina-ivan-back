const Service = require ("../models/Service");
const Shop= require ("../models/Shop");
const Stock = require('../models/Stock');


exports.addStock = async (req, res) => {
    try {
        const { service, quantity, sale_price, purchase_price } = req.body;

        const { Types } = require('mongoose');
        if (!Types.ObjectId.isValid(service)) {
            return res.status(400).json({ error: "Invalid service id" });
        }

        const existingService = await Service.findById(service);
        if (!existingService) {
            return res.status(400).json({ error: "Service not found" });
        }

        const stock = await Stock.create({
            service,
            quantity,
            sale_price,
            purchase_price
        });

        res.status(201).json({ message: "Stock added successfully", stock });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.addService = async (req, res) =>
{
    try{

    const { name,  brand, type, min_quantity, base_unity } = req.body;
    const shop = req.user && req.user.id;

    const { Types } = require('mongoose');
    if (!Types.ObjectId.isValid(shop)) {
        return res.status(400).json({ error: "Invalid shop id" });
    }
    const existingService = await Shop.findById(shop);
    if (!existingService) {
        return res.status(400).json({ error: "Shop not found" });
    }

    const service = await Service.create({
        name,
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

        res.status(200).json(services)

    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}
