const Shop = require("../models/Shop");
const Service = require("../models/Service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Client = require("../models/Client");

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
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const skip = (page - 1) * limit;

    const [shops, totalItems] = await Promise.all([
      Shop.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id type name description email photo"),
      Shop.countDocuments()
    ]);

    const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

    if (hasPaginationQuery) {
      return res.status(200).json({
        data: shops,
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1)
      });
    }

    res.status(200).json(shops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getClients= async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [client, totalItems] = await Promise.all([
      Client.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id first_name email"),
      Client.countDocuments()
    ]);

    const hasPaginationQuery = req.query.page !== undefined || req.query.limit !== undefined;

    if (hasPaginationQuery) {
      return res.status(200).json({
        data: client,
        page,
        limit,
        totalItems,
        totalPages: Math.max(Math.ceil(totalItems / limit), 1)
      });
    }

    res.status(200).json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

