const router = require("express").Router();
const orderController = require('../controllers/order.controllers');
const { authMiddleware, requireRole } = require("../midllewares/auth");

router.post('/create', authMiddleware, requireRole("CLIENT"),  orderController.addOrder);
router.get('/:id', authMiddleware, requireRole("CLIENT", "SHOP", "ADMIN"), orderController.getShopsByOrder);
router.get('/', authMiddleware, requireRole("CLIENT", "SHOP", "ADMIN"), orderController.getOrders);
router.delete('/:id', authMiddleware, requireRole("CLIENT", "SHOP", "ADMIN"), orderController.deleteOrder);

router.put('/:id', authMiddleware, requireRole("CLIENT", "SHOP", "ADMIN"), orderController.updateOrder);

module.exports = router;