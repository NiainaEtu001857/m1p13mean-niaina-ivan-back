const Service = require ("../models/Service");
const Shop= require ("../models/Shop");
const Stock = require('../models/Stock');


exports.addStock = async (req, res) => {
    try {
        const { service, quantity } = req.body;

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
            quantity
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

    const { name, detail, type, min_quantity, base_unity, attributes, sale_price } = req.body;
    let photo = null;
    if (req.file) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        photo = `${baseUrl}/public/img/services/${req.file.filename}`;
    }
    const tokenId = req.user && req.user.id;

    const { Types } = require('mongoose');
    if (!Types.ObjectId.isValid(tokenId)) {
        return res.status(400).json({ error: "Invalid shop id" });
    }

    let existingShop = await Shop.findById(tokenId);

    if (!existingShop) {
        return res.status(400).json({ error: "Invalid shop id" });
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
        min_quantity: Number(min_quantity),
        sale_price: Number(sale_price),
        base_unity,
        photo,
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

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
        const skip = (page - 1) * limit;

        const [services, totalItems] = await Promise.all([
            Service.find({ shop: shop._id }).sort({_id: -1}).skip(skip).limit(limit),
            Service.countDocuments({ shop: shop._id })
        ]);

        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (hasPaginationQuery) {
            return res.status(200).json({
                data: services,
                page,
                limit,
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1)
            });
        }

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
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
        const skip = (page - 1) * limit;

        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPaginationQuery) {
            const services = await Service.find({ shop: id });
            return res.status(200).json(services);
        }

        const [services, totalItems, shop] = await Promise.all([
            Service.find({ shop: id }).sort({ _id: -1 }).skip(skip).limit(limit),
            Service.countDocuments({ shop: id }),
            Shop.findById(id).select('_id name email type description')
        ]);

        return res.status(200).json({
            services,
            shop,
            page,
            limit,
            totalItems,
            totalPages: Math.max(Math.ceil(totalItems / limit), 1)
        });

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

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
        const skip = (page - 1) * limit;
        const serviceIds = await Service.find({ shop: shop._id }).distinct('_id');

        const [stocks, totalItems] = await Promise.all([
            Stock.find({ service: { $in: serviceIds } })
                .sort({ _id: -1})
                .skip(skip)
                .limit(limit)
                .populate({ path: 'service',select: 'name type detail ref shop sale_price' }),
            Stock.countDocuments({ service: { $in: serviceIds } })
        ]);

        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (hasPaginationQuery) {
            return res.status(200).json({
                data: stocks,
                page,
                limit,
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1)
            });
        }

        res.status(200).json(stocks);
    }
    catch (err)
    {
        res.status(500).json({ error: "Server error"});
    }
};
