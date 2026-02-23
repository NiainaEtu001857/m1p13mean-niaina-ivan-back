const Orders = require("../models/Orders");

exports.getOrdersByClient = async (req, res) => {
    try {
        const clientId = req.params.clientId;
        if (!clientId) {
            return res.status(400).json({ message: "Client ID is required" });
        }
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Orders.find({ client: clientId })
            .populate('shops.shop')
            .populate('shops.services.service')
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);

        const totalOrders = await Orders.countDocuments({ client: clientId });
        const totalPages = Math.ceil(totalOrders / limit);

        res.json({
            page,
            limit,
            totalPages,
            totalOrders,
            orders
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

