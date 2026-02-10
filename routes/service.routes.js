const router = require("express").Router();
const inputValidator = require("../midllewares/shop.validator");
const service = require("../controllers/service.controllers");




router.post("/add", inputValidator.vService, service.addService);

module.exports = router;



