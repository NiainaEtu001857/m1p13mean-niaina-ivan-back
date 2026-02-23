module.exports.register = ( req, res, next) => {
    const { first_name, last_name,  email, password } = req.body;

    if (!first_name || !last_name ||!email || !password)
        return res.status(400).json({ message: "Missing fields"});

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ message: "Invalid email format"});

    next();
};