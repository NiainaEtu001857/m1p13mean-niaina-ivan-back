const router = require("express").Router();
const { register, userLogin } = require("../controllers/auth.controllers");
const validateRegister = require ("../midllewares/validateRegister");


router.post("/register", validateRegister, register);
router.post("/login", userLogin);

module.exports = router;