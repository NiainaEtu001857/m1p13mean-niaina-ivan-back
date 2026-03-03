const router = require("express").Router();
const { AdminLogin, } = require("../controllers/auth.controllers");
const { getStats } = require("../controllers/admin.controllers");
const { authMiddleware, requireRole } = require("../midllewares/auth");
const { getAllClients, getAllShops, getAllServices, deleteClient } = require("../controllers/admin.controllers");

router.post("/login", AdminLogin );
router.get("/stats", authMiddleware, requireRole("ADMIN"), getStats);
router.get("/clients", authMiddleware, requireRole("ADMIN"), getAllClients);
router.delete("/clients/:id", authMiddleware, requireRole("ADMIN"), deleteClient);
router.get("/shops", authMiddleware, requireRole("ADMIN"), getAllShops);
router.get("/services", authMiddleware, requireRole("ADMIN"), getAllServices);
module.exports = router;
