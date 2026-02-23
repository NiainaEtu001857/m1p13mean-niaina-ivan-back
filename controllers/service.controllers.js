const Service = require ("../models/Service");
const Shop= require ("../models/Shop");
const Stock = require('../models/Stock');
const User = require('../models/User');


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

    const { name,  detail, type, min_quantity, base_unity, attributes } = req.body;
    const tokenId = req.user && req.user.id;

    const { Types } = require('mongoose');
    if (!Types.ObjectId.isValid(tokenId)) {
        return res.status(400).json({ error: "Invalid shop id" });
    }

    let existingShop = await Shop.findById(tokenId);

    if (!existingShop) {
        const authUser = await User.findById(tokenId).select('email');
        if (authUser?.email) {
            existingShop = await Shop.findOne({ email: authUser.email });
        }
    }

    if (!existingShop && Types.ObjectId.isValid(req.body.shop)) {
        existingShop = await Shop.findById(req.body.shop);
    }

    if (!existingShop) {
        return res.status(400).json({ error: "Shop not found for this account" });
    }

    const cleanAttributes = Array.isArray(attributes)
        ? attributes
            .map((attr) => ({
                key: (attr?.key || '').trim(),
                value: (attr?.value || '').trim()
            }))
            .filter((attr) => attr.key && attr.value)
        : [];

    const service = await Service.create({
        name,
        detail,
        type,
        shop: existingShop._id,
        min_quantity,
        base_unity,
        attributes: cleanAttributes
    });

    res.status(201).json({message: "Service created successfully", service});
    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: "Server error"});
    }
}






exports.getServices = async (req, res) =>
{
    try{
        const token = req.user && req.user.id;
        const { Types } = require("mongoose");

        if (!Types.ObjectId.isValid(token))
            return res.status(401).json({ error: "Unauthorized"});

        let shop = await Shop.findById(token);

        if (!shop)
            return res.status(400).json({ error: "Pas de boutiques trouvé sur cette compte"});

        const services = await Service.find({ shop: shop._id }).sort({_id: -1}).limit(5);
        res.status(200).json(services)

    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}

exports.getServicesByShopId = async (req, res) => {
    try {
        const { id } = req.params; 

        const services = await Service.find({ shop: id });
        return res.status(200).json(services);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};



exports.getStocks = async (req, res) =>
{
    try{
        const token = req.user && req.user.id;
        const { Types } = require("mongoose");

        if (!Types.ObjectId.isValid(token))
            return res.status(401).json({ error: "Unauthorized"});

        let shop = await Shop.findById(token);
        if (!shop)
            return res.status(400).json({ error: "Pas de boutiques trouvé sur cette compte"});



        const stock = await Stock.find()
        .sort({ _id: -1})
        .populate({ path: 'service',select: 'name type detail ref shop', match: {shop: shop._id} }).sort({ _id: -1}).limit(5);

        const stocks= stock.filter((stock) =>stock.service);
        res.status(200).json(stocks);
    }
    catch (err)
    {
        res.status(500).json({ error: "Server error"});
    }
};
