const Order = require('../models/Order')
const Service = require('../models/Service')

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
            shop: shopId,
            items: orderDetail,
            totalAmount
        })

        res.status(201).json(order)
    }catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}


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
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const query = { shop: req.params.shopId };
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
