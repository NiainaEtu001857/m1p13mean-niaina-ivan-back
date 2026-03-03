const Order = require('../models/Order')
const Service = require('../models/Service')
const Stock = require('../models/Stock')
const mongoose = require('mongoose');

exports.get = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const statusFilter = req.query.status
      ? { status: req.query.status }
      : { status: { $in: ['delivered', 'confirmed'] } };
    const skip = (page - 1) * limit;

    let clientId = req.query.clientId;
    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "ClientId invalide" });
    }
    
    const query = { client: clientId , ...statusFilter};
    const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

    if (!hasPaginationQuery) {
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    }


    const [orders, totalItems] = await Promise.all([
      Order.find(query).skip(skip).limit(limit),
      Order.countDocuments(query)
    ]);

    
    return res.status(200).json({
      data: orders,
      page,
      limit,
      totalItems,
      totalPages: Math.max(Math.ceil(totalItems / limit), 1)
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(504).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {

    const orders = await Order.find();

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(504).json({ error: error.message });
  }
};

exports.createOrder = async (req, res)=>
{
    try{
        const { clientId, shopId, items } = req.body

        if(!items || items.length === 0)
        {
            return res.status(400).json({ message: "Order must contain at least one item"})
        }

        let orderDetail = []
        let totalAmount = 0

        for (let item of items)
        {
            const service = await Service.findById(item.serviceId)

            if(!service)
            {
                return res.status(404).json({ message: "Service not found"})
            }

            const unitPrice = Number(service.sale_price || 0)
            const totalPrice = Number(item.quantity) * unitPrice

            orderDetail.push({
                service: service._id,
                serviceName: service.name,
                quantity: item.quantity,
                unitPrice,
                totalPrice 
            })
            totalAmount += totalPrice
        }


        const order = await Order.create({
            client: clientId,
            shops: [
                {
                    shop: shopId,
                    items: orderDetail
                }
            ],
            totalAmount
        })

        res.status(201).json(order)
    }catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

exports.saveOrder = async (req, res) => {
    try {
        const {shops , totalAmount} = req.body;
        const tokenId = req.userId;
        if (!tokenId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        console.log("Received order data:", { shops, totalAmount, tokenId });
        
        const savedOrder = await Order.create({
            client: tokenId,
            shops: shops,
            totalAmount: totalAmount        
        });
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: error });
    }
};


exports.getClientOrders = async (req, res) =>
{
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const query = { client: req.params.clientId };
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPaginationQuery) {
            const orders = await Order.find(query).sort({ createdAt: -1});
            return res.json(orders);
        }

        const [orders, totalItems] = await Promise.all([
            Order.find(query).sort({ createdAt: -1}).skip(skip).limit(limit),
            Order.countDocuments(query)
        ]);

        return res.json({
            data: orders,
            page,
            limit,
            totalItems,
            totalPages: Math.max(Math.ceil(totalItems / limit), 1)
        });
    }catch (error)
    {
        res.status(500).json({error: error.message})
    }
}

exports.getShopOrders = async (req, res) =>
{
    try {
        const shopId = req.params.shopId;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const query = { shops: { $elemMatch: { shop: shopId } } };
        const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

        const formatOrdersForShop = (orders) =>
            orders.map((order) => {
                const selectedShop = (order.shops || []).find(
                    (shopEntry) => String(shopEntry.shop) === String(shopId)
                );

                return {
                    _id: order._id,
                    ref: order.ref,
                    client: order.client,
                    createdAt: order.createdAt,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    items: selectedShop?.items || [],
                    shop: selectedShop?.shop || shopId
                };
            });

        if (!hasPaginationQuery) {
            const orders = await Order.find(query).sort({ createdAt: -1});
            return res.json(formatOrdersForShop(orders));
        }

        const [orders, totalItems] = await Promise.all([
            Order.find(query).sort({ createdAt: -1}).skip(skip).limit(limit),
            Order.countDocuments(query)
        ]);

        return res.json({
            data: formatOrdersForShop(orders),
            page,
            limit,
            totalItems,
            totalPages: Math.max(Math.ceil(totalItems / limit), 1)
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.updateOrderStatus = async (req, res)=>
{
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status: req.body.status },
            { new: true }
        )

        if (!order)
            return res.status(400).json({ message: "Order not found" })
        res.json(order);
    }catch (error)
    {
        res.status(500).json({error: error.message})
    }
}

exports.verifyStockAndServiceAvailability = async (req, res) => {
    try {
        const { item } = req.body;
        if (!item || !item.service) {
            return res.status(400).json({ error: "ServiceId is required" });
        }
        const stock = await Stock.findOne({ service: item.service });
        if (!stock) {
            return res.status(404).json({ error: "Stock information not found for the service" });
        }
        if (stock.quantity <= 0) {
            return res.status(400).json({ error: "Service is out of stock" });
        }
        if (item.quantity > stock.quantity) {
            return res.status(400).json({ error: "Not enough stock available for the requested quantity" });
        }
        res.json({ available: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }       
}
