const router = require("express").Router();
const { register, login } = require("../controllers/auth.controllers");
const validateRegister = require ("../midllewares/validateRegister");


router.post("/register", validateRegister, register);
router.post("/login", login);

module.exports = router;