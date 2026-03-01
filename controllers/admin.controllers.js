const Client = require("../models/Client");
const Shop = require("../models/Shop");
const Service = require("../models/Service");


exports.getStats = async (req, res) =>{
    try{
        // const token = req.user && req.user.id;
        // const { Types } = require("mongoose");

        // if (!Types.ObjectId.isValid(token))
        //     return res.status(401).json({ error: "Unauthorized"});

        const clients = await Client.countDocuments();
        const shops = await Shop.countDocuments();
        const services = await Service.countDocuments();
        res.status(200).json({ clients, shops, services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}