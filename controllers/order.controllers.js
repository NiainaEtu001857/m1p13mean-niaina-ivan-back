const Orders = require("../models/Orders");
const Shop = require("../models/Shop");

exports.addOrder = async (req, res) => {
    try {
        const { clientId, shops } = req.body

        if (!client || !shops || shops.length === 0) {
        return res.status(400).json({ message: "Client et shops sont requis" })
        }

        let total = 0   
        let client = await User.findById(clientId).select('name phone email')
        if (!client) {
            return res.status(400).json({ message: "Client non trouvé" })
        }
        shops.forEach(shop => {
        shop.services.forEach(service => {
            service.subtotal = service.quantity * service.unit_price
            total += service.subtotal
        })
        })

        const order = new Orders({
        client,
        shops,
        total_price: total
        })

        await order.save()

        res.status(201).json({
        message: "Commande créée avec succès",
        order
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erreur serveur" })
    }
};

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Orders.find()
            .select('ref total_price client createdAt') 
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 })          
            .skip(skip)
            .limit(limit);

        const totalOrders = await Orders.countDocuments();
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

exports.getShopsByOrder = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.orderId)
            .populate('shops.shop')
            .populate('shops.services.service');

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        const shopsWithTotal = order.shops.map(shopData => {
            const shopTotal = shopData.services.reduce(
                (sum, service) => sum + (service.subtotal || 0),
                0
            );

            return {
                shop: shopData.shop,
                services: shopData.services,
                shopTotal
            };
        });

        res.json(shopsWithTotal);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.deleteOrder = async (req, res) => {     
    try {
        const order = await Orders.findByIdAndDelete(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" })
        }
        res.json({ message: "Commande supprimée avec succès" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erreur serveur" })
    }       
};

exports.updateOrder = async (req, res) => {
    try {
        const { clientId, shops } = req.body
        if (!client || !shops || shops.length === 0) {
            return res.status(400).json({ message: "Client et shops sont requis" })
        }
        let total = 0
        let client = await User.findById(clientId).select('name phone email')
        if (!client) {
            return res.status(400).json({ message: "Client non trouvé" })
        }
        shops.forEach(shop => {
            shop.services.forEach(service => {
                service.subtotal = service.quantity * service.unit_price
                total += service.subtotal
            })
        })

        const order = await Orders.findByIdAndUpdate(req.params.id, {
            client,
            shops,
            total_price: total
        }, { new: true })
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" })
        }
        res.json({
            message: "Commande mise à jour avec succès",
            order
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erreur serveur" })
    }
};

exports.getServicesByShop = async (req, res) => {
    try {
        const shopId = req.params.shopId
        const shop = await Shop.findById(shopId).populate('products')
        if (!shop) {
            return res.status(404).json({ message: "Shop non trouvé" })
        }
        res.json(shop.products)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Erreur serveur" })
    }
};

