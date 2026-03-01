const Client = require("../models/Client");
const Shop = require("../models/Shop");
const Service = require("../models/Service");

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
        const clients = await Client.find().sort({ createdAt: -1 }).select("-password -role");
        res.status(200).json(clients);
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
        const services = await Service.find().sort({ createdAt: -1 }).populate("shop", "name");
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}