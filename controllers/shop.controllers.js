const Shop = require ("../models/Shop");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');

exports.getShops = async (req, res) =>
{
    try{
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
        const skip = (page - 1) * limit;

        const [shops, totalItems] = await Promise.all([
            Shop.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id type name description email'),
            Shop.countDocuments()
        ]);

        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (hasPaginationQuery) {
            return res.status(200).json({
                data: shops,
                page,
                limit,
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1)
            });
        }

        res.status(200).json(shops)

    }catch (err)
    {
        console.error(err);
        res.status(500).json({ error: 'Server error'});
    }
}


exports.getShopById = async (req, res) => {
    try {
        const shop = await Shop.find({_id: req.params.id});
        console.log(shop);
        
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        res.status(200).json(shop);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.getShopAndServices = async (req, res) => {
  try {
    const shopId = req.query.shopId || req.params.shopId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" }); // return important !
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



exports.register = async (req, res) => {

    try{
        const { name, type, description, email, password } = req.body;
        console.log("Received shop registration data:", { name, type, description, email, password });
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const photo = req.file ? `${baseUrl}/public/img/shop/${req.file.filename}` : null;

        if (!photo)
            return res.status(400).json({ message: "Photo is required" });

        console.log("Received shop registration data:", { name, type, description, email, password, photo });

        const exists = await Shop.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already exists"});

        if (!process.env.JWT_SECRET)
        {
            throw new Error("JWT_SERCRE is not defined");
        }

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

        res.status(201).json({message: "Shop created successfully" , user, token});
    }catch (err)
    {
        console.error(err);
        return res.status(500).json({ message: "Server error" , error: err.message });
    }
};


exports.getDashboard = async (req, res) => {
    try{
        const shopId = req.userId;
        console.log("Fetching dashboard for shopId:", shopId);
        const shop = await Shop.findById(shopId).select('-password');
        if (!shop) return res.status(404).json({ message: "Shop not found" }); 
        const totalOrders = await Order.countDocuments({ shop: shopId , status: 'pending' }); 
        const totalRevenue = await Order.aggregate([
            { $match: { shop: mongoose.Types.ObjectId(shopId), status: 'pending' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalServices = await Service.countDocuments({ shop: shopId });
        const totalClients = await Order.distinct('client', { shop: shopId , status: 'pending' }).count();
        const statisticsRevenue = await Order.aggregate([
            { $match: { shop: mongoose.Types.ObjectId(shopId), status: 'pending' } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: '$totalAmount' } } },
            { $sort: { _id: 1 } }
        ]);
        const listOrdersRecent = await Order.find({ shop: shopId , status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client', 'name email')
            .select('client totalAmount status createdAt'); 
        res.status(200).json({
            message: "Dashboard data fetched successfully",
            shop,
            totalOrders,
            totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
            totalServices,
            totalClients,
            statisticsRevenue,
            listOrdersRecent
        });
    }catch (err)
    {
        console.log(err);
        res.status(501).json({ message: "Server error" });
    }   
}
