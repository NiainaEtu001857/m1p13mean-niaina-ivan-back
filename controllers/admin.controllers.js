const Client = require("../models/Client");
const Shop = require("../models/Shop");
const Service = require("../models/Service");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlySeries(rows) {
    const series = Array(12).fill(0);
    for (const row of rows) {
        if (!row?._id) continue;
        const monthIndex = Number(row._id) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            series[monthIndex] = Number(row.value || 0);
        }
    }
    return series;
}

exports.getStats = async (req, res) =>{
    try{
        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const startOfYear = new Date(Date.UTC(currentYear, 0, 1));
        const startOfNextYear = new Date(Date.UTC(currentYear + 1, 0, 1));

        const [nbrClient, nbrShop, nbrService, topSellingProducts, monthlyRevenueRows, monthlyNewClientsRows] = await Promise.all([
            Client.countDocuments(),
            Shop.countDocuments(),
            Service.countDocuments(),
            Order.aggregate([
                { $unwind: "$items" },
                {
                    $group: {
                        _id: {
                            service: "$items.service",
                            shop: "$shop"
                        },
                        product: { $first: "$items.serviceName" },
                        price: { $avg: "$items.unitPrice" },
                        quantitySold: { $sum: "$items.quantity" },
                        clients: { $addToSet: "$client" }
                    }
                },
                {
                    $lookup: {
                        from: "shops",
                        localField: "_id.shop",
                        foreignField: "_id",
                        as: "shop"
                    }
                },
                { $unwind: { path: "$shop", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        product: 1,
                        price: { $round: ["$price", 2] },
                        quantitySold: 1,
                        shop: { $ifNull: ["$shop.name", "Boutique inconnue"] },
                        clientCount: { $size: "$clients" }
                    }
                },
                { $sort: { quantitySold: -1 } },
                { $limit: 10 }
            ]),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startOfYear, $lt: startOfNextYear }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        value: { $sum: "$totalAmount" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        value: { $round: ["$value", 2] }
                    }
                }
            ]),
            Client.aggregate([
                {
                    $addFields: {
                        createdAtFromId: { $toDate: "$_id" }
                    }
                },
                {
                    $match: {
                        createdAtFromId: { $gte: startOfYear, $lt: startOfNextYear }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$createdAtFromId" },
                        value: { $sum: 1 }
                    }
                }
            ])
        ]);

        const monthlyRevenue = buildMonthlySeries(monthlyRevenueRows);
        const monthlyNewClients = buildMonthlySeries(monthlyNewClientsRows);

        res.status(200).json({
            nbrClient,
            nbrShop,
            nbrService,
            topSellingProducts,
            chartLabels: MONTH_LABELS,
            monthlyRevenue,
            monthlyNewClients
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllClients = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPaginationQuery) {
            const clients = await Client.find().sort({ _id: -1 }).select("-password -role");
            return res.status(200).json(clients);
        }

        const [clients, totalItems] = await Promise.all([
            Client.find()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .select("-password -role"),
            Client.countDocuments()
        ]);

        return res.status(200).json({
            data: clients,
            page,
            limit,
            totalItems,
            totalPages: Math.max(Math.ceil(totalItems / limit), 1)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().sort({ createdAt: -1 }).select("-password -role");
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllServices = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPaginationQuery) {
            const services = await Service.find().sort({ _id: -1 }).populate("shop", "name");
            return res.status(200).json(services);
        }

        const [services, totalItems] = await Promise.all([
            Service.find()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate("shop", "name"),
            Service.countDocuments()
        ]);

        return res.status(200).json({
            data: services,
            page,
            limit,
            totalItems,
            totalPages: Math.max(Math.ceil(totalItems / limit), 1)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID client invalide" });
        }

        const deletedClient = await Client.findByIdAndDelete(id);
        if (!deletedClient) {
            return res.status(404).json({ error: "Client introuvable" });
        }

        return res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
