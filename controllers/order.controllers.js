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
        const orders = await Order.find({ client: req.params.clientId }).sort({ createdAt: -1})
        res.json(orders);

    }catch (error)
    {
        res.status(500).json({error: error.message})
    }
}

exports.getShopOrders = async (req, res) =>
{
    try {
        const orders = await Order.find({ shop: req.params.shopId}).sort({ createdAt: -1})
        res.json(orders);
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
            { rew: true }
        )

        if (!order)
            return res.status(400).json({ message: "Order not found" })
        res.json(order)

    } catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}
