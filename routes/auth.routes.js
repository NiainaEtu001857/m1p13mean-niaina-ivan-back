const router = require("express").Router();
const { register, userLogin, logout } = require("../controllers/auth.controllers");
const validateRegister = require ("../midllewares/validateRegister");


router.post("/register", validateRegister, register);
router.post("/login", userLogin);
router.post("/logout", logout);

module.exports = router;