const router = require("express").Router();
const { authMiddleware, requireRole } = require("../midllewares/auth");
const validate = require('../midllewares/shop.validator')
const service = require('./service.routes')
const stock = require('./stock.routes')
const { shopLogin } = require('../controllers/auth.controllers')
const shopController = require('../controllers/shop.controllers');
const { upload } = require('../service/photo.service');

router.post('/login', shopLogin);
router.post('/create', upload.single('photo'), validate.register, shopController.register);

router.get('/shops',authMiddleware ,shopController.getShops);
router.get('/:id' , shopController.getShopById);



router.use('/service', authMiddleware, requireRole("SHOP"),service);
router.use('/stock', authMiddleware, requireRole("SHOP"), stock);

module.exports = router;
