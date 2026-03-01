const router = require("express").Router();
const { AdminLogin, } = require("../controllers/auth.controllers");
const { getStats } = require("../controllers/admin.controllers");
const { authMiddleware, requireRole } = require("../midllewares/auth");

router.post("/login", AdminLogin );
router.get("/stats", authMiddleware, requireRole("ADMIN"), getStats);
module.exports = router;