const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controllers')
const { authMiddleware } = require("../midllewares/auth");

router.post('/', orderController.createOrder)

router.get('/client/:clientId', orderController.getClientOrders)

router.get('/shop/:shopId', orderController.getShopOrders)

router.patch('/:orderId/status', orderController.updateOrderStatus)

router.post('/confirm',authMiddleware, orderController.saveOrder)

router.get('/client', orderController.get);
router.get('/client/history', orderController.getOrder);

module.exports = router