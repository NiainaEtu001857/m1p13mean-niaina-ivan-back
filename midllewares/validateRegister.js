module.exports = ( req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Missing fields"});

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ meassage: "Invalid email format"});

    next();
};