const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controllers')

router.post('/', orderController.createOrder)

router.get('/client/:clientId', orderController.getClientOrders)

router.get('/shop/:shopId', orderController.getShopOrders)

router.patch('/:orderId/status', orderController.updateOrderStatus)

module.exports = router