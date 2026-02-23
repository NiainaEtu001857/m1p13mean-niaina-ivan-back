const Client = require("../models/Client");
const Shop = require("../models/Shop");
const Service = require("../models/Service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const exists = await Client.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await Client.create({
      first_name,
      last_name,
      email,
      password: hashedPass,
      role: "Client",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(201)
      .json({ message: "Client created successfully", user, token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("_id type name description email");

    res.status(200).json(shops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getServicesByShopId = async (req, res) => {
  try {
    const { id } = req.params;

    const services = await Service.find({ shop: id }).sort({ _id: -1 });
    return res.status(200).json(services);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
