const router = require("express").Router();
const shopController = require('../controllers/shop.controllers')
const validate = require('../midllewares/shop.validator')
const service = require('./service.routes')


router.post('/create',validate.register, shopController.register );
router.use('/service', service);

module.exports = router;


