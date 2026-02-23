const router = require("express").Router();
const clientController = require('../controllers/client.controllers');
const { authMiddleware, requireRole } = require("../midllewares/auth");

router.get('/:clientId', authMiddleware, requireRole("CLIENT" , "ADMIN"), clientController.getOrdersByClient);

module.exports = router;
