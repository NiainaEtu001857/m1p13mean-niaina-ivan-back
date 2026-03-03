const router = require("express").Router();
const clientController = require("../controllers/client.controllers");
const serviceController= require("../controllers/service.controllers");
const validate = require("../midllewares/client.validator");
const { clientLogin } = require("../controllers/auth.controllers");
const { authMiddleware } = require("../midllewares/auth");




router.post("/login", clientLogin);
router.post("/create", validate.register, clientController.register);

router.get("/shops", authMiddleware, clientController.getShops);
router.get("/clients",authMiddleware, clientController.getClients);
router.get("/shop/:id/services", authMiddleware, serviceController.getServicesByShopId);

module.exports = router;
