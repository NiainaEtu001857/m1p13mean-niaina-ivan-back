const router = require("express").Router();
const clientController = require('../controllers/client.controllers');
const validate = require('../midllewares/client.validator')
const { clientLogin } = require('../controllers/auth.controllers')

router.post('/login', clientLogin);
router.post('/create',validate.register, clientController.register );

module.exports = router;
