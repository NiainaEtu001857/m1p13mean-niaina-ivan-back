const express = require('express');
const router = express.Router();
const  controllerStock = require('../controllers/service.controllers');
const validate = require('../midllewares/shop.validator');

router.post('/add', validate.vStock, controllerStock.addStock);

module.exports = router;
