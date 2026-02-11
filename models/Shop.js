const moogose = require('mongoose')

const shopShema = new moogose.Schema(
    {
        name:
        {
            type: String,
            require: true
        },
        type:
        {
            type: String,
            require: true
        },
        description:
        {
            type: String,
            require: true
        },
        email:
        {
            type: String,
            require: true,
            unique: true,
            math:[
                /^\S+@\S+\.\S+$/,
                'Format invalid of the email address'
            ]
        },
        password:
        {
            type: String,
            require: true
        },
        role: {
                type: String,
                default: "SHOP",
                required: true
            }

    }
);

module.exports = moogose.model('Shop', shopShema); 