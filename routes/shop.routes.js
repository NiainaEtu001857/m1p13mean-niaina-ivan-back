const router = require("express").Router();
const shopController = require('../controllers/shop.controllers')
const validate = require('../midllewares/shop.validator')
const service = require('./service.routes')
const stock = require('./stock.routes')


router.post('/create',validate.register, shopController.register );
router.use('/service', service);
router.use('/stock', stock);

module.exports = router;


