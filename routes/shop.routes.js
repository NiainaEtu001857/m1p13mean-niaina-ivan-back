const router = require("express").Router();
const shopController = require('../controllers/shop.controllers');
const { authMiddleware, requireRole } = require("../midllewares/auth");
const validate = require('../midllewares/shop.validator')
const service = require('./service.routes')
const stock = require('./stock.routes')
const { shopLogin } = require('../controllers/auth.controllers')


router.post('/login', shopLogin);

router.post('/create',validate.register, shopController.register );
router.use('/service', authMiddleware, requireRole("SHOP"),service);
router.use('/stock', authMiddleware, requireRole("SHOP"), stock);
router.get('/:id', authMiddleware , requireRole("SHOP", "CLIENT" ,"ADMIN"), shopController.getShopById);
router.get('/', authMiddleware ,  shopController.getShops);
router.get('/services/:id', authMiddleware , shopController.getShopAndServices);

module.exports = router;

