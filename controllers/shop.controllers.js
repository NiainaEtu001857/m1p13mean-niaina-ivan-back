const Shop = require ("../models/Shop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Service = require("../models/Service");
const { Types } = require("mongoose");

exports.register = async (req, res) => {

    try{

    const { name, type, description, email, photo , password } = req.body;


    const exists = await Shop.findOne({ email });
    if (exists)
        return res.status(400).json({ message: "Email already exists"});


    const hashedPass = await bcrypt.hash(password, 10);

    const user = await Shop.create({
        name,
        type,
        description,
        email,
        photo,
        password: hashedPass,
        role: "SHOP"
    });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.status(201).json({message: "Shop created successfully", user, token});
    }catch (err)
    {
        return res.status(500).json({ message: "Server error"});
    }
};

exports.getShops = async (req, res) => {
    try {
       const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const shops = await Shop.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalShops = await Shop.countDocuments();
        const totalPages = Math.ceil(totalShops / limit);

        res.json({
            page,
            limit,
            totalPages,
            totalShops,
            shops
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }   
};

exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) return res.status(404).json({ message: "Shop not found" });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
// shop.controllers.js
exports.getShopAndServices = async (req, res) => {
  try {
    const shopId = req.query.shopId || req.params.shopId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" }); 
    }

    const totalServices = await Service.countDocuments({ shop: shopId });

    const services = await Service.find({ shop: shopId })
      .select('-shop')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalServices / limit);

    return res.json({
      shop,
      services,
      page,
      totalPages,
      totalServices
    });

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
};


