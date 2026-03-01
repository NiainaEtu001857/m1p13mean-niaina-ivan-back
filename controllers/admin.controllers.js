const Client = require("../models/Client");
const Shop = require("../models/Shop");
const Service = require("../models/Service");
const mongoose = require("mongoose");

exports.getStats = async (req, res) =>{
    try{
        const nbrClient = await Client.countDocuments();
        const nbrShop = await Shop.countDocuments();
        const nbrService= await Service.countDocuments();
        res.status(200).json({ nbrClient , nbrShop, nbrService });
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
