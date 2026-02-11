const router = require("express").Router();
const inputValidator = require("../midllewares/shop.validator");
const controllers = require("../controllers/service.controllers");


router.get("/services",controllers.getServices)
router.post("/add", inputValidator.vService, controllers.addService);


module.exports = router;



