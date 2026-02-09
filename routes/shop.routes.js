const router = require("express").Router();
const shopController = require('../controllers/shop.controllers')
const validate = require('../midllewares/shop.validator')


router.post('/create',validate.register, shopController.register );


module.exports = router;


