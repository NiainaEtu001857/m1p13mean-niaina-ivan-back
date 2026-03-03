module.exports = ((requireRole) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized"});

    if (req.user.role !== requireRole)
    {
        console.error(req.user.role);
        return res.status(403).json( { message: "Forbidden"});
    }
    next();
})
