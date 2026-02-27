const router = require("express").Router();
const { AdminLogin, } = require("../controllers/auth.controllers");


router.post("/login", AdminLogin );

module.exports = router;