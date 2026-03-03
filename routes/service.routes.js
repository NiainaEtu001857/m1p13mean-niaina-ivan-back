const router = require("express").Router();
const inputValidator = require("../midllewares/shop.validator");
const controllers = require("../controllers/service.controllers");
const { uploadService } = require('../service/photo.service');

router.get("/services",controllers.getServices)
router.get("/services/:id", controllers.getServicesByShopId);
router.post("/add", uploadService.single('photo'), inputValidator.vService, controllers.addService);


module.exports = router;
