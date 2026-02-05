const mogoose = require("mongoose");

module.exports = () =>
{
    mogoose.connect(process.env.MONGO_URI);
}