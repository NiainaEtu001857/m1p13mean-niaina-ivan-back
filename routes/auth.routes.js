const router = require("express").Router();
const { register } = require("../controllers/auth.controllers");
const validateRegister = require ("../midllewares/validateRegister");


router.post("/register", validateRegister, register);

module.exports = router;