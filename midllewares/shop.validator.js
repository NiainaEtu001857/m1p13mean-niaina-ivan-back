module.exports.register = ( req, res, next) => {
    const { name, type, description, email, password } = req.body;

    if (!name|| !type || !description ||!email || !password)
        return res.status(400).json({ message: "Missing fields"});

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ meassage: "Invalid email format"});

    next();
};
