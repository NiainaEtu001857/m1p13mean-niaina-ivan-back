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