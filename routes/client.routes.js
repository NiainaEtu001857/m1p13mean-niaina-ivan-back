const router = require("express").Router();
const clientController = require("../controllers/client.controllers");
const validate = require("../midllewares/client.validator");
const { clientLogin } = require("../controllers/auth.controllers");
const { authMiddleware } = require("../midllewares/auth");

router.post("/login", clientLogin);
router.post("/create", validate.register, clientController.register);

router.get("/shops", authMiddleware, clientController.getShops);
router.get("/shop/:id/services", authMiddleware, clientController.getServicesByShopId);

module.exports = router;
